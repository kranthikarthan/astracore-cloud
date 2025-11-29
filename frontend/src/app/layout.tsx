import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { ThemeProvider } from "@/components/ThemeProvider";

// Inter is used as a substitute for Google Sans (Google Sans is not available via Google Fonts)
// For production, you may want to load Google Sans directly from Google's CDN
const googleSans = Inter({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Roboto Flex is not available via next/font/google, using Roboto as substitute
// For production, you may want to load Roboto Flex directly from Google's CDN
const robotoFlex = Roboto({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AstraCore Cloud",
  description: "AI-Native, Event-Driven ERP Platform for the Modern Enterprise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Load Google Sans and Roboto Flex from Google Fonts CDN for exact Material You fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Roboto+Flex:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${googleSans.variable} ${robotoFlex.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-background p-6">
                {children}
              </main>
            </div>
          </div>
          <ChatInterface />
        </ThemeProvider>
      </body>
    </html>
  );
}
