import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { mockSuggestions } from '../../data/mockData';
import type { MealType } from '../../types';
import './HomePage.css';

const MEAL_SLOTS: { type: MealType; label: string; emoji: string; time: string }[] = [
  { type: 'breakfast', label: 'Breakfast', emoji: '🌅', time: '8:00 AM' },
  { type: 'lunch', label: 'Lunch', emoji: '☀️', time: '12:30 PM' },
  { type: 'snack', label: 'Snack', emoji: '🍎', time: '3:30 PM' },
  { type: 'dinner', label: 'Dinner', emoji: '🌙', time: '7:00 PM' },
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  return { text: 'Good Evening', emoji: '🌙' };
}

function CalorieRing({ consumed, target }: { consumed: number; target: number }) {
  const pct = Math.min(consumed / target, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="calorie-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140" aria-label={`${consumed} of ${target} calories consumed`}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--primary-100)" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#66BB6A" />
          </linearGradient>
        </defs>
      </svg>
      <div className="calorie-ring-center">
        <span className="calorie-num">{consumed.toLocaleString()}</span>
        <span className="calorie-label">/ {target.toLocaleString()} kcal</span>
      </div>
    </div>
  );
}

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min((value / target) * 100, 100);
  return (
    <div className="macro-bar-item">
      <div className="macro-bar-header">
        <span className="macro-bar-label">{label}</span>
        <span className="macro-bar-value">{value}g <span className="macro-bar-target">/ {target}g</span></span>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function HomePage() {
  const { user, dailyLog, logWater, navigate } = useApp();
  const [suggIdx, setSuggIdx] = useState(0);
  const [animRing, setAnimRing] = useState(false);

  useEffect(() => { setTimeout(() => setAnimRing(true), 100); }, []);

  const greeting = getGreeting();
  const sugg = mockSuggestions[suggIdx % mockSuggestions.length];
  const today = new Date().getDay(); // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1;

  const macroTargets = user?.macroTargets ?? { protein: 95, carbs: 237, fat: 63 };
  const macros = dailyLog.totalMacros;

  return (
    <div className="home-page">
      {/* Greeting */}
      <div className="home-greeting page-section">
        <div>
          <h1 className="greeting-text">{greeting.text}, {user?.name?.split(' ')[0] ?? 'Friend'} {greeting.emoji}</h1>
          <p className="greeting-streak">🔥 {user?.currentStreak ?? 0}-day streak! Keep it up!</p>
        </div>
        <button className="greeting-avatar avatar" onClick={() => navigate('profile')} aria-label="View profile"
          style={{ width: 44, height: 44, fontSize: 18 }}>
          {user?.name?.[0] ?? 'U'}
        </button>
      </div>

      {/* Nutrition Summary */}
      <div className="page-section">
        <div className="card card-padding nutrition-card animate-slide-up">
          <div className="nutrition-top">
            <CalorieRing consumed={animRing ? dailyLog.totalCalories : 0} target={user?.dailyCalorieTarget ?? 1900} />
            <div className="macro-bars">
              <MacroBar label="Protein" value={macros.protein} target={macroTargets.protein} color="#42A5F5" />
              <MacroBar label="Carbs" value={macros.carbs} target={macroTargets.carbs} color="#FFCA28" />
              <MacroBar label="Fat" value={macros.fat} target={macroTargets.fat} color="#FF7043" />
            </div>
          </div>
          <p className="nutrition-remaining">
            {Math.max(0, (user?.dailyCalorieTarget ?? 1900) - dailyLog.totalCalories)} kcal remaining today
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="page-section">
        <div className="quick-actions-grid">
          {[
            { icon: '📸', label: 'Scan Meal', page: 'scan' as const },
            { icon: '🔍', label: 'Search Food', page: 'recipes' as const },
            { icon: '📊', label: 'My Plan', page: 'insights' as const },
            { icon: '💧', label: 'Log Water', page: null },
          ].map(a => (
            <button key={a.label} className="quick-action-card card"
              onClick={() => a.page ? navigate(a.page) : logWater(Math.min(dailyLog.waterGlasses + 1, 8))}
              aria-label={a.label}>
              <span className="quick-action-icon">{a.icon}</span>
              <span className="quick-action-label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Meals Timeline */}
      <div className="page-section">
        <h2 className="section-title">Today's Meals</h2>
        <div className="meals-timeline">
          {MEAL_SLOTS.map(slot => {
            const logged = dailyLog.meals.find(m => m.type === slot.type);
            return (
              <div key={slot.type} className="meal-slot">
                <div className="meal-slot-time">
                  <span className="meal-slot-emoji">{slot.emoji}</span>
                  <span className="meal-slot-time-label">{slot.time}</span>
                </div>
                <div className={`meal-slot-card card${logged ? ' logged' : ' empty'}`}>
                  {logged ? (
                    <div className="meal-logged">
                      <div className="meal-logged-info">
                        <span className="meal-logged-name">{logged.foods.map(f => f.name).join(', ')}</span>
                        <span className="meal-logged-cal">{logged.totalCalories} kcal · {logged.time}</span>
                      </div>
                      <span className="meal-logged-check">✓</span>
                    </div>
                  ) : (
                    <button className="meal-add-btn" onClick={() => navigate('scan')} aria-label={`Add ${slot.label}`}>
                      <span className="meal-add-icon">+</span>
                      <span>Add {slot.label}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Suggestion */}
      <div className="page-section">
        <div className="suggestion-card card" style={{ background: sugg.gradient }}>
          <div className="suggestion-top">
            <span className="suggestion-emoji">{sugg.emoji}</span>
            <button className="suggestion-next" onClick={() => setSuggIdx(i => i + 1)} aria-label="Next suggestion">›</button>
          </div>
          <h3 className="suggestion-title">{sugg.title}</h3>
          <p className="suggestion-body">{sugg.body}</p>
          <button className="btn btn-primary btn-sm suggestion-cta" onClick={() => navigate('scan')}>
            {sugg.action}
          </button>
        </div>
      </div>

      {/* Water Tracker */}
      <div className="page-section">
        <div className="card card-padding water-card">
          <div className="water-header">
            <h2 className="section-title" style={{ margin: 0 }}>💧 Water Intake</h2>
            <span className="water-count">{dailyLog.waterGlasses}/8 glasses</span>
          </div>
          <div className="water-glasses" role="group" aria-label="Water intake tracker">
            {Array.from({ length: 8 }).map((_, i) => (
              <button key={i} className={`water-glass${i < dailyLog.waterGlasses ? ' filled' : ''}`}
                onClick={() => logWater(i + 1)} aria-label={`${i + 1} glass${i > 0 ? 'es' : ''}`}
                aria-pressed={i < dailyLog.waterGlasses}>
                <span className="water-glass-icon">🥤</span>
              </button>
            ))}
          </div>
          <div className="water-progress">
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${(dailyLog.waterGlasses / 8) * 100}%`, background: '#42A5F5' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Streak */}
      <div className="page-section">
        <div className="card card-padding streak-card">
          <div className="streak-header">
            <h2 className="section-title" style={{ margin: 0 }}>This Week</h2>
            <span className="streak-badge">🔥 {user?.currentStreak ?? 0} day streak</span>
          </div>
          <div className="streak-days" role="list">
            {WEEK_DAYS.map((day, i) => {
              const isToday = i === todayIdx;
              const isPast = i < todayIdx;
              return (
                <div key={day} className="streak-day" role="listitem">
                  <span className="streak-day-label">{day}</span>
                  <div className={`streak-circle${isPast ? ' logged' : ''}${isToday ? ' today' : ''}`} aria-label={`${day}: ${isPast ? 'logged' : isToday ? 'today' : 'upcoming'}`}>
                    {isPast ? '✓' : isToday ? '●' : ''}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="streak-best">Your longest streak: {user?.longestStreak ?? 0} days 🏆</p>
        </div>
      </div>

      {/* Community teaser */}
      <div className="page-section">
        <button className="community-teaser card card-padding" onClick={() => navigate('community')}>
          <span className="community-teaser-icon">👥</span>
          <div>
            <p className="community-teaser-title">Community Feed</p>
            <p className="community-teaser-sub">See what others are eating today →</p>
          </div>
        </button>
      </div>
    </div>
  );
}
