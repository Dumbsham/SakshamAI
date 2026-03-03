"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useLanguage } from "@/contexts/LanguageContext";
import { getUserProfile } from "@/lib/api";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Smartphone,
  Globe,
  AlertCircle,
  Pencil,
} from "lucide-react";
import type { UserProfile } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const token = await getToken();
        const { profile: p } = await getUserProfile(token);
        setProfile(p);
      } catch (err) {
        console.error("Profile error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4">
        <AlertCircle size={48} className="text-gray-400" />
        <p className="text-gray-500">No profile found</p>
        <button
          onClick={() => router.push("/onboarding")}
          className="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
        >
          Start Onboarding
        </button>
      </div>
    );
  }

  const fields = [
    {
      icon: User,
      label: "Name",
      value: profile.name,
    },
    {
      icon: User,
      label: "Age",
      value: profile.age,
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: profile.education,
    },
    {
      icon: Smartphone,
      label: "Smartphone",
      value:
        profile.digitalLiteracy !== undefined
          ? profile.digitalLiteracy
            ? "Yes ✅"
            : "No ❌"
          : null,
    },
    {
      icon: Globe,
      label: "English Level",
      value: profile.englishLevel,
    },
    {
      icon: Globe,
      label: "Language",
      value: profile.preferredLanguage,
    },
  ];

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("profile_title")}
          </h1>
          <button
            onClick={() => router.push("/onboarding")}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>

        {/* Incomplete Warning */}
        {!profile.profileComplete && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-800 dark:bg-yellow-950/30">
            <AlertCircle size={20} className="text-yellow-600" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {t("profile_incomplete")}
            </p>
          </div>
        )}

        {/* Profile Fields */}
        <div className="space-y-3">
          {fields.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <Icon
                size={20}
                className="shrink-0 text-gray-400 dark:text-gray-500"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {value || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clerk Info */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs text-gray-500">Email</p>
          <p className="text-sm text-gray-900 dark:text-white">
            {user?.primaryEmailAddress?.emailAddress || "—"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}