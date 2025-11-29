"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Package,
    CreditCard,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, Tooltip } from "@mui/material";
import { motion } from "framer-motion";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Products", href: "/products", icon: Package },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            initial={{ width: 240 }}
            animate={{ width: collapsed ? 64 : 240 }}
            className="relative flex h-screen flex-col border-r border-outline-variant bg-surface-container"
        >
            <div className="flex h-14 items-center justify-between px-4 border-b border-outline-variant">
                {!collapsed && (
                    <span className="text-lg font-bold tracking-tight text-on-surface">AstraCore</span>
                )}
                <IconButton
                    size="small"
                    onClick={() => setCollapsed(!collapsed)}
                    sx={{
                        borderRadius: '20px',
                        ml: 'auto',
                    }}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </IconButton>
            </div>

            <nav className="flex-1 overflow-y-auto p-2">
                <List sx={{ p: 0 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const listItem = (
                            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.href}
                                    selected={isActive}
                                    sx={{
                                        borderRadius: '12px',
                                        minHeight: 48,
                                        px: collapsed ? 1.5 : 2,
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                        '&.Mui-selected': {
                                            backgroundColor: 'var(--md-sys-color-primary-container)',
                                            color: 'var(--md-sys-color-on-primary-container)',
                                            '&:hover': {
                                                backgroundColor: 'var(--md-sys-color-primary-container)',
                                                opacity: 0.9,
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor: 'var(--md-sys-color-surface-container-high)',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: collapsed ? 0 : 40,
                                            color: 'inherit',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <item.icon className="h-5 w-5" />
                                    </ListItemIcon>
                                    {!collapsed && (
                                        <span className="ml-2 text-sm font-medium">{item.name}</span>
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );

                        return collapsed ? (
                            <Tooltip key={item.href} title={item.name} placement="right">
                                {listItem}
                            </Tooltip>
                        ) : (
                            listItem
                        );
                    })}
                </List>
            </nav>
        </motion.aside>
    );
}
