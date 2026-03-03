"use client";

import { MapPin, Globe, Lightbulb, ExternalLink } from "lucide-react";
import type { JobPlatform } from "@/types";

interface JobCardProps {
  job: JobPlatform;
}

export default function JobCard({ job }: JobCardProps) {
  if (job.isTip) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/30">
        <Lightbulb size={20} className="mt-0.5 shrink-0 text-yellow-600" />
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          {job.tip}
        </p>
      </div>
    );
  }

  const typeIcons: Record<string, React.ReactNode> = {
    "full-time": <MapPin size={20} className="text-purple-600" />,
    freelance: <Globe size={20} className="text-green-600" />,
    local: <MapPin size={20} className="text-blue-600" />,
  };

  return (
    <a
      href={job.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-orange-700"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        {typeIcons[job.type] || <MapPin size={20} className="text-gray-600" />}
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
          {job.name}
        </h4>
        <p className="text-xs text-gray-500">{job.tip}</p>
      </div>
      <ExternalLink
        size={16}
        className="shrink-0 text-gray-400 group-hover:text-orange-500"
      />
    </a>
  );
}