import { Navbar } from "@/components/layouts/navigation/navbar";
import { ThemeProvider } from "@/components/layouts/theme-provider";
import ReactQueryProvider from "@/lib/react-query/provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "KP Funds",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                >
                    <ReactQueryProvider>
                        <div className="grid grid-rows-[auto_1fr] min-h-screen w-full max-w-7xl mx-auto">
                            <Navbar />
                            <main className="p-4">{children}</main>
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                                toastOptions={{
                                    style: {
                                        border: "1px solid var(--color-popover-foreground)",
                                        padding: "16px",
                                        backgroundColor: "var(--color-popover)",
                                        color: "var(--color-popover-foreground)",
                                    },
                                    success: {
                                        style: {
                                            border: "1px solid var(--color-success)",
                                            color: "var(--color-success)",
                                        },
                                    },
                                    error: {
                                        style: {
                                            border: "1px solid var(--color-destructive)",
                                            color: "var(--color-destructive)",
                                        },
                                    },
                                }}
                            />
                        </div>
                    </ReactQueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
