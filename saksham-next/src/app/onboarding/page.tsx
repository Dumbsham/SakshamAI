"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useLanguage } from "@/contexts/LanguageContext";
import MicButton from "@/components/MicButton";
import { getOrCreateProfile, onboardingChat, transcribeAudio } from "@/lib/api";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { MicState, UserProfile } from "@/types";

const FIELDS = ["name", "age", "education", "digitalLiteracy", "englishLevel"];

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { language, t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [micState, setMicState] = useState<MicState>("idle");
  const [agentMessage, setAgentMessage] = useState("");
  const [agentAudio, setAgentAudio] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate progress
  const calcProgress = (p: UserProfile) => {
    let count = 0;
    if (p.name) count++;
    if (p.age) count++;
    if (p.education) count++;
    if (p.digitalLiteracy !== undefined && p.digitalLiteracy !== null) count++;
    if (p.englishLevel) count++;
    return count;
  };

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      try {
        const token = await getToken();
        const { profile: p } = await getOrCreateProfile(user.id, token);
        setProfile(p);
        setProgress(calcProgress(p));

        if (p.profileComplete) {
          router.push("/guide");
          return;
        }

        // Get first question from agent
        const res = await onboardingChat(user.id, "", language, token);
        setAgentMessage(res.message);
        if (res.audio) setAgentAudio(res.audio);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Play agent audio
  useEffect(() => {
    if (!agentAudio) return;
    const audio = new Audio(`data:audio/mp3;base64,${agentAudio}`);
    audio.onended = () => setMicState("idle");
    setMicState("speaking");
    audio.play();
    setAgentAudio(null);
  }, [agentAudio]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!user?.id || !message) return;
      setMicState("thinking");

      try {
        const token = await getToken();
        const res = await onboardingChat(user.id, message, language, token);
        setAgentMessage(res.message);
        if (res.profile) {
          setProfile(res.profile);
          setProgress(calcProgress(res.profile));
        }
        if (res.audio) setAgentAudio(res.audio);
        if (res.complete) {
          setTimeout(() => router.push("/guide"), 2000);
        } else {
          setMicState("idle");
        }
      } catch {
        setMicState("idle");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.id, language]
  );

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
            sendMessage(transcript);
          } else {
            setMicState("idle");
          }
        } catch {
          setMicState("idle");
        }
      };

      mediaRecorder.start();
      setMicState("recording");

      // Store ref for stopping
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

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {t("onboarding_title")}
        </h1>
        <p className="mb-8 text-gray-500">{t("onboarding_subtitle")}</p>
      </motion.div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-gray-500">
          <span>
            {progress}/{FIELDS.length}
          </span>
          <span>{Math.round((progress / FIELDS.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full rounded-full bg-orange-500"
            animate={{ width: `${(progress / FIELDS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {/* Field indicators */}
        <div className="mt-3 flex justify-between">
          {FIELDS.map((field, i) => (
            <div key={field} className="flex flex-col items-center gap-1">
              <CheckCircle2
                size={16}
                className={
                  i < progress
                    ? "text-orange-500"
                    : "text-gray-300 dark:text-gray-700"
                }
              />
              <span className="text-[10px] text-gray-400">{field}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Message */}
      {agentMessage && (
        <motion.div
          key={agentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-gray-100 px-5 py-4 text-center text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        >
          {agentMessage}
        </motion.div>
      )}

      {/* Mic Button */}
      <div className="flex justify-center">
        <MicButton
          state={micState}
          onPress={startRecording}
          onRelease={stopRecording}
        />
      </div>
    </div>
  );
}