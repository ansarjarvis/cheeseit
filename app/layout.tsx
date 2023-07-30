import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "cheeseit",
  description: "A Reddit Clone built with Next js and TypeScript",
};

export default function RootLayout({
  authModal,
  children,
}: {
  authModal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Navbar />

        {authModal}

        <div className="container max-w-7xl h-full pt-12">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
