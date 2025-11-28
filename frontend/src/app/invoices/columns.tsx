"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Invoice = {
    invoiceId: string
    totalAmount: {
        amount: number
        currency: string
    }
    statusId: string
    partyIdTo: string
    customerName: string
    invoiceDate: string
}

export const columns: ColumnDef<Invoice>[] = [
    {
        id: "status",
        accessorKey: "statusId",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const statusConfig: Record<string, { label: string; className: string }> = {
                "INVOICE_IN_PROCESS": {
                    label: "In Process",
                    className: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                },
                "REQUIRES_REVIEW": {
                    label: "⚠️ Requires Review",
                    className: "bg-amber-50 text-amber-700 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 font-semibold shadow-sm"
                },
                "INVOICE_APPROVED": {
                    label: "✓ Approved",
                    className: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                },
                "INVOICE_PAID": {
                    label: "Paid",
                    className: "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
                }
            }
            const config = statusConfig[status] || {
                label: status ? status.replace(/_/g, " ") : "Unknown",
                className: "bg-gray-50 text-gray-700 border border-gray-200"
            }
            return (
                <div className={"inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap " + config.className}>
                    {config.label}
                </div>
            )
        },
    },
    {
        id: "customerName",
        accessorKey: "customerName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return row.getValue("customerName") || <span className="text-muted-foreground italic">Unknown</span>
        }
    },
    {
        id: "customerId",
        accessorKey: "partyIdTo",
        header: "Customer ID",
        cell: ({ row }) => {
            return <span className="font-mono text-xs text-muted-foreground">{row.getValue("customerId")}</span>
        }
    },
    {
        id: "amount",
        accessorKey: "totalAmount.amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.original.totalAmount?.amount?.toString() || "0")
            const currency = row.original.totalAmount?.currency || "USD"
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currency,
            }).format(amount)
            return <div className="text-right font-medium">{formatted}</div>
        },
    },
    {
        id: "date",
        accessorKey: "invoiceDate",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const invoice = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(invoice.invoiceId)}
                        >
                            Copy Invoice ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <a href={"/invoices/" + invoice.invoiceId}>View details</a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
