"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Mic, Brain, BookOpen, Landmark, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    key: "landing_feature1",
    icon: Mic,
    color: "bg-red-100 text-red-600 dark:bg-red-900/50",
  },
  {
    key: "landing_feature2",
    icon: Brain,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/50",
  },
  {
    key: "landing_feature3",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50",
  },
  {
    key: "landing_feature4",
    icon: Landmark,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50",
  },
] as const;

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20 md:pt-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950" />
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-gray-900 dark:text-white md:text-6xl">
              {t("appName")}{" "}
              <span className="text-orange-500">🎯</span>
            </h1>
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              {t("tagline")}
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-base text-gray-500 dark:text-gray-500">
              {t("landing_hero")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4"
          >
            <SignedOut>
              <Link
                href="/sign-up"
                className="group flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-xl"
              >
                {t("getStarted")}
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/guide"
                className="group flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-xl"
              >
                {t("getStarted")}
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </SignedIn>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            const titleKey =
              `${feature.key}_title` as `landing_feature${1 | 2 | 3 | 4}_title`;
            const descKey =
              `${feature.key}_desc` as `landing_feature${1 | 2 | 3 | 4}_desc`;

            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {t(titleKey)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(descKey)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-8 dark:border-gray-800">
        <p className="text-center text-sm text-gray-500">
          Built with ❤️ for Indian women &mdash; {t("appName")} AI
        </p>
      </footer>
    </div>
  );
}