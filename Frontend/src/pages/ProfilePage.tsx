import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Briefcase, MessageSquare, User, Clock, Smartphone, Globe, GraduationCap, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface SessionData {
  id: string;
  chosenCareer: string;
  preferredLanguage: string;
  preferredJobType: string;
  courseLevel: string;
  courses: any[];
  createdAt: string;
}

interface ProfileData {
  profile: any;
  sessions: SessionData[];
  stats: {
    totalCareersExplored: number;
    uniqueCareers: string[];
    totalCoursesSeen: number;
  };
  recentChats: ChatMessage[];
}

const educationLabels: Record<string, string> = {
  'padha nahi': 'Padha Nahi',
  '5th tak': '5th Tak',
  '10th tak': '10th Tak',
  '12th/college': '12th / College',
};

const englishLabels: Record<string, string> = {
  'bilkul nahi': 'Bilkul Nahi',
  'thoda': 'Thoda',
  'achha': 'Achha',
};

const languageLabels: Record<string, string> = {
  hindi: 'हिंदी',
  tamil: 'தமிழ்',
  telugu: 'తెలుగు',
  marathi: 'मराठी',
  english: 'English',
};

export function ProfilePage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'careers' | 'courses' | 'chats'>('careers');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Profile fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const profile = data?.profile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Account Info + Onboarding Profile */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10 shadow-xl">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-16 h-16 rounded-full border-2 border-orange-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">
                  {profile?.name || user?.fullName || user?.firstName || 'User'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-outfit">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
                {profile?.age && (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 font-outfit">
                    Umar: {profile.age} saal
                  </p>
                )}
              </div>
            </div>
            {/* Redo onboarding button */}
            <button
              onClick={() => navigate('/onboarding')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500 transition-all text-sm font-outfit"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Profile
            </button>
          </div>

          {/* Onboarding info cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Language */}
            <div className="bg-orange-500/5 dark:bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium font-outfit">Bhasha</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-outfit">
                {languageLabels[profile?.preferredLanguage] || '—'}
              </p>
            </div>

            {/* Education */}
            <div className="bg-purple-500/5 dark:bg-purple-500/10 rounded-xl p-3 border border-purple-500/20">
              <div className="flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium font-outfit">Padhai</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-outfit">
                {educationLabels[profile?.education] || '—'}
              </p>
            </div>

            {/* Digital Literacy */}
            <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium font-outfit">Smartphone</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-outfit">
                {profile?.digitalLiteracy === true ? 'Haan ✓' : profile?.digitalLiteracy === false ? 'Nahi' : '—'}
              </p>
            </div>

            {/* English Level */}
            <div className="bg-green-500/5 dark:bg-green-500/10 rounded-xl p-3 border border-green-500/20">
              <div className="flex items-center gap-1.5 mb-1">
                <Globe className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium font-outfit">English</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white font-outfit">
                {englishLabels[profile?.englishLevel] || '—'}
              </p>
            </div>
          </div>

          {/* Profile incomplete warning */}
          {!profile?.profileComplete && (
            <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between">
              <p className="text-sm text-yellow-700 dark:text-yellow-400 font-outfit">
                ⚠️ Profile incomplete hai — onboarding complete karo
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-sm font-medium text-yellow-700 dark:text-yellow-400 underline font-outfit"
              >
                Complete karo
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Careers Explored', value: data?.stats.totalCareersExplored || 0, color: 'from-orange-500 to-pink-600' },
            { label: 'Unique Careers', value: data?.stats.uniqueCareers.length || 0, color: 'from-purple-500 to-blue-600' },
            { label: 'Courses Seen', value: data?.stats.totalCoursesSeen || 0, color: 'from-green-500 to-teal-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-black/5 dark:border-white/10 shadow-xl text-center">
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-outfit`}>
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-outfit">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-black/5 dark:border-white/10">
          {[
            { key: 'careers', label: 'Careers', icon: Briefcase },
            { key: 'courses', label: 'Courses', icon: BookOpen },
            { key: 'chats', label: 'Chats', icon: MessageSquare },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all font-outfit ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Careers Tab */}
        {activeTab === 'careers' && (
          <div className="space-y-4">
            {!data?.sessions.length ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 font-outfit mb-3">
                  Abhi tak koi career explore nahi kiya 🚀
                </p>
                <button
                  onClick={() => navigate('/guide')}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium font-outfit"
                >
                  Career Guide Shuru Karo
                </button>
              </div>
            ) : (
              data?.sessions.map((session, i) => (
                <div key={i} className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-black/5 dark:border-white/10 shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white font-outfit">
                        {session.chosenCareer || 'Unknown Career'}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {session.preferredLanguage && (
                          <span className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-outfit">
                            {languageLabels[session.preferredLanguage] || session.preferredLanguage}
                          </span>
                        )}
                        {session.preferredJobType && (
                          <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 font-outfit">
                            {session.preferredJobType}
                          </span>
                        )}
                        {session.courseLevel && (
                          <span className="px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 font-outfit">
                            {session.courseLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 font-outfit">
                      <Clock className="w-3 h-3" />
                      {new Date(session.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {data?.sessions.flatMap(s => s.courses || []).length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8 font-outfit">
                Abhi tak koi course nahi dekha. Agent se pucho "courses dikhao"! 🎓
              </p>
            ) : (
              data?.sessions.flatMap((s, si) =>
                (s.courses || []).map((course: any, ci: number) => (
                  <a key={`${si}-${ci}`} href={course.url} target="_blank" rel="noopener noreferrer"
                    className="block bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-black/5 dark:border-white/10 shadow hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white font-outfit">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-outfit">
                          {course.platform} • {s.chosenCareer}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 font-outfit">
                        {course.level}
                      </span>
                    </div>
                  </a>
                ))
              )
            )}
          </div>
        )}

        {/* Chat History Tab */}
        {activeTab === 'chats' && (
          <div className="space-y-3">
            {!data?.recentChats.length ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8 font-outfit">
                Abhi tak koi chat nahi hui. Agent se baat karo! 🎤
              </p>
            ) : (
              data?.recentChats.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-outfit ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-br-sm'
                      : 'bg-white/70 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-black/5 dark:border-white/10'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}