import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import '../../styles/onboarding.css';

const SLIDES = [
  { emoji: '📸', headline: 'Snap Your Meal', sub: 'Take a photo or describe what you ate — our AI instantly breaks down the nutrition for you.', bg: 'linear-gradient(135deg,#E8F5E9 0%,#F1F8E9 100%)' },
  { emoji: '✨', headline: 'Get Instant Insights', sub: 'See calories, macros, vitamins and minerals laid out in a beautiful, easy-to-understand dashboard.', bg: 'linear-gradient(135deg,#E3F2FD 0%,#E8F5E9 100%)' },
  { emoji: '🔥', headline: 'Build Lasting Habits', sub: 'Stay motivated with streaks, achievements, and gentle nudges that celebrate progress — not perfection.', bg: 'linear-gradient(135deg,#FFF9C4 0%,#FFE0B2 100%)' },
];

export function OnboardingPage() {
  const { navigate } = useApp();
  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);

  const goTo = (i: number) => {
    if (i === current) return;
    setExiting(true);
    setTimeout(() => { setCurrent(i); setExiting(false); }, 280);
  };

  const next = () => {
    if (current < SLIDES.length - 1) goTo(current + 1);
    else navigate('auth');
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-bg" style={{ background: SLIDES[current].bg, transition: 'background 0.5s ease', position: 'absolute', inset: 0, zIndex: 0 }} />
      <div className="onboarding-slides" style={{ zIndex: 1 }}>
        {SLIDES.map((s, i) => (
          <div key={i} className={`onboarding-slide${i === current && !exiting ? ' active' : ''}${i === current && exiting ? ' exit' : ''}`}>
            <div className="slide-illustration animate-float"><span>{s.emoji}</span></div>
            <h1 className="slide-headline">{s.headline}</h1>
            <p className="slide-sub">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="onboarding-footer" style={{ zIndex: 1 }}>
        <div className="dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={`dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
        <button className="btn btn-primary btn-lg" onClick={next} id="onboarding-next-btn" style={{ width: '100%', maxWidth: 320 }}>
          {current === SLIDES.length - 1 ? '🚀 Get Started' : 'Next  →'}
        </button>
        {current < SLIDES.length - 1 && (
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('auth')} id="onboarding-skip-btn">Skip</button>
        )}
      </div>
    </div>
  );
}
