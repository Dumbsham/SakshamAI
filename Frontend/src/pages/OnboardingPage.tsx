import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useLanguage, toBackendLanguage } from '../contexts/LanguageContext';

const API_BASE = 'http://localhost:5000/api';

type VoiceState = 'idle' | 'recording' | 'thinking' | 'speaking';

export function OnboardingPage() {
  const { getToken } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const backendLang = toBackendLanguage(language);

  const [voiceState, setVoiceState] = useState<VoiceState>('thinking');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [profileComplete, setProfileComplete] = useState(false);
  const [statusText, setStatusText] = useState('Agent bol raha hai...');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoListen, setAutoListen] = useState(true);
  const autoListenRef = useRef(true);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    autoListenRef.current = autoListen;
  }, [autoListen]);

  // Start conversation on load
  useEffect(() => {
    startConversation();
  }, []);

  // Redirect after profile complete
  useEffect(() => {
    if (profileComplete) {
      setTimeout(() => navigate('/guide'), 2500);
    }
  }, [profileComplete]);

  const playAudio = (base64Audio: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!base64Audio) { resolve(); return; }
      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  };

  const startConversation = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/conversation/start?language=${backendLang}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      setMessages([{ role: 'ai', text: data.aiText }]);

      if (data.alreadyDone || data.profileComplete) {
        setProfileComplete(true);
        setVoiceState('speaking');
        setStatusText('Profile already saved! Redirect ho raha hai...');
        await playAudio(data.aiAudio);
        return;
      }

      setVoiceState('speaking');
      setStatusText('Agent bol raha hai...');
      await playAudio(data.aiAudio);

      // Auto-listen after greeting
      if (autoListenRef.current) {
        setStatusText('Sun rahi hoon... (band karne ke liye mic dabao)');
        await new Promise(r => setTimeout(r, 500));
        startRecording();
      } else {
        setVoiceState('idle');
        setStatusText('Mic dabao aur jawab do...');
      }
    } catch (e) {
      console.error('Start conversation error:', e);
      setVoiceState('idle');
      setStatusText('Kuch gadbad hui, refresh karo');
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
        await processTurn(blob);
      };

      mediaRecorder.start();
      setVoiceState('recording');
      setStatusText('Bol rahi hain... (dobara dabao rokne ke liye)');
    } catch (e) {
      console.error('Mic error:', e);
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
    if (voiceState === 'idle') startRecording();
    else if (voiceState === 'recording') stopRecording();
    else if (voiceState === 'speaking') {
      audioRef.current?.pause();
      audioRef.current = null;
      setVoiceState('idle');
      setStatusText('Mic dabao aur jawab do...');
    }
  };

  const processTurn = async (audioBlob: Blob) => {
    try {
      const token = await getToken();

      // Transcribe
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', backendLang);
      formData.append('history', JSON.stringify(history));

      const res = await fetch(`${API_BASE}/conversation/turn`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      // Update messages
      setMessages(prev => [
        ...prev,
        { role: 'user', text: data.userTranscript },
        { role: 'ai', text: data.aiText },
      ]);

      // Update history
      setHistory(prev => [
        ...prev,
        { role: 'user', text: data.userTranscript },
        { role: 'ai', text: data.aiText },
      ]);

      if (data.profileComplete) {
        setProfileComplete(true);
        // Stop any ongoing recording
        if (mediaRecorderRef.current && voiceState === 'recording') {
          mediaRecorderRef.current.stop();
        }
        audioRef.current?.pause();
        setVoiceState('speaking');
        setStatusText('Profile save ho gayi! Career guide pe ja rahi hain...');
        await playAudio(data.aiAudio);
        setVoiceState('idle');
        return;
      }

      setVoiceState('speaking');
      setStatusText('Agent bol raha hai...');
      await playAudio(data.aiAudio);

      // Auto-listen — only if profile not complete
      if (autoListenRef.current) {
        setStatusText('Sun rahi hoon... (band karne ke liye mic dabao)');
        await new Promise(r => setTimeout(r, 500));
        startRecording();
      } else {
        setVoiceState('idle');
        setStatusText('Mic dabao aur jawab do...');
      }

    } catch (e) {
      console.error('Turn error:', e);
      setVoiceState('idle');
      setStatusText('Kuch gadbad hui, dobara try karo');
    }
  };

  const getMicStyle = () => {
    switch (voiceState) {
      case 'recording': return 'bg-red-500 scale-110 shadow-red-500/50';
      case 'thinking':  return 'bg-yellow-500 opacity-60 cursor-not-allowed';
      case 'speaking':  return 'bg-green-500 shadow-green-500/50';
      default:          return 'bg-gradient-to-r from-orange-500 to-pink-600 hover:scale-105';
    }
  };

  const getMicIcon = () => {
    if (voiceState === 'recording') return <MicOff className="w-8 h-8 text-white" />;
    if (voiceState === 'speaking')  return <Volume2 className="w-8 h-8 text-white animate-pulse" />;
    return <Mic className="w-8 h-8 text-white" />;
  };

  // Progress — count non-null fields from history
  const progress = Math.min(Math.floor((history.filter(h => h.role === 'user').length / 5) * 100), 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 pt-20 pb-10 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-xl mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">
            Saksham AI Career Guide
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-outfit">
            Pehle thoda aapke baare mein jaante hain
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1 font-outfit">
            <span>Profile setup</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-pink-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/5 dark:border-white/10 shadow-xl mb-6 max-h-72 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex gap-1 items-center justify-center py-4">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-br-sm'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {voiceState === 'thinking' && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div className="bg-gray-100 dark:bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mic button */}
        {!profileComplete ? (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleMicClick}
              disabled={voiceState === 'thinking'}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 ${getMicStyle()}`}
            >
              {getMicIcon()}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-outfit text-center">
              {statusText}
            </p>

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
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3 shadow-xl">
              <span className="text-white text-2xl">✓</span>
            </div>
            <p className="text-green-600 dark:text-green-400 font-medium font-outfit">
              Profile save ho gayi! Career guide pe ja rahi hain...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}