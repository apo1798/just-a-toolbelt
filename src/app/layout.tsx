import type { Metadata } from "next";
import "./globals.css";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { ThemeToggleDropdown } from "~/components/dropdown/ThemeToggleButton";
import { Wrench } from "lucide-react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    template: "%s | 工具小幫手",
    default: "首頁 | 工具小幫手",
  },
  description: "希望這是一個好用的工具聚集地^_^!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed w-full border-b border-primary backdrop-blur ">
            <header className="container flex w-full items-center justify-between py-2 text-xl font-medium backdrop-blur">
              <div className="inline-flex items-center gap-2">
                <Wrench className="text-yellow-400" />
                工具小幫手
              </div>
              <nav>
                <ThemeToggleDropdown />
              </nav>
            </header>
          </div>
          <div className="mb-6 h-[4rem]" />
          {children}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
