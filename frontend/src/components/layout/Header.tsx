"use client";

import { Bell, Search } from "lucide-react";
import { IconButton, TextField, InputAdornment, Avatar } from "@mui/material";
import { CommandPalette } from "./CommandPalette";
import { useTheme } from "@/components/ThemeProvider";

export function Header() {
    const { toggleTheme } = useTheme();

    return (
        <header className="flex h-14 items-center gap-4 border-b border-outline-variant bg-surface px-6">
            <div className="flex flex-1 items-center gap-4">
                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search className="h-4 w-4" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-outline-variant bg-surface-container px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </InputAdornment>
                        ),
                    }}
                    onClick={() => {
                        const event = new KeyboardEvent("keydown", {
                            key: "k",
                            metaKey: true,
                        });
                        document.dispatchEvent(event);
                    }}
                    sx={{
                        width: { xs: '100%', md: '160px', lg: '256px' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: 'var(--md-sys-color-surface-container-highest)',
                            '&:hover': {
                                backgroundColor: 'var(--md-sys-color-surface-container-high)',
                            },
                        },
                    }}
                />
            </div>
            <div className="flex items-center gap-2">
                <IconButton
                    size="small"
                    onClick={toggleTheme}
                    sx={{
                        borderRadius: '20px',
                    }}
                >
                    <Bell className="h-4 w-4" />
                </IconButton>
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'var(--md-sys-color-primary-container)',
                        color: 'var(--md-sys-color-on-primary-container)',
                    }}
                >
                    U
                </Avatar>
            </div>
            <CommandPalette />
        </header>
    );
}
