import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer' }}>
      {/* SVG: Map pin with a civic pulse wave */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Pin body */}
        <path
          d="M16 3C10.5 3 6 7.5 6 13C6 20.5 16 29 16 29C16 29 26 20.5 26 13C26 7.5 21.5 3 16 3Z"
          fill="#1A3560"
          stroke="#1A3560"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Pulse wave (white) */}
        <path
          d="M10 13H12.5L14.5 10L16.5 16L18.5 13H22"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--color-navy, #1A3560)',
              letterSpacing: '-0.02em',
            }}
          >
            Civic<span style={{ color: 'var(--color-blue, #2563EB)' }}>Pulse</span>
          </span>
          <span
            style={{
              fontSize: '0.625rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.06em',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Community Platform
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
