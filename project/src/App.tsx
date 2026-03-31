import { useApp } from './context/AppContext';
import { OnboardingPage } from './pages/Onboarding/OnboardingPage';
import { AuthPage } from './pages/Auth/AuthPage';
import { SetupPage } from './pages/Setup/SetupPage';
import { HomePage } from './pages/Home/HomePage';
import { ScanPage } from './pages/Scan/ScanPage';
import { InsightsPage } from './pages/Insights/InsightsPage';
import { RecipesPage } from './pages/Recipes/RecipesPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { CommunityPage } from './pages/Community/CommunityPage';
import { BottomNav } from './components/BottomNav/BottomNav';
import './App.css';

const PAGES_WITH_NAV = ['home', 'scan', 'insights', 'recipes', 'profile', 'community'];

export default function App() {
  const { page } = useApp();

  const renderPage = () => {
    switch (page) {
      case 'onboarding': return <OnboardingPage />;
      case 'auth': return <AuthPage />;
      case 'setup': return <SetupPage />;
      case 'home': return <HomePage />;
      case 'scan': return <ScanPage />;
      case 'insights': return <InsightsPage />;
      case 'recipes': return <RecipesPage />;
      case 'profile': return <ProfilePage />;
      case 'community': return <CommunityPage />;
      default: return <OnboardingPage />;
    }
  };

  return (
    <div className="page-wrapper">
      <main className={PAGES_WITH_NAV.includes(page) ? 'page-content' : ''}>
        {renderPage()}
      </main>
      {PAGES_WITH_NAV.includes(page) && <BottomNav />}
    </div>
  );
}
