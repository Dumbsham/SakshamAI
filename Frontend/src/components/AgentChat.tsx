import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, RefreshCw } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useLanguage, toBackendLanguage } from '../contexts/LanguageContext';
import type { ChatMessage } from '../types';

const API_BASE = 'http://localhost:5000/api';

interface AgentChatProps {
  selectedCareer: string;
  transcript?: string;
  courses?: any[];
  jobs?: any[];
  schemes?: any[];
  onAction?: (action: string, payload?: any) => void;
  onCoursesUpdate?: (courses: any[]) => void;
  onJobsUpdate?: (jobs: any[]) => void;
  onSchemesUpdate?: (schemes: any[]) => void;
  onMoreCareers?: () => void; // callback to go back to career selection
}

type VoiceState = 'idle' | 'recording' | 'thinking' | 'speaking';

export function AgentChat({ selectedCareer, transcript, courses = [], jobs = [], schemes = [], onAction, onCoursesUpdate, onJobsUpdate, onSchemesUpdate, onMoreCareers }: AgentChatProps) {
  const { language } = useLanguage();
  const backendLang = toBackendLanguage(language);
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [history, setHistory] = useState<any[]>([]);
  const [statusText, setStatusText] = useState('Mic dabao aur bolo...');
  const [autoListen, setAutoListen] = useState(true);
  const [interrupted, setInterrupted] = useState(false);
  const [browserSteps, setBrowserSteps] = useState<{step: number, description: string, result: string}[]>([]);
  const [browserScreenshot, setBrowserScreenshot] = useState<string | null>(null);
  const [browserRunning, setBrowserRunning] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoListenRef = useRef(true);
  const interruptedRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    autoListenRef.current = autoListen;
  }, [autoListen]);

  const playAudio = (base64Audio: string): Promise<void> => {
    return new Promise((resolve) => {
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audioRef.current = audio;
      interruptedRef.current = false;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  };

  const interruptAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      interruptedRef.current = true;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processVoice(blob);
      };

      mediaRecorder.start();
      setVoiceState('recording');
      setStatusText('Bol raha/rahi ho... (dobara dabao rokne ke liye)');
    } catch (err) {
      console.error('Mic error:', err);
      setStatusText('Mic permission do pehle!');
      setVoiceState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && voiceState === 'recording') {
      mediaRecorderRef.current.stop();
      setVoiceState('thinking');
      setStatusText('Samajh raha hoon...');
    }
  };

  const handleMicClick = () => {
    if (voiceState === 'idle') {
      startRecording();
    } else if (voiceState === 'recording') {
      stopRecording();
    } else if (voiceState === 'speaking') {
      // Interrupt — agent ki audio band karo, turant recording shuru karo
      interruptAudio();
      setInterrupted(true);
      setVoiceState('recording');
      setStatusText('Bol raha/rahi ho... (dobara dabao rokne ke liye)');
      startRecording();
      setTimeout(() => setInterrupted(false), 2000);
    }
  };

  const processVoice = async (audioBlob: Blob) => {
    try {
      const token = await getToken();

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', backendLang);
      const sttRes = await fetch(`${API_BASE}/speech/transcribe-only`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!sttRes.ok) throw new Error('Transcription failed');
      const { transcript: userText } = await sttRes.json();

      if (!userText?.trim()) {
        setStatusText('Kuch suna nahi, dobara bolo...');
        setVoiceState('idle');
        return;
      }

      setMessages(prev => [...prev, { role: 'user', content: userText }]);
      setStatusText('Agent soch raha hai... 🤔');
      setVoiceState('thinking');

      const agentRes = await fetch(`${API_BASE}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          message: userText,
          history,
          context: { selectedCareer, transcript, language: backendLang },
          courses, jobs, schemes,
        }),
      });

      if (!agentRes.ok) throw new Error('Agent failed');
      const data = await agentRes.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      setHistory(data.history);

      if (data.courses?.length > 0 && onCoursesUpdate) onCoursesUpdate(data.courses);
      if (data.jobs?.length > 0 && onJobsUpdate) onJobsUpdate(data.jobs);
      if (data.schemes?.length > 0 && onSchemesUpdate) onSchemesUpdate(data.schemes);

      // Browser automation result
      if (data.browserResult) {
        setBrowserSteps(data.browserResult.steps || []);
        if (data.browserResult.screenshot) setBrowserScreenshot(data.browserResult.screenshot);
        setBrowserRunning(false);
      }
      if (data.browserRunning) setBrowserRunning(true);

      if (data.allUiActions?.length > 0 && onAction) {
        data.allUiActions.forEach((a: any) => onAction(a.action, a.url ? { url: a.url } : undefined));
      } else if (data.action && onAction) {
        onAction(data.action, data.actionPayload);
      }

      // Check if agent said "more careers" / "aur careers"
      const msgLower = data.message?.toLowerCase() || '';
      if (
        onMoreCareers && (
          msgLower.includes('aur career') ||
          msgLower.includes('more career') ||
          msgLower.includes('doosra career') ||
          msgLower.includes('career badlo') ||
          msgLower.includes('naya career')
        )
      ) {
        setTimeout(() => onMoreCareers(), 2000);
      }

      if (data.audio) {
        setVoiceState('speaking');
        setStatusText('Agent bol raha hai... (interrupt karne ke liye mic dabao) 🛑');
        await playAudio(data.audio);
      }

      // Auto-listen — only if not interrupted
      if (autoListenRef.current && !interruptedRef.current) {
        setStatusText('Sun rahi hoon... (band karne ke liye mic dabao)');
        await new Promise(r => setTimeout(r, 400));
        startRecording();
      } else if (!interruptedRef.current) {
        setVoiceState('idle');
        setStatusText('Mic dabao aur bolo...');
      }

    } catch (err) {
      console.error('Voice processing error:', err);
      setVoiceState('idle');
      setStatusText('Kuch gadbad hui, dobara try karo');
    }
  };

  const getMicButtonStyle = () => {
    switch (voiceState) {
      case 'recording': return 'bg-red-500 hover:bg-red-600 scale-110';
      case 'thinking':  return 'bg-yellow-500 cursor-not-allowed opacity-70';
      case 'speaking':  return 'bg-orange-500 hover:bg-red-500 animate-pulse';
      default:          return 'bg-gradient-to-r from-orange-500 to-pink-600 hover:shadow-lg hover:scale-105';
    }
  };

  const getMicIcon = () => {
    if (voiceState === 'recording') return <MicOff className="w-7 h-7 text-white" />;
    if (voiceState === 'speaking')  return <Volume2 className="w-7 h-7 text-white" />;
    return <Mic className="w-7 h-7 text-white" />;
  };

  const getDotColor = () => {
    switch (voiceState) {
      case 'recording': return 'bg-red-500';
      case 'thinking':  return 'bg-yellow-500';
      case 'speaking':  return 'bg-green-500';
      default:          return 'bg-gray-400';
    }
  };

  return (
    <div className="mt-8 bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-xl">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-6 py-4 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${getDotColor()}`}></div>
          <h3 className="font-bold text-gray-900 dark:text-white font-outfit">AI Career Guide 🎯</h3>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 font-outfit">{selectedCareer}</span>
          {/* More Careers Button */}
          {onMoreCareers && (
            <button
              onClick={onMoreCareers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-medium font-outfit transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              Aur Careers
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm font-outfit">
            Mic dabao aur <span className="font-semibold text-orange-500">{selectedCareer}</span> ke baare mein kuch pucho! 🎤
          </p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-br-sm'
                : 'bg-gray-800/80 dark:bg-white/10 text-gray-100 dark:text-gray-200 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {voiceState === 'thinking' && (
          <div className="flex justify-start">
            <div className="bg-gray-800/80 dark:bg-white/10 px-6 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Browser automation live steps */}
        {browserRunning && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 font-outfit">🌐 Browser Agent Working...</p>
            {browserSteps.map((s, i) => (
              <p key={i} className="text-xs text-gray-600 dark:text-gray-400 font-outfit">
                {i + 1}. {s.description}
              </p>
            ))}
            <div className="flex gap-1 mt-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Browser result — steps + screenshot */}
        {!browserRunning && browserSteps.length > 0 && (
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-outfit">🌐 Browser completed {browserSteps.length} steps</p>
            <div className="space-y-1">
              {browserSteps.map((s, i) => (
                <p key={i} className="text-xs text-gray-600 dark:text-gray-400 font-outfit">
                  ✓ {s.description}
                </p>
              ))}
            </div>
            {browserScreenshot && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-outfit">Final screenshot:</p>
                <img
                  src={`data:image/png;base64,${browserScreenshot}`}
                  alt="Browser screenshot"
                  className="w-full rounded-lg border border-black/10 dark:border-white/10"
                />
              </div>
            )}
          </div>
        )}
        {interrupted && (
          <div className="flex justify-center">
            <span className="text-xs text-orange-500 font-outfit animate-pulse">⚡ Interrupted</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-black/5 dark:border-white/10 flex flex-col items-center gap-3">
        <button
          onClick={handleMicClick}
          disabled={voiceState === 'thinking'}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${getMicButtonStyle()}`}
        >
          {getMicIcon()}
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit text-center">{statusText}</p>

        {/* Auto-listen toggle */}
        <button
          onClick={() => setAutoListen(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-outfit transition-all border ${
            autoListen
              ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
              : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${autoListen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
          {autoListen ? 'Auto-listen ON' : 'Auto-listen OFF'}
        </button>
      </div>
    </div>
  );
}