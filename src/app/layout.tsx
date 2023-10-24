import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "~/lib/utils";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { ThemeToggleDropdown } from "~/components/dropdown/ThemeToggleButton";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Grinning Cat",
    default: "首頁 | Grinning Cat",
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
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <header className="container fixed flex w-full items-center justify-between border-b border-primary py-2 text-xl font-medium backdrop-blur">
          Grinning Cat 😸
          <nav>
            <ThemeToggleDropdown />
          </nav>
        </header>
        <div className="h-[4rem]" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
