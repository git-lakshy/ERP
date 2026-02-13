'use server'

import prisma from '@/lib/prisma'
import { ensureUserAndOrg } from '@/lib/data-actions'
import { revalidatePath } from 'next/cache'
import * as XLSX from 'xlsx'


export async function deleteProduct(productId: string) {
    const user = await ensureUserAndOrg()
    if (!user) throw new Error('Unauthorized')

    // Find product first to ensure it belongs to the user's organization
    const product = await prisma.product.findUnique({
        where: { id: productId }
    })

    if (!product || product.organizationId !== user.organizationId) {
        throw new Error('Product not found or unauthorized')
    }

    await prisma.product.delete({
        where: { id: productId }
    })

    revalidatePath('/dashboard/inventory')
}

export async function importProducts(formData: FormData) {
    const user = await ensureUserAndOrg()
    if (!user) throw new Error('Unauthorized')

    const file = formData.get('file') as File
    if (!file) throw new Error('No file uploaded')

    const buffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)

    let productsToCreate: any[] = []

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet)

        // Map data to product schema
        productsToCreate = jsonData.map((row: any) => ({
            name: row['Name'] || row['name'] || `Imported Item ${Date.now()}`,
            sku: row['SKU'] || row['sku'] || `SKU-${Math.random().toString(36).substring(7)}`,
            quantity: parseInt(row['Quantity'] || row['quantity'] || '0'),
            price: parseFloat(row['Price'] || row['price'] || '0'),
            organizationId: user.organizationId
        }))
    } else if (file.name.endsWith('.pdf')) {
        // @ts-ignore
        const pdfParse = require('pdf-parse')
        const data = await pdfParse(fileBuffer)
        const text = data.text

        // Very basic PDF parsing: Assume each line is a product in format: Name SKU Quantity Price
        // Or just create dummy products based on lines for now as PDF parsing is complex without structure
        const lines = text.split('\n').filter((line: string) => line.trim().length > 0)

        productsToCreate = lines.map((line: string, index: number) => {
            // Try to split by common separators
            const parts = line.split(/\s+/)
            if (parts.length >= 2) {
                return {
                    name: parts[0],
                    sku: `PDF-SKU-${index}-${Date.now()}`,
                    quantity: 1, // Default
                    price: 0,
                    organizationId: user.organizationId
                }
            }
            return null
        }).filter((item: any) => item !== null)
    }

    if (productsToCreate.length > 0) {
        // Use createMany for efficiency
        // Note: SQLite doesn't support createMany fully in some Prisma versions, but Postgres does.
        // We will use transaction or individual creates to be safe with potential duplicates (SKU)

        // Optimistic approach: try createMany but skipErrors if supported, or just loop
        // For simplicity and safety against unique constraints (SKU), let's loop and upsert or ignore

        for (const product of productsToCreate) {
            try {
                // Ensure SKU is unique for the org. If exists, we skip or update. Let's skip for now to avoid overwriting.
                const existing = await prisma.product.findFirst({
                    where: {
                        organizationId: user.organizationId,
                        sku: product.sku
                    }
                })

                if (!existing) {
                    await prisma.product.create({
                        data: product
                    })
                }
            } catch (error) {
                console.error("Failed to import product:", product, error)
            }
        }
    }

    revalidatePath('/dashboard/inventory')
}
