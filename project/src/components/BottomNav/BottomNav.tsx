import { useApp } from '../../context/AppContext';
import type { AppPage } from '../../types';
import './BottomNav.css';

interface NavItem {
  id: AppPage;
  label: string;
  icon: string;
  activeIcon: string;
  isFab?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',     label: 'Home',    icon: '🏠',  activeIcon: '🏡' },
  { id: 'insights', label: 'Insights',icon: '📊',  activeIcon: '📈' },
  { id: 'scan',     label: 'Scan',    icon: '📸',  activeIcon: '📸', isFab: true },
  { id: 'recipes',  label: 'Recipes', icon: '🍳',  activeIcon: '🍽️' },
  { id: 'profile',  label: 'Profile', icon: '👤',  activeIcon: '👤' },
];

export function BottomNav() {
  const { page, navigate } = useApp();

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item${item.isFab ? ' nav-item--fab' : ''}${page === item.id ? ' nav-item--active' : ''}`}
            onClick={() => navigate(item.id)}
            aria-label={item.label}
            aria-current={page === item.id ? 'page' : undefined}
            id={`nav-${item.id}`}
          >
            {item.isFab ? (
              <span className="nav-fab-btn" aria-hidden="true">
                <span className="nav-fab-icon">{item.icon}</span>
              </span>
            ) : (
              <>
                <span className="nav-icon" aria-hidden="true">
                  {page === item.id ? item.activeIcon : item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
                {page === item.id && <span className="nav-dot" aria-hidden="true" />}
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
