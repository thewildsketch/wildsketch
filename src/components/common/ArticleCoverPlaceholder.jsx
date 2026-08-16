import React from 'react';

export default function ArticleCoverPlaceholder({ articleId }) {
  const patternId = `dotPattern-${articleId || 'default'}`;

  return (
    <div className="article-card-cover article-card-cover-placeholder" data-testid="article-cover-placeholder">
      <svg
        viewBox="0 0 360 200"
        width="100%"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Warm Paper Background */}
        <rect width="360" height="200" fill="#FAF7F2" />
        <defs>
          <pattern id={patternId} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="1" fill="#E2DCD2" />
          </pattern>
        </defs>
        <rect width="360" height="200" fill={`url(#${patternId})`} opacity="0.8" />

        {/* Brand Logo Typography */}
        {/* WildSketch */}
        <text
          x="180"
          y="86"
          fontFamily="'Cinzel Decorative', 'Cinzel', Georgia, 'Times New Roman', serif"
          fontSize="28"
          fontWeight="700"
          fill="#1E1B18"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          WildSketch
        </text>

        {/* Terracotta Arch Underline (Consistent with Header border-radius: 50%/8px 8px 0 0) */}
        <path d="M 98,98 Q 180,92 262,98 L 98,98 Z" fill="#C26A38" opacity="0.85" />

        {/* Subtitle */}
        <text
          x="180"
          y="126"
          fontFamily="'Noto Serif TC', 'Songti TC', Georgia, serif"
          fontSize="16"
          fontWeight="700"
          fill="#1E1B18"
          textAnchor="middle"
          letterSpacing="2"
        >
          動物速寫室
        </text>

        {/* Topic Badge */}
        <text
          x="180"
          y="156"
          fontFamily="'Patrick Hand', 'Kalam', 'Segoe UI', cursive, sans-serif"
          fontSize="12.5"
          fontWeight="600"
          fill="#9C9289"
          textAnchor="middle"
          letterSpacing="2"
        >
          ✦ 專題文章 ✦
        </text>
      </svg>
    </div>
  );
}
