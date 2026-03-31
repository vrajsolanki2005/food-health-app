import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { useApp } from '../../context/AppContext';
import { mockWeeklyData, mockAchievements } from '../../data/mockData';
import './InsightsPage.css';

type Tab = 'daily' | 'weekly' | 'achievements';

export function InsightsPage() {
  const { user, dailyLog } = useApp();
  const [tab, setTab] = useState<Tab>('daily');

  const target = user?.dailyCalorieTarget ?? 1900;
  const macroTargets = user?.macroTargets ?? { protein: 95, carbs: 237, fat: 63 };

  const dailyMacros = [
    { name: 'Protein', value: dailyLog.totalMacros.protein, target: macroTargets.protein, color: '#42A5F5', unit: 'g' },
    { name: 'Carbs', value: dailyLog.totalMacros.carbs, target: macroTargets.carbs, color: '#FFCA28', unit: 'g' },
    { name: 'Fat', value: dailyLog.totalMacros.fat, target: macroTargets.fat, color: '#FF7043', unit: 'g' },
  ];

  const weekAvg = Math.round(mockWeeklyData.reduce((s, d) => s + d.calories, 0) / mockWeeklyData.length);

  return (
    <div className="insights-page">
      <div className="insights-header page-section">
        <h1 className="insights-title">Insights</h1>
        <p className="insights-sub">Track your nutrition progress</p>
      </div>

      <div className="insights-tabs page-section">
        {(['daily', 'weekly', 'achievements'] as Tab[]).map(t => (
          <button key={t} className={`insights-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'daily' && (
        <div className="insights-content animate-fade-in">
          {/* Calorie summary */}
          <div className="page-section">
            <div className="card card-padding">
              <h2 className="section-title">Today's Calories</h2>
              <div className="calorie-summary">
                <div className="cal-stat">
                  <span className="cal-stat-num" style={{ color: 'var(--primary)' }}>{dailyLog.totalCalories}</span>
                  <span className="cal-stat-label">Consumed</span>
                </div>
                <div className="cal-divider" />
                <div className="cal-stat">
                  <span className="cal-stat-num">{target}</span>
                  <span className="cal-stat-label">Target</span>
                </div>
                <div className="cal-divider" />
                <div className="cal-stat">
                  <span className="cal-stat-num" style={{ color: 'var(--secondary)' }}>{Math.max(0, target - dailyLog.totalCalories)}</span>
                  <span className="cal-stat-label">Remaining</span>
                </div>
              </div>
              <div className="progress-bar" style={{ marginTop: 8, height: 12 }}>
                <div className="progress-bar-fill" style={{ width: `${Math.min((dailyLog.totalCalories / target) * 100, 100)}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))' }} />
              </div>
            </div>
          </div>

          {/* Macros */}
          <div className="page-section">
            <h2 className="section-title">Macronutrients</h2>
            <div className="macro-cards">
              {dailyMacros.map(m => (
                <div key={m.name} className="macro-detail-card card card-padding">
                  <div className="macro-detail-header">
                    <span className="macro-detail-name">{m.name}</span>
                    <span className="macro-detail-pct" style={{ color: m.color }}>
                      {Math.round((m.value / m.target) * 100)}%
                    </span>
                  </div>
                  <div className="macro-detail-nums">
                    <span className="macro-detail-val" style={{ color: m.color }}>{m.value}{m.unit}</span>
                    <span className="macro-detail-target">/ {m.target}{m.unit}</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <div className="progress-bar-fill" style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meal breakdown */}
          <div className="page-section">
            <h2 className="section-title">Meal Breakdown</h2>
            <div className="card card-padding">
              {dailyLog.meals.map(meal => (
                <div key={meal.id} className="meal-breakdown-row">
                  <span className="meal-breakdown-type">{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</span>
                  <div className="meal-breakdown-bar-wrap">
                    <div className="meal-breakdown-bar" style={{ width: `${(meal.totalCalories / target) * 100}%` }} />
                  </div>
                  <span className="meal-breakdown-cal">{meal.totalCalories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'weekly' && (
        <div className="insights-content animate-fade-in">
          <div className="page-section">
            <div className="card card-padding">
              <div className="weekly-stats-row">
                <div className="weekly-stat">
                  <span className="weekly-stat-num">{weekAvg}</span>
                  <span className="weekly-stat-label">Avg kcal/day</span>
                </div>
                <div className="weekly-stat">
                  <span className="weekly-stat-num" style={{ color: 'var(--primary)' }}>{mockWeeklyData.filter(d => d.logged).length}</span>
                  <span className="weekly-stat-label">Days logged</span>
                </div>
                <div className="weekly-stat">
                  <span className="weekly-stat-num" style={{ color: 'var(--accent-yellow)' }}>{user?.currentStreak ?? 0}🔥</span>
                  <span className="weekly-stat-label">Streak</span>
                </div>
              </div>
            </div>
          </div>

          <div className="page-section">
            <h2 className="section-title">Calories This Week</h2>
            <div className="card card-padding">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockWeeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-md)', fontSize: 13 }} />
                  <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
                    {mockWeeklyData.map((d, i) => (
                      <Cell key={i} fill={d.calories <= d.target ? '#4CAF50' : '#FF7043'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span className="legend-dot" style={{ background: '#4CAF50' }} /> On target
                <span className="legend-dot" style={{ background: '#FF7043', marginLeft: 12 }} /> Over target
              </div>
            </div>
          </div>

          <div className="page-section">
            <h2 className="section-title">Calorie Trend</h2>
            <div className="card card-padding">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={mockWeeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-md)', fontSize: 13 }} />
                  <Line type="monotone" dataKey="calories" stroke="#4CAF50" strokeWidth={2.5} dot={{ fill: '#4CAF50', r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="#FFD54F" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'achievements' && (
        <div className="insights-content animate-fade-in">
          <div className="page-section">
            <div className="achievements-summary card card-padding">
              <span className="ach-summary-emoji">🏆</span>
              <div>
                <p className="ach-summary-title">Level {user?.level ?? 1} — {user?.totalPoints?.toLocaleString() ?? 0} pts</p>
                <p className="ach-summary-sub">{mockAchievements.filter(a => a.earned).length} / {mockAchievements.length} badges earned</p>
              </div>
            </div>
          </div>
          <div className="page-section">
            <div className="achievements-grid">
              {mockAchievements.map(a => (
                <div key={a.id} className={`achievement-card card card-padding${a.earned ? ' earned' : ''}`}>
                  <span className="ach-emoji" style={{ filter: a.earned ? 'none' : 'grayscale(1) opacity(0.4)' }}>{a.emoji}</span>
                  <div className="ach-info">
                    <span className="ach-title">{a.title}</span>
                    <span className="ach-desc">{a.description}</span>
                    {!a.earned && a.progress !== undefined && (
                      <div className="ach-progress">
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-bar-fill" style={{ width: `${(a.progress / (a.maxProgress ?? 1)) * 100}%`, background: 'var(--primary)' }} />
                        </div>
                        <span className="ach-progress-label">{a.progress}/{a.maxProgress}</span>
                      </div>
                    )}
                  </div>
                  {a.earned && <span className="ach-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
