"use client";

import { BookOpen, ExternalLink } from "lucide-react";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-orange-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-orange-700"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
        <BookOpen size={20} className="text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {course.title}
        </h4>
        <p className="text-xs text-gray-500">
          {course.platform} • {course.level}
        </p>
      </div>
      <ExternalLink
        size={16}
        className="shrink-0 text-gray-400 group-hover:text-orange-500"
      />
    </a>
  );
}