"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useLanguage } from "@/contexts/LanguageContext";
import MicButton from "./MicButton";
import { agentChat, transcribeAudio } from "@/lib/api";
import { Send, ToggleLeft, ToggleRight } from "lucide-react";
import type {
  MicState,
  ChatMessage,
  Course,
  JobPlatform,
  GovtScheme,
  UiAction,
} from "@/types";

interface AgentChatProps {
  selectedCareer: string;
  transcript: string;
  educationLevel: string;
  courses: Course[];
  jobs: JobPlatform[];
  schemes: GovtScheme[];
  onCoursesUpdate: (courses: Course[]) => void;
  onJobsUpdate: (jobs: JobPlatform[]) => void;
  onSchemesUpdate: (schemes: GovtScheme[]) => void;
  onUiAction: (action: UiAction) => void;
}

export default function AgentChat({
  selectedCareer,
  transcript,
  educationLevel,
  courses,
  jobs,
  schemes,
  onCoursesUpdate,
  onJobsUpdate,
  onSchemesUpdate,
  onUiAction,
}: AgentChatProps) {
  const { getToken } = useAuth();
  const { language, t } = useLanguage();
  const [micState, setMicState] = useState<MicState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState("");
  const [autoListen, setAutoListen] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processAgentResponse = useCallback(
    async (userMessage: string) => {
      setMicState("thinking");

      const userMsg: ChatMessage = {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const token = await getToken();
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const data = await agentChat(
          {
            message: userMessage,
            history,
            context: {
              language,
              selectedCareer,
              transcript,
              educationLevel,
            },
            courses,
            jobs,
            schemes,
          },
          token
        );

        // Update state from agent response
        if (data.courses?.length) onCoursesUpdate(data.courses);
        if (data.jobs?.length) onJobsUpdate(data.jobs);
        if (data.schemes?.length) onSchemesUpdate(data.schemes);

        // Handle UI actions
        if (data.allUiActions) {
          data.allUiActions.forEach((action: UiAction) => onUiAction(action));
        }

        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // Play audio if available
        if (data.audio) {
          setMicState("speaking");
          const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
          audioRef.current = audio;
          audio.onended = () => {
            setMicState("idle");
            if (autoListen) {
              startRecording();
            }
          };
          audio.play();
        } else {
          setMicState("idle");
        }
      } catch (err) {
        console.error("Agent error:", err);
        setMicState("idle");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      messages,
      language,
      selectedCareer,
      transcript,
      educationLevel,
      courses,
      jobs,
      schemes,
      autoListen,
    ]
  );

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

        setMicState("thinking");
        try {
          const token = await getToken();
          const { transcript: text } = await transcribeAudio(
            audioBlob,
            language,
            token
          );
          if (text) {
            processAgentResponse(text);
          } else {
            setMicState("idle");
          }
        } catch {
          setMicState("idle");
        }
      };

      mediaRecorder.start();
      setMicState("recording");
    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTextSend = () => {
    if (!textInput.trim()) return;
    processAgentResponse(textInput.trim());
    setTextInput("");
  };

  return (
    <div className="flex h-[500px] flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            {t("mic_idle")}
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        {/* Auto Listen Toggle */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <button
            onClick={() => setAutoListen(!autoListen)}
            className="flex items-center gap-1.5 text-xs text-gray-500"
          >
            {autoListen ? (
              <ToggleRight size={18} className="text-orange-500" />
            ) : (
              <ToggleLeft size={18} />
            )}
            {t("autoListen")}
          </button>
        </div>

        {/* Mic + Text Input */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-3 dark:border-gray-600 dark:bg-gray-800">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent py-2.5 text-sm outline-none dark:text-white"
                disabled={micState !== "idle"}
              />
              <button
                onClick={handleTextSend}
                disabled={!textInput.trim() || micState !== "idle"}
                className="text-orange-500 disabled:text-gray-300"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          <MicButton
            state={micState}
            onPress={startRecording}
            onRelease={stopRecording}
            disabled={micState === "thinking" || micState === "speaking"}
          />
        </div>
      </div>
    </div>
  );
}