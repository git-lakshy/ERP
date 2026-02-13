'use client'

import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import { deleteProduct } from "@/lib/inventory-actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function InventoryRowActions({ productId }: { productId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter()

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this product?")) {
            setIsDeleting(true)
            try {
                await deleteProduct(productId)
                router.refresh()
            } catch (error) {
                alert("Failed to delete product")
                console.error(error)
            } finally {
                setIsDeleting(false)
            }
        }
    }

    return (
        <div className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded p-2 text-zinc-700 hover:bg-red-600/10 hover:text-red-600 transition-all"
            >
                <MoreHorizontal className="h-4 w-4" />
            </button>

            <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg hidden group-hover:block z-10">
                <button
                    onClick={() => alert("Edit feature coming soon!")}
                    className="flex items-center w-full px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white text-left"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-900/20 text-left"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? '...' : 'Delete'}
                </button>
            </div>
        </div>
    )
}
