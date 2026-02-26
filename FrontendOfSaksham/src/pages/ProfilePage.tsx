import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, Briefcase, MessageSquare, User, Clock } from 'lucide-react';

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

export function ProfilePage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { language } = useLanguage();
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors relative overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-orange-500/20 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Account Info */}
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10 shadow-xl">
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
                {user?.fullName || user?.firstName || 'User'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-outfit">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
              {data?.profile && (
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-outfit">
                    {data.profile.preferredLanguage === 'hindi' ? 'Hindi' : 'English'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 font-outfit">
                    {data.profile.workPreference || 'Both'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Careers Explored', value: data?.stats.totalCareersExplored || 0, icon: Briefcase, color: 'orange' },
            { label: 'Unique Careers', value: data?.stats.uniqueCareers.length || 0, icon: BookOpen, color: 'purple' },
            { label: 'Courses Seen', value: data?.stats.totalCoursesSeen || 0, icon: BookOpen, color: 'green' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-black/5 dark:border-white/10 shadow-xl text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-outfit">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-black/5 dark:border-white/10">
          {[
            { key: 'careers', label: 'Careers', icon: Briefcase },
            { key: 'courses', label: 'Courses', icon: BookOpen },
            { key: 'chats', label: 'Chat History', icon: MessageSquare },
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
            {data?.sessions.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8 font-outfit">
                Abhi tak koi career explore nahi kiya. Career Guide pe jao! 🚀
              </p>
            ) : (
              data?.sessions.map((session, i) => (
                <div key={i} className="bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-black/5 dark:border-white/10 shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white font-outfit">
                        {session.chosenCareer || 'Unknown Career'}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-outfit">
                          {session.preferredLanguage}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400 font-outfit">
                          {session.preferredJobType}
                        </span>
                        <span className="px-2 py-1 rounded text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 font-outfit">
                          {session.courseLevel}
                        </span>
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
                  <a
                    key={`${si}-${ci}`}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-black/5 dark:border-white/10 shadow hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white font-outfit">{course.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-outfit">{course.platform} • {s.chosenCareer}</p>
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
            {data?.recentChats.length === 0 ? (
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