import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  AppPage, UserProfile, DailyLog, MealEntry, Goal,
  ActivityLevel, DietaryPref, Allergy, HealthCondition
} from '../types';
import { mockDailyLog, mockUserProfile } from '../data/mockData';

// ─── State Shape ────────────────────────────────────────────
interface AppState {
  page: AppPage;
  user: UserProfile | null;
  isAuthenticated: boolean;
  dailyLog: DailyLog;
  weekLogs: DailyLog[];
  setupStep: number;

  // Onboarding draft
  draft: Partial<{
    goal: Goal;
    age: number;
    height: number;
    weight: number;
    activityLevel: ActivityLevel;
    dietaryPrefs: DietaryPref[];
    allergies: Allergy[];
    healthConditions: HealthCondition[];
    units: 'metric' | 'imperial';
  }>;
}

// ─── Context Type ────────────────────────────────────────────
interface AppContextType extends AppState {
  navigate: (page: AppPage) => void;
  setSetupStep: (step: number) => void;
  updateDraft: (data: Partial<AppState['draft']>) => void;
  completeOnboarding: () => void;
  login: (email: string, _password: string) => void;
  logout: () => void;
  logWater: (glasses: number) => void;
  addMealEntry: (entry: MealEntry) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<AppPage>('onboarding');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog>(mockDailyLog);
  const [weekLogs] = useState<DailyLog[]>([]);
  const [setupStep, setSetupStep] = useState(1);
  const [draft, setDraft] = useState<AppState['draft']>({});

  const navigate = useCallback((p: AppPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(p);
  }, []);

  const updateDraft = useCallback((data: Partial<AppState['draft']>) => {
    setDraft(prev => ({ ...prev, ...data }));
  }, []);

  const login = useCallback((_email: string, _password: string) => {
    setIsAuthenticated(true);
    setUser(mockUserProfile);
    setPage('home');
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setPage('onboarding');
    setSetupStep(1);
    setDraft({});
  }, []);

  const completeOnboarding = useCallback(() => {
    // Build user from draft
    const profile: UserProfile = {
      ...mockUserProfile,
      goal: draft.goal ?? 'eat_healthier',
      age: draft.age ?? 25,
      height: draft.height ?? 170,
      weight: draft.weight ?? 70,
      activityLevel: draft.activityLevel ?? 'moderate',
      dietaryPrefs: draft.dietaryPrefs ?? [],
      allergies: draft.allergies ?? [],
      healthConditions: draft.healthConditions ?? ['none'],
      units: draft.units ?? 'metric',
    };
    setUser(profile);
    setIsAuthenticated(true);
    setPage('home');
  }, [draft]);

  const logWater = useCallback((glasses: number) => {
    setDailyLog(prev => ({ ...prev, waterGlasses: glasses }));
  }, []);

  const addMealEntry = useCallback((entry: MealEntry) => {
    setDailyLog(prev => ({
      ...prev,
      meals: [...prev.meals.filter(m => m.type !== entry.type), entry],
      totalCalories: prev.totalCalories + entry.totalCalories,
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      page, user, isAuthenticated, dailyLog, weekLogs,
      setupStep, draft, navigate, setSetupStep, updateDraft,
      completeOnboarding, login, logout, logWater, addMealEntry,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
