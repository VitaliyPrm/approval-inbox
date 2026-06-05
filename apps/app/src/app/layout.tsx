import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Approval Inbox",
  description: "Client approvals without chaos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}