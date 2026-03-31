import { useApp } from '../../context/AppContext';
import { mockAchievements } from '../../data/mockData';
import './ProfilePage.css';

const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Lose Weight', gain_muscle: 'Gain Muscle', eat_healthier: 'Eat Healthier',
  manage_condition: 'Manage Condition', maintain_weight: 'Maintain Weight',
};

export function ProfilePage() {
  const { user, logout, navigate } = useApp();
  if (!user) return null;

  const earnedBadges = mockAchievements.filter(a => a.earned);
  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1);

  return (
    <div className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar avatar" style={{ width: 80, height: 80, fontSize: 32 }}>
            {user.name[0]}
          </div>
          <div className="profile-level-badge">Lv.{user.level}</div>
        </div>
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-email">{user.email}</p>
        <div className="profile-goal-chip">
          🎯 {GOAL_LABELS[user.goal] ?? user.goal}
        </div>
      </div>

      {/* Stats row */}
      <div className="page-section">
        <div className="profile-stats card card-padding">
          <div className="profile-stat">
            <span className="profile-stat-val">{user.currentStreak}</span>
            <span className="profile-stat-label">🔥 Streak</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-val">{user.totalPoints.toLocaleString()}</span>
            <span className="profile-stat-label">⭐ Points</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-val">{earnedBadges.length}</span>
            <span className="profile-stat-label">🏅 Badges</span>
          </div>
        </div>
      </div>

      {/* Health info */}
      <div className="page-section">
        <h2 className="section-title">Health Profile</h2>
        <div className="card card-padding health-info-grid">
          {[
            { label: 'Age', val: `${user.age} yrs` },
            { label: 'Height', val: `${user.height} cm` },
            { label: 'Weight', val: `${user.weight} kg` },
            { label: 'BMI', val: bmi },
            { label: 'BMR', val: `${user.bmr} kcal` },
            { label: 'TDEE', val: `${user.tdee} kcal` },
          ].map(item => (
            <div key={item.label} className="health-info-item">
              <span className="health-info-val">{item.val}</span>
              <span className="health-info-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily targets */}
      <div className="page-section">
        <h2 className="section-title">Daily Targets</h2>
        <div className="card card-padding">
          {[
            { label: 'Calories', val: `${user.dailyCalorieTarget} kcal`, color: 'var(--primary)' },
            { label: 'Protein', val: `${user.macroTargets.protein}g`, color: '#42A5F5' },
            { label: 'Carbs', val: `${user.macroTargets.carbs}g`, color: '#FFCA28' },
            { label: 'Fat', val: `${user.macroTargets.fat}g`, color: '#FF7043' },
          ].map(t => (
            <div key={t.label} className="target-row">
              <span className="target-label">{t.label}</span>
              <span className="target-val" style={{ color: t.color }}>{t.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="page-section">
        <h2 className="section-title">Badges Earned</h2>
        <div className="badges-grid">
          {earnedBadges.map(b => (
            <div key={b.id} className="badge-item card card-padding">
              <span className="badge-item-emoji">{b.emoji}</span>
              <span className="badge-item-title">{b.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="page-section">
        <h2 className="section-title">Preferences</h2>
        <div className="card">
          {[
            { icon: '🥗', label: 'Dietary Preferences', val: user.dietaryPrefs.length ? user.dietaryPrefs.join(', ').replace(/_/g, ' ') : 'None set' },
            { icon: '⚠️', label: 'Allergies', val: user.allergies.length ? user.allergies.join(', ') : 'None' },
            { icon: '🏃', label: 'Activity Level', val: user.activityLevel.replace('_', ' ') },
            { icon: '📏', label: 'Units', val: user.units === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lbs, ft)' },
          ].map(item => (
            <div key={item.label} className="pref-row">
              <span className="pref-icon">{item.icon}</span>
              <div className="pref-info">
                <span className="pref-label">{item.label}</span>
                <span className="pref-val">{item.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="page-section profile-actions">
        <button className="btn btn-outline btn-full" onClick={() => navigate('setup')}>
          ✏️ Edit Profile
        </button>
        <button className="btn btn-ghost btn-full profile-logout" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
