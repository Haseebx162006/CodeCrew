import React, { useState, useEffect } from 'react';
import { LenisProvider } from './components/landing/LenisProvider';
import { CustomCursor } from './components/landing/CustomCursor';
import { WelcomeIntroPreloader } from './components/landing/WelcomeIntroPreloader';
import { ModernistNavbar } from './components/layout/ModernistNavbar';
import { AwsmdHero } from './components/landing/AwsmdHero';
import { AgentCollectiveSection } from './components/landing/AgentCollectiveSection';
import { LiveWorkflowSimulator } from './components/landing/LiveWorkflowSimulator';
import { ModernistShowcase } from './components/landing/ModernistShowcase';
import { ModernistArchitecture, ModernistBenchmarks, ModernistFooter } from './components/landing/ModernistArchitecture';
import { ComparisonSection } from './components/landing/ComparisonSection';
import { LandingFaq } from './components/landing/LandingFaq';
import { ModernistStudio } from './components/workspace/ModernistStudio';
import { ModernistAuthModal } from './components/auth/ModernistAuthModal';
import { SuperheroAgentsShowcase } from './components/superhero/SuperheroAgentsShowcase';
import { TaskHistoryDrawer } from './components/workspace/TaskHistoryDrawer';
import { NotificationToast } from './components/ui/NotificationToast';
import { useAppStore } from './store/appStore';

export const App: React.FC = () => {
  const { showHeroShowcase, setShowHeroShowcase, initAuth, isAuthenticated } = useAppStore();
  
  // Persist and restore active view on page refresh
  const [activeView, setActiveView] = useState<'landing' | 'workspace'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('active_view');
      if (saved === 'workspace' || saved === 'landing') return saved;
      if (localStorage.getItem('auth_token')) return 'workspace';
    }
    return 'landing';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');

  // Verify stored session on app mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Keep view in sync if auth state changes
  useEffect(() => {
    if (isAuthenticated && !localStorage.getItem('active_view')) {
      setActiveView('workspace');
      localStorage.setItem('active_view', 'workspace');
    }
  }, [isAuthenticated]);

  const handleSetView = (view: 'landing' | 'workspace') => {
    setActiveView(view);
    localStorage.setItem('active_view', view);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenWorkspace = () => {
    handleSetView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroShowcaseComplete = () => {
    setShowHeroShowcase(false);
    handleOpenWorkspace();
  };

  return (
    <LenisProvider>
      <div className="min-h-screen bg-[#7D8DA5] text-[#0F172A] relative overflow-x-hidden select-none">
        {/* Animated Cinematic Welcome Preloader Screen */}
        <WelcomeIntroPreloader />

        {/* Trailing Spring Magnetic Cursor */}
        <CustomCursor />

        {/* Clean Pill Navbar */}
        <ModernistNavbar
          onOpenWorkspace={handleOpenWorkspace}
          onOpenAuth={handleOpenAuth}
          activeView={activeView}
          setActiveView={handleSetView}
        />

        {/* View Switcher: Reference-Style Modernist Hero Showcase vs Pro Studio */}
        {activeView === 'landing' ? (
          <main className="relative z-10 pt-16 space-y-6 sm:space-y-10">
            <AwsmdHero
              onOpenWorkspace={handleOpenWorkspace}
              onOpenAuth={handleOpenAuth}
            />
            <AgentCollectiveSection />
            <LiveWorkflowSimulator />
            <ModernistShowcase />
            <ModernistArchitecture />
            <ComparisonSection />
            <ModernistBenchmarks />
            <LandingFaq />
            <ModernistFooter
              onOpenWorkspace={handleOpenWorkspace}
              onOpenAuth={() => handleOpenAuth('signup')}
            />
          </main>
        ) : (
          <main className="relative z-10 pt-16">
            <ModernistStudio />
          </main>
        )}

        {/* Slide-over Task History Drawer */}
        <TaskHistoryDrawer />

        {/* Modernist White Modal (Sign Up / Sign In) */}
        <ModernistAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />

        {/* Cinematic Superhero Agents Showcase (Appears after auth) */}
        <SuperheroAgentsShowcase
          isOpen={showHeroShowcase}
          onComplete={handleHeroShowcaseComplete}
        />

        {/* Floating In-App Notifications */}
        <NotificationToast />
      </div>
    </LenisProvider>
  );
};

export default App;
