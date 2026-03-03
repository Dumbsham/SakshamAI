import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saksham — AI Voice Career Guide",
  description:
    "A voice-first AI career counselor for Indian women. Speak your background, get personalized career paths, courses, and jobs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950">
        <ClerkProvider>
          <ThemeProvider>
            <LanguageProvider>
              <Header />
              <main>{children}</main>
            </LanguageProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}