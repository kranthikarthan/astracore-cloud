import { Invoice, columns } from "./columns"
import { DataTable } from "./data-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getServerApiUrl } from "@/lib/api"

async function getData(): Promise<Invoice[]> {
    try {
        const apiUrl = getServerApiUrl();
        
        const res = await fetch(`${apiUrl}/api/v1/invoices`, {
            cache: 'no-store', // Disable cache to ensure fresh data
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.error(`Failed to fetch invoices: ${res.status} ${res.statusText}`);
            // Return empty array instead of crashing, so the UI still renders
            return [];
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching invoices:", error);
        // Return empty array on error so the page still renders
        return [];
    }
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-on-surface">Invoices</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/invoices/new">
                        <Button>Create Invoice</Button>
                    </Link>
                </div>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
