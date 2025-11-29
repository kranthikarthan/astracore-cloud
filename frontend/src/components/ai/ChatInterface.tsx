"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    });
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            {/* Floating Button */}
            <Button
                className={cn(
                    "fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg transition-all duration-300 z-50",
                    isOpen && "scale-0 opacity-0"
                )}
                onClick={() => setIsOpen(true)}
            >
                <MessageSquare className="h-6 w-6" />
            </Button>

            {/* Chat Window */}
            <div
                className={cn(
                    "fixed bottom-4 right-4 w-[400px] transition-all duration-300 z-50",
                    isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-[20px] opacity-0 pointer-events-none"
                )}
            >
                <Card className="h-[600px] flex flex-col shadow-2xl border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b bg-surface-container-low">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-on-surface">
                            <MessageSquare className="h-4 w-4" />
                            AstraCore Copilot
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <div className="h-full overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant p-4">
                                    <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="text-sm">
                                        Hi! I'm your AI assistant. Ask me anything about your invoices,
                                        customers, or billing data.
                                    </p>
                                </div>
                            )}
                            {messages.map((m: any) => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                        m.role === "user"
                                            ? "ml-auto bg-primary text-on-primary"
                                            : "bg-surface-container-high text-on-surface"
                                    )}
                                >
                                    {m.content}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t border-outline-variant bg-background">
                        <form
                            onSubmit={handleSubmit}
                            className="flex w-full items-center space-x-2"
                        >
                            <Input
                                value={input || ''}
                                onChange={handleInputChange || ((e) => {})}
                                placeholder="Type a message..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={!input?.trim() || isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
