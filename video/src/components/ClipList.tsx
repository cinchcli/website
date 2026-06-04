import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';
import { ClipRow } from './ClipRow';
import type { ClipData } from '../scene';

interface ClipListProps {
  width: number;
  newClip: ClipData;
  restingClips: ClipData[];
  newRowOpacity: number; // 0..1
  newRowShift: number; // px translateY (negative = from above)
  newRowHighlight: number; // 0..1
}

export const ClipList: React.FC<ClipListProps> = ({ width, newClip, restingClips, newRowOpacity, newRowShift, newRowHighlight }) => {
  return (
    <div style={{ width, background: theme.card, borderRight: `1px solid ${theme.border}`, height: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
          padding: '18px 22px 10px',
          fontFamily: MONO_FONT,
          fontSize: 15,
          fontWeight: 500,
          letterSpacing: '0.01em',
          color: theme.text3,
        }}
      >
        <span>Today</span>
        <span style={{ marginLeft: 'auto', fontSize: 14, color: theme.text3 }}>{restingClips.length + (newRowOpacity > 0.05 ? 1 : 0)}</span>
      </div>
      <div style={{ opacity: newRowOpacity, transform: `translateY(${newRowShift}px)` }}>
        <ClipRow clip={newClip} active highlight={newRowHighlight} />
      </div>
      {restingClips.map((c) => (
        <ClipRow key={`${c.machine}-${c.time}`} clip={c} />
      ))}
    </div>
  );
};
