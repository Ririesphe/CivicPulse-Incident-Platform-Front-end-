import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      {/* SVG representing: Map Pin (Location) + Mesh Nodes (Community Connection) + Pulse Wave (Action) */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Background pin glow */}
        <circle cx="16" cy="14" r="10" fill="var(--color-green-light)" opacity="0.15" />
        
        {/* Main Map Pin Border */}
        <path
          d="M16 3C10.5 3 6 7.5 6 13C6 20.5 16 29 16 29C16 29 26 20.5 26 13C26 7.5 21.5 3 16 3Z"
          stroke="var(--color-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulse Wave connecting central nodes */}
        <path
          d="M10 13H13L15 10L17 16L19 13H22"
          stroke="var(--color-terracotta)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Connective nodes (Community) */}
        <circle cx="10" cy="13" r="2" fill="var(--color-green)" />
        <circle cx="13" cy="13" r="1.5" fill="var(--color-gold)" />
        <circle cx="19" cy="13" r="1.5" fill="var(--color-gold)" />
        <circle cx="22" cy="13" r="2" fill="var(--color-green)" />
        <circle cx="16" cy="22" r="1.5" fill="var(--color-gold)" />
      </svg>

      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--color-charcoal)',
              letterSpacing: '-0.02em',
            }}
          >
            Civic<span style={{ color: 'var(--color-green)' }}>Pulse</span>
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.04em',
              fontWeight: 500,
              textTransform: 'uppercase',
            }}
          >
            Voices into Action
          </span>
        </div>
      )}
    </div>
  );
};
export default Logo;
