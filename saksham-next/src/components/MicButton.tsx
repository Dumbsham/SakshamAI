"use client";

import { Mic, Loader2, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import type { MicState } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface MicButtonProps {
  state: MicState;
  onPress: () => void;
  onRelease: () => void;
  disabled?: boolean;
}

const stateColors: Record<MicState, string> = {
  idle: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  recording: "bg-red-500 text-white",
  thinking: "bg-orange-500 text-white",
  speaking: "bg-green-500 text-white",
};

export default function MicButton({
  state,
  onPress,
  onRelease,
  disabled = false,
}: MicButtonProps) {
  const { t } = useLanguage();

  const labels: Record<MicState, string> = {
    idle: t("mic_idle"),
    recording: t("mic_recording"),
    thinking: t("mic_thinking"),
    speaking: t("mic_speaking"),
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onMouseDown={state === "idle" ? onPress : undefined}
        onMouseUp={state === "recording" ? onRelease : undefined}
        onTouchStart={state === "idle" ? onPress : undefined}
        onTouchEnd={state === "recording" ? onRelease : undefined}
        disabled={disabled || state === "thinking"}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-colors ${stateColors[state]} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        animate={
          state === "recording"
            ? { scale: [1, 1.1, 1] }
            : state === "speaking"
              ? { scale: [1, 1.05, 1] }
              : {}
        }
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        {state === "thinking" ? (
          <Loader2 size={32} className="animate-spin" />
        ) : state === "speaking" ? (
          <Volume2 size={32} />
        ) : (
          <Mic size={32} />
        )}

        {/* Pulse ring for recording */}
        {state === "recording" && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </motion.button>

      <span className="text-sm text-gray-500 dark:text-gray-400">
        {labels[state]}
      </span>
    </div>
  );
}