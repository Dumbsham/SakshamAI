"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import type { Career } from "@/types";

interface CareerCardProps {
  career: Career;
  selected?: boolean;
  onClick: () => void;
}

export default function CareerCard({
  career,
  selected,
  onClick,
}: CareerCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full rounded-xl border p-5 text-left transition-all ${
        selected
          ? "border-orange-500 bg-orange-50 shadow-lg dark:bg-orange-950/30"
          : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-orange-700"
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
          <Briefcase size={20} className="text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {career.title}
        </h3>
      </div>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {career.description}
      </p>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {career.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {skill}
          </span>
        ))}
      </div>
      <p className="text-sm font-medium text-green-600 dark:text-green-400">
        {career.salary}
      </p>
    </motion.button>
  );
}