import { Invoice, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Invoice[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
            date: "2025-11-28",
        },
        {
            id: "489e1d42",
            amount: 125,
            status: "processing",
            email: "example@gmail.com",
            date: "2025-11-27",
        },
        {
            id: "624bc2b1",
            amount: 500,
            status: "success",
            email: "customer@astracore.com",
            date: "2025-11-26",
        },
        {
            id: "123fd456",
            amount: 750,
            status: "failed",
            email: "failed@transaction.com",
            date: "2025-11-25",
        },
        {
            id: "987ab654",
            amount: 200,
            status: "success",
            email: "success@payment.com",
            date: "2025-11-24",
        },
    ]
}

export default async function DemoPage() {
    const data = await getData()

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
