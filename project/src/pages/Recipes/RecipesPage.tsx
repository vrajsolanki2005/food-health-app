import { useState } from 'react';
import { mockRecipes } from '../../data/mockData';
import type { Recipe } from '../../types';
import './RecipesPage.css';

const FILTERS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Easy', 'High-Protein', 'Vegan'];

function HealthScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? '#4CAF50' : score >= 75 ? '#FFCA28' : '#FF7043';
  return (
    <div className="health-score-badge" style={{ background: color }} aria-label={`Health score ${score}`}>
      {score}
    </div>
  );
}

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <button className="recipe-card card" onClick={onClick} aria-label={`View ${recipe.name}`}>
      <div className="recipe-card-img">
        <span className="recipe-card-emoji">{recipe.emoji}</span>
        <HealthScoreBadge score={recipe.healthScore} />
      </div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-name">{recipe.name}</h3>
        <p className="recipe-card-desc">{recipe.description}</p>
        <div className="recipe-card-meta">
          <span>⏱ {recipe.prepTime + recipe.cookTime} min</span>
          <span>🔥 {recipe.calories} kcal</span>
          <span>⭐ {recipe.rating}</span>
        </div>
        <div className="recipe-card-tags">
          {recipe.tags.slice(0, 2).map(t => <span key={t} className="badge badge-green">{t}</span>)}
          <span className={`badge badge-${recipe.difficulty === 'easy' ? 'green' : recipe.difficulty === 'medium' ? 'yellow' : 'coral'}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </button>
  );
}

function RecipeDetail({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) {
  return (
    <div className="recipe-detail animate-slide-up">
      <div className="recipe-detail-hero">
        <span className="recipe-detail-emoji">{recipe.emoji}</span>
        <button className="recipe-detail-back" onClick={onBack} aria-label="Back to recipes">←</button>
        <HealthScoreBadge score={recipe.healthScore} />
      </div>

      <div className="recipe-detail-content page-section">
        <h1 className="recipe-detail-name">{recipe.name}</h1>
        <p className="recipe-detail-desc">{recipe.description}</p>

        <div className="recipe-detail-stats">
          <div className="recipe-stat"><span className="recipe-stat-val">{recipe.calories}</span><span className="recipe-stat-label">kcal</span></div>
          <div className="recipe-stat"><span className="recipe-stat-val">{recipe.macros.protein}g</span><span className="recipe-stat-label">Protein</span></div>
          <div className="recipe-stat"><span className="recipe-stat-val">{recipe.prepTime + recipe.cookTime}</span><span className="recipe-stat-label">min</span></div>
          <div className="recipe-stat"><span className="recipe-stat-val">{recipe.servings}</span><span className="recipe-stat-label">servings</span></div>
        </div>

        <div className="recipe-detail-tags">
          {recipe.tags.map(t => <span key={t} className="badge badge-green">{t}</span>)}
          {recipe.dietaryTags.map(t => <span key={t} className="badge badge-yellow">{t.replace('_', '-')}</span>)}
        </div>

        <h2 className="recipe-section-title">Ingredients</h2>
        <ul className="recipe-ingredients">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="recipe-ingredient">
              <span className="ingredient-dot" />
              <span className="ingredient-name">{ing.name}</span>
              <span className="ingredient-amount">{ing.amount}</span>
            </li>
          ))}
        </ul>

        <h2 className="recipe-section-title">Instructions</h2>
        <ol className="recipe-steps">
          {recipe.steps.map((step, i) => (
            <li key={i} className="recipe-step">
              <span className="step-num">{i + 1}</span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>

        <div className="recipe-rating">
          <span className="rating-stars">{'⭐'.repeat(Math.round(recipe.rating))}</span>
          <span className="rating-num">{recipe.rating}</span>
          <span className="rating-count">({recipe.reviewCount} reviews)</span>
        </div>
      </div>
    </div>
  );
}

export function RecipesPage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [search, setSearch] = useState('');

  if (selected) return <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />;

  const filtered = mockRecipes.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.tags.some(t => t.includes(search.toLowerCase()));
    const matchFilter = filter === 'All' || r.mealType.some(m => m === filter.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())) || r.difficulty === filter.toLowerCase() || r.dietaryTags.some(t => t.includes(filter.toLowerCase()));
    return matchSearch && matchFilter;
  });

  return (
    <div className="recipes-page">
      <div className="recipes-header page-section">
        <h1 className="recipes-title">Recipes</h1>
        <p className="recipes-sub">Discover healthy meals tailored for you</p>
        <div className="recipes-search">
          <span className="search-icon">🔍</span>
          <input className="search-input" type="search" placeholder="Search recipes…" value={search}
            onChange={e => setSearch(e.target.value)} aria-label="Search recipes" />
        </div>
      </div>

      <div className="recipes-filters scroll-x" role="group" aria-label="Recipe filters">
        <div className="recipes-filters-inner">
          {FILTERS.map(f => (
            <button key={f} className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="recipes-grid page-section">
        {filtered.length === 0 ? (
          <div className="recipes-empty">
            <span>🍽️</span>
            <p>No recipes found. Try a different filter.</p>
          </div>
        ) : (
          filtered.map(r => <RecipeCard key={r.id} recipe={r} onClick={() => setSelected(r)} />)
        )}
      </div>
    </div>
  );
}
