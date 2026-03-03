"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Sun, Moon, Mic } from "lucide-react";
import type { Language } from "@/types";

const languages: { code: Language; label: string }[] = [
  { code: "hindi", label: "हिंदी" },
  { code: "tamil", label: "தமிழ்" },
  { code: "telugu", label: "తెలుగు" },
  { code: "marathi", label: "मराठी" },
];

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Mic size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {t("appName")}
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Auth */}
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
            >
              {t("signIn")}
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <Link
                href="/guide"
                className="text-sm text-gray-600 hover:text-orange-500 dark:text-gray-400"
              >
                Guide
              </Link>
              <Link
                href="/profile"
                className="text-sm text-gray-600 hover:text-orange-500 dark:text-gray-400"
              >
                Profile
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}