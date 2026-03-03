const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchWithAuth(
  path: string,
  options: RequestInit = {},
  token?: string | null
) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function getOrCreateProfile(userId: string, token?: string | null) {
  return fetchWithAuth(
    "/api/conversation/profile",
    { method: "POST", body: JSON.stringify({ userId }) },
    token
  );
}

export async function onboardingChat(
  userId: string,
  message: string,
  language: string,
  token?: string | null
) {
  return fetchWithAuth(
    "/api/conversation/chat",
    { method: "POST", body: JSON.stringify({ userId, message, language }) },
    token
  );
}

export async function agentChat(
  data: {
    message: string;
    history: Array<{ role: string; content: string }>;
    context: {
      language: string;
      selectedCareer: string;
      transcript: string;
      educationLevel: string;
    };
    courses: unknown[];
    jobs: unknown[];
    schemes: unknown[];
  },
  token?: string | null
) {
  return fetchWithAuth(
    "/api/agent/chat",
    { method: "POST", body: JSON.stringify(data) },
    token
  );
}

export async function transcribeAudio(
  audioBlob: Blob,
  language: string,
  token?: string | null
) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("language", language);

  return fetchWithAuth(
    "/api/speech/transcribe",
    { method: "POST", body: formData },
    token
  );
}

export async function suggestCareers(
  transcript: string,
  language: string,
  token?: string | null
) {
  return fetchWithAuth(
    "/api/career/suggest",
    { method: "POST", body: JSON.stringify({ transcript, language }) },
    token
  );
}

export async function suggestCourses(
  career: string,
  language: string,
  level: string,
  token?: string | null
) {
  return fetchWithAuth(
    "/api/courses/suggest",
    { method: "POST", body: JSON.stringify({ career, language, level }) },
    token
  );
}

export async function getJobPlatforms(
  career: string,
  educationLevel: string,
  jobType: string,
  token?: string | null
) {
  return fetchWithAuth(
    "/api/jobs/platforms",
    { method: "POST", body: JSON.stringify({ career, educationLevel, jobType }) },
    token
  );
}

export async function getUserProfile(token?: string | null) {
  return fetchWithAuth("/api/user/profile", { method: "GET" }, token);
}

export async function updateUserProfile(
  data: Record<string, unknown>,
  token?: string | null
) {
  return fetchWithAuth(
    "/api/user/profile",
    { method: "PUT", body: JSON.stringify(data) },
    token
  );
}