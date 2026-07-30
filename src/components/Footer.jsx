import React from 'react';

export default function Footer() {
  return (
    <footer>
      <p className="footer-copyright">
        © 2026 WildSketch 動物速寫室
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
          <a
            href="mailto:thewildsketch@gmail.com"
            className="footer-social-link"
            title="電子郵件聯絡 (thewildsketch@gmail.com)"
            data-testid="email-link"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </a>
          {/* TODO: Instagram 帳號
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            title="Instagram 官方帳號"
            data-testid="instagram-link"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>*/}
        </span>
      </p>
      <p className="footer-disclaimer">部分骨架圖由 AI 輔助生成，經人工審閱，內容僅供速寫與藝術參考用途 · <a href="https://github.com/thewildsketch/wildsketch#license" target="_blank" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>授權聲明</a></p>
    </footer>
  );
}
