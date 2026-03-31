import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockCommunityPosts } from '../../data/mockData';
import type { CommunityPost } from '../../types';
import './CommunityPage.css';

export function CommunityPage() {
  const { user } = useApp();
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [newCaption, setNewCaption] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
      : p
    ));
  };

  const handlePost = () => {
    if (!newCaption.trim()) return;
    const newPost: CommunityPost = {
      id: `p_${Date.now()}`,
      userId: user?.id ?? 'me',
      userName: user?.name ?? 'You',
      caption: newCaption,
      likes: 0,
      comments: 0,
      tags: [],
      timestamp: 'Just now',
      liked: false,
    };
    setPosts(prev => [newPost, ...prev]);
    setNewCaption('');
    setShowCompose(false);
  };

  return (
    <div className="community-page">
      <div className="community-header page-section">
        <h1 className="community-title">Community</h1>
        <button className="community-compose-btn" onClick={() => setShowCompose(s => !s)} aria-label="Share a meal">
          ✏️ Share
        </button>
      </div>

      {showCompose && (
        <div className="community-compose page-section animate-slide-up">
          <div className="compose-card card card-padding">
            <div className="compose-user">
              <div className="avatar" style={{ width: 36, height: 36, fontSize: 16 }}>{user?.name?.[0] ?? 'U'}</div>
              <span className="compose-name">{user?.name ?? 'You'}</span>
            </div>
            <textarea className="compose-textarea form-input" placeholder="Share your healthy meal or tip… 🥗"
              value={newCaption} onChange={e => setNewCaption(e.target.value)} rows={3} />
            <div className="compose-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCompose(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={handlePost} disabled={!newCaption.trim()}>Post</button>
            </div>
          </div>
        </div>
      )}

      <div className="community-feed page-section">
        {posts.map(post => (
          <article key={post.id} className="post-card card">
            <div className="post-header">
              <div className="post-avatar avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                {post.userName[0]}
              </div>
              <div className="post-user-info">
                <span className="post-username">{post.userName}</span>
                <span className="post-time">{post.timestamp}</span>
              </div>
            </div>

            <p className="post-caption">{post.caption}</p>

            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map(t => <span key={t} className="post-tag">#{t}</span>)}
              </div>
            )}

            <div className="post-actions">
              <button
                className={`post-action-btn${post.liked ? ' liked' : ''}`}
                onClick={() => toggleLike(post.id)}
                aria-label={post.liked ? 'Unlike' : 'Like'}
                aria-pressed={post.liked}
              >
                <span className="post-action-icon">{post.liked ? '❤️' : '🤍'}</span>
                <span>{post.likes}</span>
              </button>
              <button className="post-action-btn" aria-label="Comment">
                <span className="post-action-icon">💬</span>
                <span>{post.comments}</span>
              </button>
              <button className="post-action-btn" aria-label="Share">
                <span className="post-action-icon">↗️</span>
                <span>Share</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
