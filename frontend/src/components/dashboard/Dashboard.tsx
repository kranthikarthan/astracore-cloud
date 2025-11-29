"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { Avatar } from "@mui/material";

const data = [
    { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
];

export function Dashboard() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-on-surface-variant" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-on-surface">$45,231.89</div>
                        <p className="text-xs text-on-surface-variant">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                        <Users className="h-4 w-4 text-on-surface-variant" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-on-surface">+2350</div>
                        <p className="text-xs text-on-surface-variant">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <CreditCard className="h-4 w-4 text-on-surface-variant" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-on-surface">+12,234</div>
                        <p className="text-xs text-on-surface-variant">
                            +19% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <Activity className="h-4 w-4 text-on-surface-variant" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-on-surface">+573</div>
                        <p className="text-xs text-on-surface-variant">
                            +201 since last hour
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="var(--md-sys-color-on-surface-variant)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="var(--md-sys-color-on-surface-variant)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                        color: 'var(--md-sys-color-on-surface)',
                                        boxShadow: 'var(--md-sys-elevation-2)',
                                    }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="var(--md-sys-color-primary)"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", initials: "OM" },
                                { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initials: "JL" },
                                { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", initials: "IN" },
                                { name: "William Kim", email: "will@email.com", amount: "+$99.00", initials: "WK" },
                                { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", initials: "SD" },
                            ].map((person) => (
                                <div key={person.email} className="flex items-center">
                                    <Avatar
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            bgcolor: 'var(--md-sys-color-primary-container)',
                                            color: 'var(--md-sys-color-on-primary-container)',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {person.initials}
                                    </Avatar>
                                    <div className="ml-4 space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-none text-on-surface">
                                            {person.name}
                                        </p>
                                        <p className="text-sm text-on-surface-variant">
                                            {person.email}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-on-surface">{person.amount}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
