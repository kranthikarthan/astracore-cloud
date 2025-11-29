"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getClientApiUrl } from "@/lib/api"

interface InvoiceLine {
    invoiceLineId: string | null
    invoiceItemSeqId: number
    productId: string
    description: string
    quantity: number
    amount: {
        amount: number
        currency: string
    }
}

interface Invoice {
    invoiceId: string
    invoiceTypeId: string
    partyIdFrom: string
    partyIdTo: string
    customerName: string
    invoiceDate: string
    dueDate: string
    statusId: string
    currencyUomId: string
    totalAmount: {
        amount: number
        currency: string
    }
    lines: InvoiceLine[]
    createdAt: string | null
    updatedAt: string | null
}

export default function InvoiceDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<Invoice | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const apiUrl = getClientApiUrl();
                const response = await fetch(`${apiUrl}/api/v1/invoices/${params.id}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch invoice: ${response.statusText}`)
                }

                const data = await response.json()
                setInvoice(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load invoice")
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchInvoice()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="container mx-auto py-10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (error || !invoice) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error || "Invoice not found"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/invoices")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Invoices
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            "INVOICE_IN_PROCESS": {
                label: "In Process",
                className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            },
            "REQUIRES_REVIEW": {
                label: "⚠️ Requires Review",
                className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 font-semibold"
            },
            "INVOICE_APPROVED": {
                label: "Approved",
                className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            },
            "INVOICE_PAID": {
                label: "Paid",
                className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }
        }

        const config = statusConfig[status] || {
            label: status.replace(/_/g, " "),
            className: ""
        }

        return (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                {config.label}
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => router.push("/invoices")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Invoices
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Invoice Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Invoice {invoice.invoiceId.slice(0, 8)}</CardTitle>
                                <CardDescription>{invoice.invoiceTypeId}</CardDescription>
                            </div>
                            {getStatusBadge(invoice.statusId)}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
                                <p className="text-lg">{invoice.invoiceDate}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                                <p className="text-lg">{invoice.dueDate}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">From</p>
                                <p className="text-sm font-mono">{invoice.partyIdFrom}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">To</p>
                                <p className="text-lg font-semibold">{invoice.customerName || "Unknown Customer"}</p>
                                <p className="text-xs text-muted-foreground font-mono">{invoice.partyIdTo}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Line Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Line Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {invoice.lines?.map((line, index) => (
                                <div key={line.invoiceLineId || index} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{line.description}</p>
                                        <p className="text-sm text-muted-foreground">Product ID: {line.productId}</p>
                                        <p className="text-sm text-muted-foreground">Quantity: {line.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(line.amount?.amount || 0, line.amount?.currency || "USD")}</p>
                                    </div>
                                </div>
                            )) || <p className="text-muted-foreground">No line items</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Total */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total Amount</span>
                            <span>{formatCurrency(invoice.totalAmount?.amount || 0, invoice.totalAmount?.currency || "USD")}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
