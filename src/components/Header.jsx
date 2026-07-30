import React, { useState } from 'react';

export default function Header({ activeView, onViewChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (view) => {
    onViewChange(view);
    closeMobileMenu();
  };

  return (
    <header>
      <div className="brand" onClick={() => handleNavClick('home')}>
        <h1 className="brand-title">WildSketch</h1><span className="brand-subtitle">動物速寫室</span>
      </div>
      <button
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="切換選單"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
      <nav className={mobileMenuOpen ? 'mobile-nav-active' : ''} style={{ alignItems: 'center' }}>
        <button
          className={`nav-btn ${activeView === 'home' || activeView === 'detail' ? 'active' : ''}`}
          onClick={() => handleNavClick('home')}
        >
          首頁
        </button>
        <button
          className={`nav-btn ${activeView === 'announcements' ? 'active' : ''}`}
          onClick={() => handleNavClick('announcements')}
        >
          公告
        </button>
        <button
          className={`nav-btn ${activeView === 'articles' ? 'active' : ''}`}
          onClick={() => handleNavClick('articles')}
        >
          專題文章
        </button>
        {/*<a
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="nav-btn feedback-btn"
          id="nav-submission"
          onClick={closeMobileMenu}
        >
          素材提供 ↗
        </a>*/}
        <a
          href="https://forms.gle/T8M8wAvCmDeG35j1A"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-btn feedback-btn"
          onClick={closeMobileMenu}
        >
          意見回饋 ↗
        </a>
      </nav>
    </header>
  );
}
