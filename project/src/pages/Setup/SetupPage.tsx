import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Goal, ActivityLevel, DietaryPref, Allergy, HealthCondition } from '../../types';
import './SetupPage.css';

const GOALS: { id: Goal; label: string; emoji: string; desc: string }[] = [
  { id: 'lose_weight', label: 'Lose Weight', emoji: '⚖️', desc: 'Shed pounds sustainably' },
  { id: 'gain_muscle', label: 'Gain Muscle', emoji: '💪', desc: 'Build lean muscle mass' },
  { id: 'eat_healthier', label: 'Eat Healthier', emoji: '🥗', desc: 'Better food choices daily' },
  { id: 'manage_condition', label: 'Manage Condition', emoji: '❤️', desc: 'Support your health needs' },
  { id: 'maintain_weight', label: 'Maintain Weight', emoji: '🎯', desc: 'Stay at your ideal weight' },
];

const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; emoji: string; desc: string }[] = [
  { id: 'sedentary', label: 'Sedentary', emoji: '🛋️', desc: 'Little or no exercise' },
  { id: 'light', label: 'Light', emoji: '🚶', desc: '1–3 days/week' },
  { id: 'moderate', label: 'Moderate', emoji: '🏃', desc: '3–5 days/week' },
  { id: 'very_active', label: 'Very Active', emoji: '🏋️', desc: '6–7 days/week' },
];

const DIETARY_PREFS: { id: DietaryPref; label: string; emoji: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥦' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'keto', label: 'Keto', emoji: '🥑' },
  { id: 'paleo', label: 'Paleo', emoji: '🍖' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'gluten_free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'halal', label: 'Halal', emoji: '☪️' },
  { id: 'kosher', label: 'Kosher', emoji: '✡️' },
  { id: 'no_preference', label: 'No Preference', emoji: '🍽️' },
];

const ALLERGIES: { id: Allergy; label: string; emoji: string }[] = [
  { id: 'nuts', label: 'Nuts', emoji: '🥜' },
  { id: 'dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'shellfish', label: 'Shellfish', emoji: '🦐' },
  { id: 'soy', label: 'Soy', emoji: '🫘' },
  { id: 'eggs', label: 'Eggs', emoji: '🥚' },
  { id: 'wheat', label: 'Wheat', emoji: '🌾' },
  { id: 'fish', label: 'Fish', emoji: '🐟' },
  { id: 'sesame', label: 'Sesame', emoji: '🌰' },
];

const CONDITIONS: { id: HealthCondition; label: string; emoji: string }[] = [
  { id: 'none', label: 'None', emoji: '✅' },
  { id: 'diabetes', label: 'Diabetes', emoji: '💉' },
  { id: 'hypertension', label: 'Hypertension', emoji: '❤️' },
  { id: 'pcos', label: 'PCOS', emoji: '🌸' },
  { id: 'cholesterol', label: 'High Cholesterol', emoji: '🩺' },
];

const TOTAL_STEPS = 6;

export function SetupPage() {
  const { updateDraft, completeOnboarding, navigate } = useApp();
  const [step, setStep] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);

  // Local state
  const [goal, setGoal] = useState<Goal | null>(null);
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [activity, setActivity] = useState<ActivityLevel | null>(null);
  const [dietPrefs, setDietPrefs] = useState<DietaryPref[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<HealthCondition[]>(['none']);

  const toggleArr = <T,>(arr: T[], val: T, set: (v: T[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const canNext = () => {
    if (step === 1) return !!goal;
    if (step === 2) return !!age && !!height && !!weight;
    if (step === 3) return !!activity;
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    } else {
      updateDraft({ goal: goal!, age: +age, height: +height, weight: +weight, units, activityLevel: activity!, dietaryPrefs: dietPrefs, allergies, healthConditions: conditions });
      setShowConfetti(true);
      setTimeout(() => completeOnboarding(), 2200);
    }
  };

  if (showConfetti) {
    return (
      <div className="setup-confetti-screen">
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="confetti-piece" style={{ '--ci': i, '--cr': Math.random(), '--cd': Math.random() * 3 } as React.CSSProperties} />
          ))}
        </div>
        <div className="confetti-message animate-bounce-in">
          <span className="confetti-emoji">🎉</span>
          <h2>Your personalized plan is ready!</h2>
          <p>Let's start your journey to better health</p>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-page">
      <div className="setup-header">
        <button className="setup-back" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('auth')} aria-label="Go back">←</button>
        <div className="setup-progress-bar">
          <div className="setup-progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
        <span className="setup-step-label">{step}/{TOTAL_STEPS}</span>
      </div>

      <div className="setup-content animate-slide-left" key={step}>
        {step === 1 && (
          <>
            <h2 className="setup-title">What's your goal?</h2>
            <p className="setup-sub">We'll personalise your plan around this</p>
            <div className="setup-goal-grid">
              {GOALS.map(g => (
                <button key={g.id} className={`setup-goal-card${goal === g.id ? ' selected' : ''}`} onClick={() => setGoal(g.id)}>
                  <span className="goal-emoji">{g.emoji}</span>
                  <span className="goal-label">{g.label}</span>
                  <span className="goal-desc">{g.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="setup-title">About you</h2>
            <p className="setup-sub">Used to calculate your calorie targets</p>
            <div className="setup-units-toggle">
              <button className={`unit-btn${units === 'metric' ? ' active' : ''}`} onClick={() => setUnits('metric')}>Metric</button>
              <button className={`unit-btn${units === 'imperial' ? ' active' : ''}`} onClick={() => setUnits('imperial')}>Imperial</button>
            </div>
            <div className="setup-inputs">
              <div className="form-group">
                <label className="form-label" htmlFor="setup-age">Age</label>
                <input id="setup-age" type="number" className="form-input" placeholder="e.g. 28" value={age} onChange={e => setAge(e.target.value)} min="10" max="100" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="setup-height">Height ({units === 'metric' ? 'cm' : 'ft'})</label>
                <input id="setup-height" type="number" className="form-input" placeholder={units === 'metric' ? 'e.g. 165' : 'e.g. 5.5'} value={height} onChange={e => setHeight(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="setup-weight">Weight ({units === 'metric' ? 'kg' : 'lbs'})</label>
                <input id="setup-weight" type="number" className="form-input" placeholder={units === 'metric' ? 'e.g. 65' : 'e.g. 143'} value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="setup-title">Activity level</h2>
            <p className="setup-sub">How active are you on a typical week?</p>
            <div className="setup-activity-grid">
              {ACTIVITY_LEVELS.map(a => (
                <button key={a.id} className={`setup-activity-card${activity === a.id ? ' selected' : ''}`} onClick={() => setActivity(a.id)}>
                  <span className="activity-emoji">{a.emoji}</span>
                  <span className="activity-label">{a.label}</span>
                  <span className="activity-desc">{a.desc}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="setup-title">Dietary preferences</h2>
            <p className="setup-sub">Select all that apply</p>
            <div className="setup-chips">
              {DIETARY_PREFS.map(p => (
                <button key={p.id} className={`chip${dietPrefs.includes(p.id) ? ' selected' : ''}`} onClick={() => toggleArr(dietPrefs, p.id, setDietPrefs)}>
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="setup-title">Allergies & restrictions</h2>
            <p className="setup-sub">We'll keep these out of your recommendations</p>
            <div className="setup-chips">
              {ALLERGIES.map(a => (
                <button key={a.id} className={`chip${allergies.includes(a.id) ? ' selected' : ''}`} onClick={() => toggleArr(allergies, a.id, setAllergies)}>
                  {a.emoji} {a.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="setup-title">Health conditions</h2>
            <p className="setup-sub">Optional — helps us tailor advice for you</p>
            <div className="setup-chips">
              {CONDITIONS.map(c => (
                <button key={c.id} className={`chip${conditions.includes(c.id) ? ' selected' : ''}`}
                  onClick={() => c.id === 'none' ? setConditions(['none']) : toggleArr(conditions.filter(x => x !== 'none'), c.id, v => setConditions(v.length ? v : ['none']))}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="setup-footer">
        <button className="btn btn-primary btn-full btn-lg" onClick={handleNext} disabled={!canNext()}>
          {step === TOTAL_STEPS ? '🚀 Build My Plan' : 'Continue →'}
        </button>
        {(step === 4 || step === 5 || step === 6) && (
          <button className="btn btn-ghost btn-full" onClick={handleNext} style={{ marginTop: 8 }}>Skip for now</button>
        )}
      </div>
    </div>
  );
}
