export interface Career {
  title: string;
  type: string;
  description: string;
}

export interface Course {
  title: string;
  platform: string;
  url: string;
  level: string;
}

export interface JobPlatform {
  name: string;
  url: string | null;  // WhatsApp tip card mein null hoga
  type: string;
  tip: string;
  isLink?: boolean;
  isTip?: boolean;
}

export interface GovtScheme {
  name: string;
  benefit: string;
  eligibility: string;
  url: string;
}

export interface TranscribeResponse {
  transcript: string;
  careers: Career[];
}

export interface CoursesResponse {
  courses: Course[];
}

export interface JobsResponse {
  platforms: JobPlatform[];
}

export interface ChatResponse {
  message: string;
  history: ChatMessage[];
  newCourses?: Course[];
  newCareers?: Career[];
  newJobs?: JobPlatform[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}