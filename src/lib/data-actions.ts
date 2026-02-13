'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function ensureUserAndOrg() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.error("ensureUserAndOrg: Error fetching supabase user:", error)
        return null
    }

    if (!user) {
        return null
    }

    // Check if user exists in Prisma
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { organization: true }
    })

    if (dbUser) {
        return dbUser
    }

    // Check if user is an existing Employee in any organization
    // @ts-ignore
    const existingEmployee = await prisma.employee.findFirst({
        where: { email: user.email! }
    })

    if (existingEmployee) {
        console.log("ensureUserAndOrg: Found existing employee record, linking to Org", existingEmployee.organizationId)
        try {
            const newUser = await prisma.user.create({
                data: {
                    id: user.id,
                    email: user.email!,
                    organizationId: existingEmployee.organizationId,
                    role: 'EMPLOYEE'
                },
                include: { organization: true }
            })
            return newUser
        } catch (e: any) {
            if (e.code === 'P2002') {
                // Race condition, user already created
                return prisma.user.findUnique({ where: { id: user.id }, include: { organization: true } })
            }
            throw e
        }
    }

    // User doesn't exist and is NOT an employee, create new Organization and User
    // Generate a simple registration number (6 digits)
    const regNum = Math.floor(100000 + Math.random() * 900000)
    const orgName = `ERP ${regNum}`
    const orgSlug = `erp-${regNum}`

    try {
        // Create Org and User transactionally to ensure consistency
        // Note: In a real app, you might want to handle slug collisions, but random 6 digits is usually safe for MVP
        await prisma.organization.create({
            data: {
                name: orgName,
                slug: orgSlug,
                users: {
                    create: {
                        id: user.id, // Link to Supabase Auth ID
                        email: user.email!,
                        role: 'OWNER'
                    }
                }
            }
        })
    } catch (e: any) {
        if (e.code === 'P2002') {
            const existingUser = await prisma.user.findUnique({
                where: { id: user.id },
                include: { organization: true }
            })
            return existingUser
        } else {
            console.error("ensureUserAndOrg: Error creating Org/User", e)
            throw e
        }
    }

    // Return the newly created user (we need to fetch it to match the return type structure if needed, 
    // but create above returns Org. Let's fetch the user to be sure we return the right object)
    const newUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { organization: true }
    })

    return newUser
}

export async function updateOrganizationSettings(formData: FormData) {
    const user = await ensureUserAndOrg()
    if (!user) throw new Error('Unauthorized')

    const name = formData.get('name') as string
    const brandSymbol = formData.get('brandSymbol') as string
    const currency = formData.get('currency') as string

    // Validate brandSymbol length
    if (brandSymbol && brandSymbol.length > 3) {
        throw new Error("Brand Symbol must be 3 characters or less")
    }

    await prisma.organization.update({
        where: { id: user.organizationId },
        data: {
            name,
            // @ts-ignore
            brandSymbol,
            // @ts-ignore
            currency
        }
    })

    revalidatePath('/dashboard')
}

export async function getDashboardStats() {
    const user = await ensureUserAndOrg()
    if (!user) return null

    const orgId = user.organizationId

    const [totalProducts, lowStockCount, activeUsers, revenueResult] = await Promise.all([
        prisma.product.count({ where: { organizationId: orgId } }),
        prisma.product.count({ where: { organizationId: orgId, quantity: { lt: 10 } } }),
        prisma.user.count({ where: { organizationId: orgId } }),
        // @ts-ignore
        prisma.financeTransaction.aggregate({
            where: { organizationId: orgId, type: 'INCOME' },
            _sum: { amount: true }
        })
    ])

    return {
        totalProducts,
        lowStockCount,
        activeUsers,
        revenue: revenueResult._sum.amount?.toNumber() || 0,
    }
}

export async function getProducts() {
    const user = await ensureUserAndOrg()
    if (!user) return []

    return prisma.product.findMany({
        where: { organizationId: user.organizationId },
        orderBy: { createdAt: 'desc' }
    })
}

export async function createProduct(formData: FormData) {
    const user = await ensureUserAndOrg()
    if (!user) throw new Error('Unauthorized')

    const name = formData.get('name') as string
    const sku = formData.get('sku') as string
    const quantity = parseInt(formData.get('quantity') as string)
    const price = parseFloat(formData.get('price') as string) || 0

    await prisma.product.create({
        data: {
            name,
            sku,
            quantity,
            price,
            organizationId: user.organizationId
        }
    })

    revalidatePath('/dashboard/inventory')
}

// HRM Actions

export async function getEmployees() {
    const user = await ensureUserAndOrg()
    if (!user) return []

    // @ts-ignore
    return prisma.employee.findMany({
        where: { organizationId: user.organizationId },
        orderBy: { joinedAt: 'desc' }
    })
}

export async function createEmployee(formData: FormData) {
    const user = await ensureUserAndOrg()
    if (!user) throw new Error('Unauthorized')

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    const department = formData.get('department') as string
    const salary = parseFloat(formData.get('salary') as string)

    // @ts-ignore
    await prisma.employee.create({
        data: {
            firstName,
            lastName,
            email,
            role,
            department,
            salary,
            organizationId: user.organizationId
        }
    })

    revalidatePath('/dashboard/hr')
}

// Finance Actions

export async function getTransactions() {
    const user = await ensureUserAndOrg()
    if (!user) return []

    // @ts-ignore
    return prisma.financeTransaction.findMany({
        where: { organizationId: user.organizationId },
        orderBy: { date: 'desc' }
    })
}

export async function createTransaction(formData: FormData) {
    const user = await ensureUserAndOrg()
    if (!user) throw new Error('Unauthorized')

    const amount = parseFloat(formData.get('amount') as string)
    const type = formData.get('type') as 'INCOME' | 'EXPENSE'
    const category = formData.get('category') as string
    const description = formData.get('description') as string

    // @ts-ignore
    await prisma.financeTransaction.create({
        data: {
            amount,
            type,
            category,
            description,
            organizationId: user.organizationId
        }
    })

    revalidatePath('/dashboard/finance')
    revalidatePath('/dashboard') // Update dashboard stats
}

// Settings & Reports Actions



export async function getReportsData() {
    const user = await ensureUserAndOrg()
    if (!user) return null

    // Aggregate data for charts
    const inventoryValue = await prisma.product.aggregate({
        where: { organizationId: user.organizationId },
        _sum: { price: true, quantity: true } // Approximation: this doesn't multiply, just sums. 
        // For accurate inventory value: sum(price * quantity). Prisma doesn't support computed columns easily in aggregate.
        // We will fetch all and compute for now (assuming small dataset for MVP).
    })

    const allProducts = await prisma.product.findMany({
        where: { organizationId: user.organizationId },
        select: { price: true, quantity: true }
    })

    const totalInventoryValue = allProducts.reduce((acc, p) => acc + (Number(p.price) * p.quantity), 0)

    // @ts-ignore
    const transactions = await prisma.financeTransaction.findMany({
        where: { organizationId: user.organizationId },
        orderBy: { date: 'asc' }
    })

    return {
        totalInventoryValue,
        transactions
    }
}
