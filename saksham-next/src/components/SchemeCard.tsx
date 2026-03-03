"use client";

import { Landmark, ExternalLink } from "lucide-react";
import type { GovtScheme } from "@/types";

interface SchemeCardProps {
  scheme: GovtScheme;
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
          <Landmark size={20} className="text-emerald-600" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {scheme.name}
        </h4>
      </div>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        {scheme.description}
      </p>
      <div className="mb-2">
        <span className="text-xs font-medium uppercase text-gray-500">
          Benefits:
        </span>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {scheme.benefits}
        </p>
      </div>
      <div className="mb-3">
        <span className="text-xs font-medium uppercase text-gray-500">
          Eligibility:
        </span>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {scheme.eligibility}
        </p>
      </div>
      {scheme.link && (
        <a
          href={scheme.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-orange-500 hover:underline"
        >
          Learn more <ExternalLink size={14} />
        </a>
      )}
    </div>
  );
}