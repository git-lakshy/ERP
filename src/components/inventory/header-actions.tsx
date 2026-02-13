'use client'

import { Download, Upload, FileText, FileSpreadsheet } from "lucide-react"
import { importProducts } from "@/lib/inventory-actions"
import { getProducts } from "@/lib/data-actions"
import { useRef, useState } from "react"
import * as XLSX from 'xlsx'
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export function InventoryHeaderActions() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isImporting, setIsImporting] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [showExportMenu, setShowExportMenu] = useState(false)

    const handleImportClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsImporting(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            await importProducts(formData)
            alert("Import successful!")
        } catch (error) {
            console.error(error)
            alert("Import failed. Please check the file format.")
        } finally {
            setIsImporting(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleExport = async (type: 'excel' | 'pdf') => {
        setIsExporting(true)
        setShowExportMenu(false)
        try {
            const products = await getProducts()

            if (type === 'excel') {
                const worksheet = XLSX.utils.json_to_sheet(products.map(p => ({
                    Name: p.name,
                    SKU: p.sku,
                    Quantity: p.quantity,
                    Price: Number(p.price),
                    Created: new Date(p.createdAt).toLocaleDateString()
                })))
                const workbook = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory")
                XLSX.writeFile(workbook, "inventory_export.xlsx")
            } else {
                const doc = new jsPDF()
                autoTable(doc, {
                    head: [['Name', 'SKU', 'Quantity', 'Price', 'Created']],
                    body: products.map(p => [
                        p.name,
                        p.sku,
                        p.quantity,
                        `$${Number(p.price).toFixed(2)}`,
                        new Date(p.createdAt).toLocaleDateString()
                    ]),
                })
                doc.save("inventory_export.pdf")
            }
        } catch (error) {
            console.error("Export failed:", error)
            alert("Failed to export products")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="flex gap-4 relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv, .xlsx, .xls, .pdf"
            />
            <button
                onClick={handleImportClick}
                disabled={isImporting}
                className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 transition-colors"
            >
                {isImporting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-white" /> : <Upload className="h-4 w-4" />}
                {isImporting ? 'Importing...' : 'Import'}
            </button>

            <div className="relative">
                <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={isExporting}
                    className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-900 transition-colors"
                >
                    {isExporting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-white" /> : <Download className="h-4 w-4" />}
                    {isExporting ? 'Exporting...' : 'Export'}
                </button>

                {showExportMenu && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg z-20">
                        <button
                            onClick={() => handleExport('excel')}
                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white text-left"
                        >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Excel
                        </button>
                        <button
                            onClick={() => handleExport('pdf')}
                            className="flex items-center w-full px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white text-left"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
