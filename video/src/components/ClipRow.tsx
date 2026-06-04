import React from 'react';
import { theme } from '../theme';
import { BODY_FONT, MONO_FONT } from '../fonts';
import { SourcePill } from './SourcePill';
import type { ClipData } from '../scene';

interface ClipRowProps {
  clip: ClipData;
  active?: boolean; // new/highlighted row
  highlight?: number; // 0..1 extra pulse strength
}

export const ClipRow: React.FC<ClipRowProps> = ({ clip, active = false, highlight = 0 }) => {
  const baseBg = active ? theme.accentSubtle : 'transparent';
  // Brief brighter flash when the row arrives, decaying to the resting active tint.
  const bg = active
    ? `color-mix(in srgb, ${theme.selected} ${Math.round(highlight * 100)}%, ${theme.accentSubtle})`
    : baseBg;
  return (
    <div
      style={{
        position: 'relative',
        padding: '16px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        borderBottom: `1px solid ${theme.border}`,
        background: bg,
        boxShadow: active ? `inset 3px 0 0 ${theme.accent}` : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 15, fontFamily: MONO_FONT, letterSpacing: '0.04em', color: theme.text3 }}>
        <SourcePill machine={clip.machine} />
        <span style={{ color: theme.text3 }}>·</span>
        <span>{clip.time}</span>
      </div>
      <div
        style={{
          fontSize: 19,
          fontFamily: BODY_FONT,
          color: theme.text1,
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
        }}
      >
        {clip.preview}
      </div>
    </div>
  );
};
