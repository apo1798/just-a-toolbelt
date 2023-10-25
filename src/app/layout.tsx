import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { ThemeToggleDropdown } from "~/components/dropdown/ThemeToggleButton";
import { Wrench } from "lucide-react";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="border-primary fixed w-full border-b backdrop-blur ">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
