import { useState, useRef } from 'react';
import { useLanguage, toBackendLanguage } from '../contexts/LanguageContext';
import { t } from '../i18n/translations';
import { useAuth } from '@clerk/clerk-react';
import { Mic, MicOff, ArrowRight, ArrowLeft, RotateCcw, ExternalLink, Youtube, Globe } from 'lucide-react';
import type { Career, Course, JobPlatform } from '../types';
import { AgentChat } from '../components/AgentChat';

const API_BASE = 'http://localhost:5000/api';

type RecordingState = 'idle' | 'recording' | 'ready';

interface GovtScheme {
  name: string;
  benefit: string;
  eligibility: string;
  url: string;
}

export function CareerGuidePage() {
  const { language } = useLanguage();
  const { getToken } = useAuth();
  const [step, setStep] = useState(0);
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobs, setJobs] = useState<JobPlatform[]>([]);
  const [schemes, setSchemes] = useState<GovtScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [highlightSection, setHighlightSection] = useState<'courses' | 'jobs' | 'schemes' | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const coursesRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);
  const schemesRef = useRef<HTMLDivElement>(null);

  const backendLang = toBackendLanguage(language);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setRecordingState('ready');
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setRecordingState('recording');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRecordClick = () => {
    if (recordingState === 'idle' || recordingState === 'ready') {
      setAudioBlob(null);
      setRecordingState('idle');
      startRecording();
    } else if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const submitAudio = async () => {
    if (!audioBlob) return;
    setLoading(true);
    setLoadingMessage(t('listening', language));
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      const response = await fetch(`${API_BASE}/speech/transcribe`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      setTranscript(data.transcript);
      setCareers(data.careers);
      setStep(1);
    } catch (error) {
      console.error('Error submitting audio:', error);
      alert('Failed to process audio. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const selectCareer = async (career: Career) => {
    setSelectedCareer(career);
    setLoading(true);
    setLoadingMessage(t('finding_courses', language));
    try {
      const token = await getToken();
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
      const [coursesRes, jobsRes] = await Promise.all([
        fetch(`${API_BASE}/courses/suggest`, {
          method: 'POST', headers,
          body: JSON.stringify({ career: career.title, language: backendLang }),
        }),
        fetch(`${API_BASE}/jobs/platforms`, {
          method: 'POST', headers,
          body: JSON.stringify({ career: career.title, careerType: career.type }),
        }),
      ]);
      const coursesData = await coursesRes.json();
      const jobsData = await jobsRes.json();
      setCourses(coursesData.courses);
      setJobs(jobsData.platforms);
      setSchemes([]); // reset — agent will populate via tool
      setStep(2);
    } catch (error) {
      console.error('Error fetching courses/jobs:', error);
      alert('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const resetWizard = () => {
    setStep(0); setRecordingState('idle'); setAudioBlob(null);
    setTranscript(''); setCareers([]); setSelectedCareer(null);
    setCourses([]); setJobs([]); setSchemes([]); setHighlightSection(null);
  };

  const handleAgentAction = (action: string, payload?: any) => {
    switch (action) {
      case 'scroll_to_courses':
        setHighlightSection('courses');
        coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setHighlightSection(null), 2500);
        break;
      case 'scroll_to_jobs':
        setHighlightSection('jobs');
        jobsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setHighlightSection(null), 2500);
        break;
      case 'scroll_to_schemes':
        setHighlightSection('schemes');
        schemesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => setHighlightSection(null), 2500);
        break;
      case 'open_url':
        if (payload?.url) {
          window.open(payload.url, '_blank');
        } else {
          console.warn('open_url action received without a URL:', payload);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Step indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step === i ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white scale-110'
                  : step > i ? 'bg-green-500 text-white'
                  : 'bg-white/50 dark:bg-white/10 text-gray-400 dark:text-gray-600'
                }`}>
                  {step > i ? '✓' : i + 1}
                </div>
                {i < 2 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all ${
                    step > i ? 'bg-gradient-to-r from-orange-500 to-pink-600' : 'bg-white/50 dark:bg-white/10'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-8 mt-4">
            {['step_0', 'step_1', 'step_2'].map((key, i) => (
              <span key={key} className={`text-sm font-medium font-outfit ${
                step === i ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-600'
              }`}>{t(key as any, language)}</span>
            ))}
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900 dark:text-white font-outfit">{loadingMessage}</p>
            </div>
          </div>
        )}

        {step === 0 && <Step0 recordingState={recordingState} onRecordClick={handleRecordClick} onSubmit={submitAudio} hasAudio={!!audioBlob} language={language} />}
        {step === 1 && <Step1 transcript={transcript} careers={careers} onSelectCareer={selectCareer} onBack={() => setStep(0)} language={language} />}
        {step === 2 && (
          <Step2
            selectedCareer={selectedCareer!}
            courses={courses}
            jobs={jobs}
            schemes={schemes}
            onSchemesUpdate={setSchemes}
            onCoursesUpdate={setCourses}
            onJobsUpdate={setJobs}
            onChangeCareer={() => setStep(1)}
            onStartOver={resetWizard}
            language={language}
            transcript={transcript}
            highlightSection={highlightSection}
            coursesRef={coursesRef}
            jobsRef={jobsRef}
            schemesRef={schemesRef}
            onAgentAction={handleAgentAction}
          />
        )}
      </div>
    </div>
  );
}

function Step0({ recordingState, onRecordClick, onSubmit, hasAudio, language }: any) {
  return (
    <div className="animate-fadeUp">
      <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-black/5 dark:border-white/10 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white font-outfit">{t('voice_prompt', language)}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 font-outfit">{t('voice_subtext', language)}</p>
        <div className="flex flex-col items-center">
          <button onClick={onRecordClick} className="relative w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 shadow-2xl hover:scale-110 transition-transform animate-float">
            {recordingState === 'recording' ? (
              <><MicOff className="w-10 h-10 text-white mx-auto" /><div className="absolute inset-0 rounded-full bg-red-500/30 animate-pulseRing"></div></>
            ) : (
              <Mic className="w-10 h-10 text-white mx-auto" />
            )}
          </button>
          <p className={`mt-6 text-lg font-medium font-outfit ${
            recordingState === 'recording' ? 'text-red-600 dark:text-red-400'
            : recordingState === 'ready' ? 'text-green-600 dark:text-green-400'
            : 'text-gray-600 dark:text-gray-400'
          }`}>
            {recordingState === 'recording' ? t('recording', language) : recordingState === 'ready' ? t('recording_ready', language) : 'Click to start'}
          </p>
          {hasAudio && (
            <div className="flex gap-3 mt-8">
              <button onClick={onRecordClick} className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-outfit">{t('record_again', language)}</button>
              <button onClick={onSubmit} className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium hover:shadow-lg transition-all font-outfit">{t('get_suggestions', language)} <ArrowRight className="inline w-4 h-4 ml-1" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1({ transcript, careers, onSelectCareer, onBack, language }: any) {
  return (
    <div className="animate-fadeUp space-y-6">
      <div className="bg-purple-500/10 dark:bg-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
        <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2 font-outfit">{t('you_said', language)}</p>
        <p className="text-gray-800 dark:text-gray-200 italic">"{transcript}"</p>
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white font-outfit">{t('best_careers', language)}</h2>
      <div className="grid gap-4">
        {careers.map((career: Career, idx: number) => (
          <button key={idx} onClick={() => onSelectCareer(career)}
            className="group text-left p-6 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-xl hover:translate-x-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-outfit">{career.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{career.description}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium font-outfit ${
                  career.type.toLowerCase().includes('freelance') ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-green-500/10 text-green-600 dark:text-green-400'
                }`}>{career.type.toLowerCase().includes('freelance') ? t('freelance', language) : t('job', language)}</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
            </div>
          </button>
        ))}
      </div>
      <button onClick={onBack} className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-outfit">
        <ArrowLeft className="inline w-4 h-4 mr-1" /> {t('go_back', language)}
      </button>
    </div>
  );
}

function Step2({ selectedCareer, courses, jobs, schemes, onSchemesUpdate, onCoursesUpdate, onJobsUpdate, onChangeCareer, onStartOver, language, transcript, highlightSection, coursesRef, jobsRef, schemesRef, onAgentAction }: any) {
  return (
    <div className="animate-fadeUp space-y-8">
      <div className="text-center">
        <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 text-orange-700 dark:text-orange-300 font-bold text-lg font-outfit">
          {selectedCareer.title}
        </span>
      </div>

      {/* Courses */}
      <div ref={coursesRef} className={`transition-all duration-500 rounded-2xl p-1 ${highlightSection === 'courses' ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950' : ''}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-outfit">{t('learn_courses', language)}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {courses.map((course: Course, idx: number) => (
            <a key={idx} href={course.url} target="_blank" rel="noopener noreferrer"
              className="group p-5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                {course.platform.toLowerCase().includes('youtube') ? <Youtube className="w-6 h-6 text-red-600 flex-shrink-0" /> : <Globe className="w-6 h-6 text-purple-600 flex-shrink-0" />}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 font-outfit">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{course.platform}</p>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">{course.level}</span>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Govt Schemes — agent se aane pe dikhega */}
      {schemes.length > 0 && (
        <div ref={schemesRef} className={`transition-all duration-500 rounded-2xl p-1 ${highlightSection === 'schemes' ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">{t('govt_schemes', language)}</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-outfit">{t('govt_schemes_sub', language)}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {schemes.map((scheme: GovtScheme, idx: number) => (
              <a key={idx} href={scheme.url} target="_blank" rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/60 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 font-outfit text-sm">{scheme.name}</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2 leading-relaxed">💰 {scheme.benefit}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">✓ {scheme.eligibility}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-yellow-500 group-hover:text-yellow-600 flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Schemes prompt — agar abhi tak nahi aaye */}
      {schemes.length === 0 && (
        <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 border-dashed text-center">
          <p className="text-sm text-yellow-700 dark:text-yellow-400 font-outfit">
            {t('govt_schemes_hint', language)}
          </p>
        </div>
      )}

      {/* Jobs */}
      <div ref={jobsRef} className={`transition-all duration-500 rounded-2xl p-1 ${highlightSection === 'jobs' ? 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950' : ''}`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-outfit">{t('get_hired', language)}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {jobs.map((job: JobPlatform, idx: number) => (
            job.isTip ? (
              <div key={idx} className="p-5 rounded-xl bg-green-500/10 dark:bg-green-500/15 border border-green-500/30">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h3 className="font-bold text-green-800 dark:text-green-300 mb-1 font-outfit">{job.name}</h3>
                    <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">{job.tip}</p>
                  </div>
                </div>
              </div>
            ) : (
              <a key={idx} href={job.url} target="_blank" rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/10 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 font-outfit">{job.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{job.tip}</p>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">{job.type}</span>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0" />
                </div>
              </a>
            )
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onChangeCareer} className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-outfit">{t('change_career', language)}</button>
        <button onClick={onStartOver} className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-outfit">
          <RotateCcw className="inline w-4 h-4 mr-1" /> {t('start_over', language)}
        </button>
      </div>

      <AgentChat
        selectedCareer={selectedCareer.title}
        transcript={transcript}
        courses={courses}
        jobs={jobs}
        schemes={schemes}
        onAction={onAgentAction}
        onCoursesUpdate={onCoursesUpdate}
        onJobsUpdate={onJobsUpdate}
        onSchemesUpdate={onSchemesUpdate}
        onMoreCareers={onChangeCareer}
      />
    </div>
  );
}