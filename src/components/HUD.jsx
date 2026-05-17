import React, { useEffect, useState } from 'react';
import { COLOR_THEMES } from '../utils/constants';

export default function HUD({ themeRef }) {
  const [snapshot, setSnapshot] = useState({
    themeIndex: 0,
    progress: 0,
    colors: COLOR_THEMES[0].colors,
  });

  useEffect(() => {
    let raf;
    function tick() {
      const t = themeRef?.current;
      if (t) {
        setSnapshot({
          themeIndex: t.themeIndex,
          progress: t.progress,
          // Use the already-lerped colors - exactly what the 3D scene renders
          colors: t.colors,
        });
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [themeRef]);

  const { themeIndex, progress, colors } = snapshot;
  const themeName = COLOR_THEMES[themeIndex].name;

  // All colors come from the blended palette — same source as the 3D scene
  const accentColor = colors[0];
  const accent2 = colors[1] ?? colors[0];

  // Theme name: fade in at start of cycle, fade out quickly, reappear near end
  const nameOpacity =
    progress < 0.15
      ? progress / 0.15
      : progress > 0.85
      ? (progress - 0.85) / 0.15
      : Math.max(0, 1 - (progress - 0.15) / 0.1);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        fontFamily: '"Courier New", monospace',
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)',
        }}
      />

      {/* CSS vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* Top — title + theme name + progress bar */}
      <div
        style={{
          position: 'absolute',
          top: '5%',
          left: 0,
          right: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {/* Title — color comes from blended palette, no CSS transition */}
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: 0.85,
            color: accentColor,
            textShadow: `0 0 12px ${accentColor}, 0 0 24px ${accentColor}`,
          }}
        >
          ◈ NEON CORRIDOR ◈
        </div>

        {/* Theme name — fades with progress */}
        <div
          style={{
            fontSize: '8px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: accent2,
            opacity: nameOpacity * 0.7,
          }}
        >
          [ {themeName} ]
        </div>

        {/* Progress bar — fills over the theme duration */}
        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden',
            opacity: 0.5,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress * 100}%`,
              background: accentColor,
              boxShadow: `0 0 4px ${accentColor}`,
            }}
          />
        </div>
      </div>

      {/* Bottom stats — pull from blended palette, no CSS transition */}
      <div
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '10%',
          right: '10%',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          opacity: 0.5,
        }}
      >
        {[
          { label: 'VELOCITY: ∞', color: colors[0] },
          { label: 'SECTOR: 7G', color: colors[1] ?? colors[0] },
          { label: 'STATUS: ONLINE', color: colors[2] ?? colors[0] },
        ].map(({ label, color }, i) => (
          <div
            key={i}
            style={{
              fontSize: '9px',
              letterSpacing: '0.25em',
              color,
              textShadow: `0 0 8px ${color}`,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Corner brackets — no CSS transition, color tracks lerped palette */}
      {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner) => (
        <div
          key={corner}
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            zIndex: 3,
            opacity: 0.7,
            ...(corner.includes('top') ? { top: '3%' } : { bottom: '3%' }),
            ...(corner.includes('Left') ? { left: '4%' } : { right: '4%' }),
            borderTop: corner.includes('top')
              ? `2px solid ${accentColor}`
              : 'none',
            borderBottom: corner.includes('bottom')
              ? `2px solid ${accentColor}`
              : 'none',
            borderLeft: corner.includes('Left')
              ? `2px solid ${accentColor}`
              : 'none',
            borderRight: corner.includes('Right')
              ? `2px solid ${accentColor}`
              : 'none',
            boxShadow: `0 0 8px ${accentColor}`,
          }}
        />
      ))}
    </div>
  );
}
