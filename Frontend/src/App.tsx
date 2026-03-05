import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { CareerGuidePage } from './pages/CareerGuidePage';
import { ProfilePage } from './pages/ProfilePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_BASE = 'http://localhost:5000/api';

if (!CLERK_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

// Guard — agar profile complete nahi toh onboarding pe bhejo
function GuideGuard() {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn } = useUser();
  const [checking, setChecking] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const check = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/conversation/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProfileComplete(data.profile?.profileComplete === true);
      } catch {
        setProfileComplete(false);
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <CareerGuidePage />;
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={CLERK_KEY}
      navigate={(to) => navigate(to)}
    >
      <div className="font-outfit">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/onboarding" element={
            <>
              <SignedIn><OnboardingPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />

          <Route path="/guide" element={
            <>
              <SignedIn><GuideGuard /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />

          <Route path="/profile" element={
            <>
              <SignedIn><ProfilePage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
        </Routes>
      </div>
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <ClerkProviderWithRoutes />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;