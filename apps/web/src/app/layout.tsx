import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Approval Inbox — Client approvals without chaos",
  description:
    "A lightweight client approval system for freelancers and agencies. Centralize approvals, revisions, and feedback in one place.",
  openGraph: {
    title: "Approval Inbox",
    description: "Client approvals without chaos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-xl font-bold">
              Approval Inbox
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link
                href="https://app.approvalinbox.app/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="https://app.approvalinbox.app/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Get started
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t py-8">
          <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Approval Inbox. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}