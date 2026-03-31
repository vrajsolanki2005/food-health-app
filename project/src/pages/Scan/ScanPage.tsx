import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockFoods } from '../../data/mockData';
import type { MealType } from '../../types';
import './ScanPage.css';

type ScanMode = 'idle' | 'camera' | 'text' | 'barcode' | 'analyzing' | 'result';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

export function ScanPage() {
  const { addMealEntry } = useApp();
  const [mode, setMode] = useState<ScanMode>('idle');
  const [textInput, setTextInput] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [result, setResult] = useState(mockFoods[0]);
  const [logged, setLogged] = useState(false);

  const analyze = (input?: string) => {
    setMode('analyzing');
    setTimeout(() => {
      const food = mockFoods[Math.floor(Math.random() * mockFoods.length)];
      setResult(food);
      setMode('result');
    }, 1800);
    if (input) setTextInput('');
  };

  const handleLog = () => {
    addMealEntry({
      id: `me_${Date.now()}`,
      type: mealType,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      foods: [result],
      totalCalories: result.calories,
      totalMacros: result.macros,
    });
    setLogged(true);
    setTimeout(() => { setMode('idle'); setLogged(false); }, 1500);
  };

  if (mode === 'analyzing') {
    return (
      <div className="scan-analyzing">
        <div className="analyzing-spinner" aria-label="Analyzing your meal">
          <div className="spinner-ring" />
          <span className="spinner-emoji animate-float">🤖</span>
        </div>
        <h2 className="analyzing-title">Analyzing your meal…</h2>
        <p className="analyzing-sub">AI is identifying nutrients and calories</p>
      </div>
    );
  }

  if (mode === 'result') {
    return (
      <div className="scan-result-page page-section">
        <button className="scan-back" onClick={() => setMode('idle')} aria-label="Back">← Back</button>
        <div className="result-card card card-padding animate-slide-up">
          <div className="result-header">
            <span className="result-emoji">{result.emoji}</span>
            <div>
              <h2 className="result-name">{result.name}</h2>
              <span className="result-serving">{result.servingSize}</span>
            </div>
            <div className="result-score" aria-label={`Health score ${result.healthScore}`}>
              <span className="score-num">{result.healthScore}</span>
              <span className="score-label">Health Score</span>
            </div>
          </div>

          <div className="result-calories">
            <span className="result-cal-num">{result.calories}</span>
            <span className="result-cal-label">kcal</span>
          </div>

          <div className="result-macros">
            {[
              { label: 'Protein', val: result.macros.protein, unit: 'g', color: '#42A5F5' },
              { label: 'Carbs', val: result.macros.carbs, unit: 'g', color: '#FFCA28' },
              { label: 'Fat', val: result.macros.fat, unit: 'g', color: '#FF7043' },
            ].map(m => (
              <div key={m.label} className="result-macro-chip" style={{ borderColor: m.color }}>
                <span className="result-macro-val" style={{ color: m.color }}>{m.val}{m.unit}</span>
                <span className="result-macro-label">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="result-tags">
            {result.tags.map(t => <span key={t} className="badge badge-green">{t}</span>)}
          </div>

          <div className="result-meal-select">
            <label className="form-label">Log as</label>
            <div className="meal-type-pills">
              {MEAL_TYPES.map(t => (
                <button key={t} className={`meal-type-pill${mealType === t ? ' active' : ''}`} onClick={() => setMealType(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {logged ? (
            <div className="result-logged animate-bounce-in">✅ Logged successfully!</div>
          ) : (
            <button className="btn btn-primary btn-full btn-lg" onClick={handleLog}>
              + Log This Meal
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="scan-page">
      <div className="scan-header page-section">
        <h1 className="scan-title">Scan & Log</h1>
        <p className="scan-sub">Snap a photo, describe your meal, or scan a barcode</p>
      </div>

      {mode === 'text' ? (
        <div className="scan-text-mode page-section animate-slide-up">
          <textarea className="scan-textarea form-input" placeholder="Describe your meal… e.g. 'Grilled chicken with rice and salad'" value={textInput}
            onChange={e => setTextInput(e.target.value)} rows={4} aria-label="Describe your meal" />
          <div className="scan-text-actions">
            <button className="btn btn-ghost" onClick={() => setMode('idle')}>Cancel</button>
            <button className="btn btn-primary" onClick={() => analyze(textInput)} disabled={!textInput.trim()}>
              🤖 Analyze
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="scan-camera-area" onClick={() => analyze()} role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && analyze()} aria-label="Tap to simulate camera scan">
            <div className="camera-frame">
              <div className="camera-corner tl" /><div className="camera-corner tr" />
              <div className="camera-corner bl" /><div className="camera-corner br" />
              <div className="camera-center">
                <span className="camera-icon">📸</span>
                <p className="camera-hint">Tap to scan your meal</p>
              </div>
            </div>
          </div>

          <div className="scan-options page-section">
            <button className="scan-option-btn" onClick={() => setMode('text')}>
              <span className="scan-opt-icon">✏️</span>
              <span className="scan-opt-label">Describe Meal</span>
            </button>
            <button className="scan-option-btn" onClick={() => analyze()}>
              <span className="scan-opt-icon">📊</span>
              <span className="scan-opt-label">Scan Barcode</span>
            </button>
            <button className="scan-option-btn" onClick={() => analyze()}>
              <span className="scan-opt-icon">🔍</span>
              <span className="scan-opt-label">Search Food</span>
            </button>
          </div>

          <div className="scan-recent page-section">
            <h2 className="section-title">Recent Foods</h2>
            <div className="recent-foods">
              {mockFoods.slice(0, 4).map(f => (
                <button key={f.id} className="recent-food-item card" onClick={() => { setResult(f); setMode('result'); }}>
                  <span className="recent-food-emoji">{f.emoji}</span>
                  <div className="recent-food-info">
                    <span className="recent-food-name">{f.name}</span>
                    <span className="recent-food-cal">{f.calories} kcal</span>
                  </div>
                  <span className="recent-food-score" style={{ color: f.healthScore >= 85 ? 'var(--primary)' : 'var(--secondary)' }}>
                    {f.healthScore}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
