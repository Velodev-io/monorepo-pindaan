import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Gangajal.store Admin",
  description: "Secure Admin Panel for Gangajal.store Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 antialiased font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
