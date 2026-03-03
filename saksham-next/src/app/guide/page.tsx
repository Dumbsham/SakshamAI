"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useLanguage } from "@/contexts/LanguageContext";
import MicButton from "@/components/MicButton";
import CareerCard from "@/components/CareerCard";
import CourseCard from "@/components/CourseCard";
import JobCard from "@/components/JobCard";
import SchemeCard from "@/components/SchemeCard";
import AgentChat from "@/components/AgentChat";
import {
  getUserProfile,
  transcribeAudio,
  suggestCareers,
} from "@/lib/api";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type {
  MicState,
  Career,
  Course,
  JobPlatform,
  GovtScheme,
  UiAction,
  UserProfile,
} from "@/types";

type Step = 1 | 2 | 3;

export default function GuidePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { language, t } = useLanguage();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Step 1 - Voice
  const [micState, setMicState] = useState<MicState>("idle");
  const [userTranscript, setUserTranscript] = useState("");

  // Step 2 - Careers
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>("");

  // Step 3 - Resources
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<JobPlatform[]>([]);
  const [schemes, setSchemes] = useState<GovtScheme[]>([]);

  // Section refs for scrolling
  const coursesRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);
  const schemesRef = useRef<HTMLDivElement>(null);

  // Highlight state
  const [highlighted, setHighlighted] = useState<string | null>(null);

  // Check profile completeness
  useEffect(() => {
    async function checkProfile() {
      if (!user?.id) return;
      try {
        const token = await getToken();
        const { profile: p } = await getUserProfile(token);
        if (!p?.profileComplete) {
          router.push("/onboarding");
          return;
        }
        setProfile(p);
      } catch {
        router.push("/onboarding");
      } finally {
        setLoading(false);
      }
    }
    checkProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Step 1 - Record background
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        setMicState("thinking");
        try {
          const token = await getToken();
          const { transcript } = await transcribeAudio(
            audioBlob,
            language,
            token
          );
          if (transcript) {
            setUserTranscript(transcript);
            // Get career suggestions
            const { careers: c } = await suggestCareers(
              transcript,
              language,
              token
            );
            setCareers(c || []);
            setStep(2);
          }
        } catch (err) {
          console.error("Transcribe error:", err);
        } finally {
          setMicState("idle");
        }
      };

      mediaRecorder.start();
      setMicState("recording");

      (window as unknown as Record<string, MediaRecorder>).__sakshamRecorder =
        mediaRecorder;
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    const recorder = (
      window as unknown as Record<string, MediaRecorder>
    ).__sakshamRecorder;
    if (recorder?.state === "recording") {
      recorder.stop();
    }
  };

  // Step 2 - Choose career
  const handleCareerSelect = (career: Career) => {
    setSelectedCareer(career.title);
    setStep(3);
  };

  // Handle UI actions from agent
  const handleUiAction = useCallback((action: UiAction) => {
    const scrollTarget: Record<string, React.RefObject<HTMLDivElement | null>> = {
      scroll_to_courses: coursesRef,
      scroll_to_jobs: jobsRef,
      scroll_to_schemes: schemesRef,
    };

    if (action.action in scrollTarget) {
      const ref = scrollTarget[action.action];
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const section = action.action.replace("scroll_to_", "");
      setHighlighted(section);
      setTimeout(() => setHighlighted(null), 3000);
    }

    if (action.action === "open_url" && action.url) {
      window.open(action.url, "_blank");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Step Indicator */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step >= s
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-800"
              }`}
            >
              {step > s ? <Check size={16} /> : s}
            </div>
            {s < 3 && (
              <div
                className={`h-0.5 w-16 ${
                  step > s
                    ? "bg-orange-500"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1: Record Background ── */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-12"
        >
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {t("guide_step1_title")}
          </h2>
          <p className="mb-10 text-gray-500">{t("guide_step1_desc")}</p>

          <MicButton
            state={micState}
            onPress={startRecording}
            onRelease={stopRecording}
          />

          {userTranscript && (
            <div className="mt-6 max-w-md rounded-xl bg-gray-100 px-5 py-3 text-center text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {userTranscript}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Step 2: Choose Career ── */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t("guide_step2_title")}
          </h2>
          <p className="mb-8 text-center text-gray-500">
            {t("guide_step2_desc")}
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <CareerCard
                key={career.title}
                career={career}
                selected={selectedCareer === career.title}
                onClick={() => handleCareerSelect(career)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Step 3: Agent Chat + Resources ── */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {t("guide_step3_title")}
          </h2>
          <p className="mb-8 text-center text-gray-500">
            {t("guide_step3_desc")}
          </p>

          {/* Agent Chat */}
          <div className="mb-10">
            <AgentChat
              selectedCareer={selectedCareer}
              transcript={userTranscript}
              educationLevel={profile?.education || ""}
              courses={courses}
              jobs={jobs}
              schemes={schemes}
              onCoursesUpdate={setCourses}
              onJobsUpdate={setJobs}
              onSchemesUpdate={setSchemes}
              onUiAction={handleUiAction}
            />
          </div>

          {/* Courses Section */}
          <div
            ref={coursesRef}
            className={`mb-8 rounded-2xl border p-6 transition-all duration-500 ${
              highlighted === "courses"
                ? "border-orange-500 bg-orange-50 shadow-lg dark:bg-orange-950/20"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              📚 {t("courses_title")}
            </h3>
            {courses.length === 0 ? (
              <p className="text-sm text-gray-400">
                Ask the agent for courses!
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {courses.map((course, i) => (
                  <CourseCard key={i} course={course} />
                ))}
              </div>
            )}
          </div>

          {/* Jobs Section */}
          <div
            ref={jobsRef}
            className={`mb-8 rounded-2xl border p-6 transition-all duration-500 ${
              highlighted === "jobs"
                ? "border-orange-500 bg-orange-50 shadow-lg dark:bg-orange-950/20"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              💼 {t("jobs_title")}
            </h3>
            {jobs.length === 0 ? (
              <p className="text-sm text-gray-400">
                Ask the agent for job platforms!
              </p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {jobs.map((job, i) => (
                  <JobCard key={i} job={job} />
                ))}
              </div>
            )}
          </div>

          {/* Schemes Section */}
          <div
            ref={schemesRef}
            className={`mb-8 rounded-2xl border p-6 transition-all duration-500 ${
              highlighted === "schemes"
                ? "border-orange-500 bg-orange-50 shadow-lg dark:bg-orange-950/20"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              🏛️ {t("schemes_title")}
            </h3>
            {schemes.length === 0 ? (
              <p className="text-sm text-gray-400">
                Ask the agent for government schemes!
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {schemes.map((scheme, i) => (
                  <SchemeCard key={i} scheme={scheme} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}