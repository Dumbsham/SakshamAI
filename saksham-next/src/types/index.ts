export interface UserProfile {
  userId: string;
  name?: string;
  age?: string;
  education?: string;
  digitalLiteracy?: boolean;
  englishLevel?: string;
  preferredLanguage?: string;
  workPreference?: string;
  hoursPerDay?: number;
  interests?: string;
  transcript?: string;
  profileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Career {
  title: string;
  description: string;
  skills: string[];
  salary: string;
}

export interface Course {
  title: string;
  platform: string;
  url: string;
  level: string;
}

export interface JobPlatform {
  name: string;
  url: string | null;
  type: string;
  tip: string;
  isTip: boolean;
}

export interface GovtScheme {
  name: string;
  description: string;
  benefits: string;
  eligibility: string;
  link?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface AgentResponse {
  message: string;
  audio?: string;
  action?: string;
  actionPayload?: { url?: string | null };
  history: ChatMessage[];
  courses: Course[];
  jobs: JobPlatform[];
  schemes: GovtScheme[];
  allUiActions?: UiAction[];
}

export interface UiAction {
  action: string;
  url?: string;
}

export type Language = "hindi" | "tamil" | "telugu" | "marathi";
export type Theme = "light" | "dark";
export type MicState = "idle" | "recording" | "thinking" | "speaking";

export type EducationLevel =
  | "padha nahi"
  | "5th tak"
  | "10th tak"
  | "12th/college";