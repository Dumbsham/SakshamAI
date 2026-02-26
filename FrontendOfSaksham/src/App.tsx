import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { CareerGuidePage } from './pages/CareerGuidePage';
import { ProfilePage } from './pages/ProfilePage';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_KEY) {
  throw new Error('Missing Clerk Publishable Key');
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
          <Route
            path="/guide"
            element={
              <>
                <SignedIn>
                  <CareerGuidePage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
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
