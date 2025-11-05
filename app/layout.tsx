import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CipherSeed",
    description: "🔐 CipherSeed — A deterministic, privacy-focused password generator that creates strong, consistent passwords locally using secure hashing and customizable rules.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-100 dark:bg-gray-950 md:p-2 md:flex md:items-center md:justify-center min-h-screen">
                {children}
            </body>
        </html>
    );
}