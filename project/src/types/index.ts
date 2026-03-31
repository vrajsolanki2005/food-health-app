// ============================================================
// NOURISHAI - TYPE DEFINITIONS
// ============================================================

export type Goal = 'lose_weight' | 'gain_muscle' | 'eat_healthier' | 'manage_condition' | 'maintain_weight';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';
export type DietaryPref = 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'gluten_free' | 'halal' | 'kosher' | 'no_preference';
export type Allergy = 'nuts' | 'dairy' | 'shellfish' | 'soy' | 'eggs' | 'wheat' | 'fish' | 'sesame';
export type HealthCondition = 'diabetes' | 'hypertension' | 'pcos' | 'cholesterol' | 'none';
export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface MacroNutrients {
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  macros: MacroNutrients;
  servingSize: string;
  healthScore: number; // 0-100
  tags: string[];
  image?: string;
}

export interface MealEntry {
  id: string;
  type: MealType;
  time: string;
  foods: FoodItem[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  image?: string;
  note?: string;
}

export interface DailyLog {
  date: string;
  meals: MealEntry[];
  waterGlasses: number;
  totalCalories: number;
  totalMacros: MacroNutrients;
  logged: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;

  // Health profile
  goal: Goal;
  age: number;
  height: number;      // cm
  weight: number;      // kg
  targetWeight?: number;
  activityLevel: ActivityLevel;
  dietaryPrefs: DietaryPref[];
  allergies: Allergy[];
  healthConditions: HealthCondition[];

  // Calculated
  bmr: number;
  tdee: number;
  dailyCalorieTarget: number;
  macroTargets: MacroNutrients;

  // Gamification
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  badges: string[];

  // Settings
  units: 'metric' | 'imperial';
  notifications: boolean;
  reminderTimes: string[];

  createdAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  emoji: string;
  image?: string;
  calories: number;
  macros: MacroNutrients;
  prepTime: number;     // minutes
  cookTime: number;     // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  healthScore: number;  // 0-100
  tags: string[];
  dietaryTags: DietaryPref[];
  allergens: Allergy[];
  ingredients: { name: string; amount: string; }[];
  steps: string[];
  mealType: MealType[];
  rating: number;
  reviewCount: number;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  image?: string;
  caption: string;
  meal?: FoodItem;
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
  liked: boolean;
}

export interface SmartSuggestion {
  id: string;
  type: 'meal' | 'water' | 'habit' | 'nutrient';
  title: string;
  body: string;
  emoji: string;
  action: string;
  gradient: string;
  calories?: number;
}

export interface WeeklyData {
  day: string;
  calories: number;
  target: number;
  logged: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

export type AppPage = 'onboarding' | 'auth' | 'setup' | 'home' | 'scan' | 'insights' | 'recipes' | 'profile' | 'community';
