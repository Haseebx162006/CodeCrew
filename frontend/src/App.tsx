import React, { useEffect } from 'react';
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
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { SuperheroAgentsShowcase } from './components/superhero/SuperheroAgentsShowcase';
import { TaskHistoryDrawer } from './components/workspace/TaskHistoryDrawer';
import { NotificationToast } from './components/ui/NotificationToast';
import { useAppStore } from './store/appStore';

export const App: React.FC = () => {
  const {
    showHeroShowcase,
    setShowHeroShowcase,
    initAuth,
    isAuthenticated,
    activeView,
    setActiveView,
  } = useAppStore();

  // Verify stored session on app mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Keep view in sync if auth state changes
  useEffect(() => {
    if (isAuthenticated && (activeView === 'login' || activeView === 'signup')) {
      setActiveView('workspace');
    }
  }, [isAuthenticated, activeView, setActiveView]);

  const handleOpenWorkspace = () => {
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'signup') => {
    setActiveView(mode);
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

        {/* Render View Based on Active Route / State */}
        {activeView === 'login' ? (
          <main className="relative z-10">
            <LoginPage />
          </main>
        ) : activeView === 'signup' ? (
          <main className="relative z-10">
            <SignUpPage />
          </main>
        ) : (
          <>
            {/* Clean Pill Navbar for Landing and Workspace */}
            <ModernistNavbar
              onOpenWorkspace={handleOpenWorkspace}
              onOpenAuth={handleOpenAuth}
              activeView={activeView}
              setActiveView={setActiveView}
            />

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
          </>
        )}

        {/* Slide-over Task History Drawer */}
        <TaskHistoryDrawer />

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
