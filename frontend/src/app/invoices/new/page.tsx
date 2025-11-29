"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { getClientApiUrl, getConnectionErrorMessage } from "@/lib/api"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const invoiceLineSchema = z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.number().min(0.01, "Price must be greater than 0"),
    amount: z.number().optional(),
})

const formSchema = z.object({
    customerName: z.string().min(2, "Customer Name is required"),
    partyIdTo: z.string().min(2, "Customer ID is required"),
    invoiceDate: z.date(),
    dueDate: z.date(),
    currencyUomId: z.string().min(1, "Please select a currency."),
    lines: z.array(invoiceLineSchema).min(1, "Add at least one line item"),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateInvoicePage() {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            partyIdTo: "",
            currencyUomId: "USD",
            lines: [{ description: "", quantity: 1, unitPrice: 0, amount: 0 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "lines",
    })

    const watchLines = form.watch("lines")

    // Calculate totals
    const totalAmount = watchLines.reduce((sum, line) => {
        const lineTotal = (line.quantity || 0) * (line.unitPrice || 0)
        return sum + lineTotal
    }, 0)

    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        try {
            // Generate a random UUID for partyIdTo if it's not a valid UUID (for testing purposes)
            // In a real app, this would be selected from a list of customers
            const partyIdTo = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(values.partyIdTo)
                ? values.partyIdTo
                : "123e4567-e89b-12d3-a456-426614174000"; // Fallback UUID

            // Generate a random UUID for partyIdFrom (e.g., the company issuing the invoice)
            const partyIdFrom = "00000000-0000-0000-0000-000000000001"; // Valid Organization ID

            const payload = {
                ...values,
                partyIdTo,
                partyIdFrom,
                invoiceTypeId: "SALES_INVOICE",
                statusId: "INVOICE_IN_PROCESS",
                invoiceDate: format(values.invoiceDate, "yyyy-MM-dd"),
                dueDate: format(values.dueDate, "yyyy-MM-dd"),
                totalAmount: { amount: totalAmount, currency: values.currencyUomId },
                lines: values.lines.map(line => ({
                    ...line,
                    productId: "00000000-0000-0000-0000-000000000002", // Valid Product ID
                    amount: {
                        amount: line.quantity * line.unitPrice,
                        currency: values.currencyUomId
                    }
                }))
            }

            const apiUrl = getClientApiUrl();
            const fullUrl = `${apiUrl}/api/v1/invoices`;
            
            console.log('Creating invoice at:', fullUrl);
            console.log('Payload:', payload);

            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to create invoice: ${response.status} ${response.statusText} - ${errorText}`)
            }

            const data = await response.json()
            console.log('Invoice created:', data)
            router.push('/invoices')
            router.refresh()
        } catch (error: any) {
            console.error('Error creating invoice:', error)
            console.error('Error details:', {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
                apiUrl: getClientApiUrl()
            })
            
            // Provide more specific error messages
            let errorMessage = 'Failed to create invoice. Please try again.';
            
            if (error instanceof TypeError && error.message.includes('fetch')) {
                errorMessage = getConnectionErrorMessage();
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Use a more user-friendly notification instead of alert
            alert(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Invoice</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Header Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="customerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Customer Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Acme Corp" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="partyIdTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Customer ID</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CUST-123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="currencyUomId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Currency</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select currency" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="invoiceDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Invoice Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Due Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Line Items Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="text-lg font-medium">Line Items</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ description: "", quantity: 1, unitPrice: 0, amount: 0 })}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-lg bg-muted/20">
                                            <div className="col-span-6">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.description`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Description</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Item description" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Qty</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-3">
                                                <FormField
                                                    control={form.control}
                                                    name={`lines.${index}.unitPrice`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Price</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive/90"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Totals Section */}
                            <div className="flex justify-end pt-4 border-t">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: form.watch("currencyUomId") || 'USD' }).format(totalAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Invoice"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
