import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';
import { Rail } from './Rail';
import { ClipList } from './ClipList';
import type { ClipData } from '../scene';

interface DesktopWindowProps {
  width: number;
  height: number;
  newClip: ClipData;
  restingClips: ClipData[];
  newRowOpacity: number;
  newRowShift: number;
  newRowHighlight: number;
}

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ width: 11, height: 11, borderRadius: '50%', background: color, display: 'inline-block' }} />
);

export const DesktopWindow: React.FC<DesktopWindowProps> = ({ width, height, newClip, restingClips, newRowOpacity, newRowShift, newRowHighlight }) => {
  const railW = 56;
  const listW = 360;
  return (
    <div
      style={{
        width,
        height,
        background: theme.card,
        border: `1px solid rgba(255,255,255,0.10)`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 30px 70px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 18px', borderBottom: `1px solid ${theme.border}`, background: 'rgba(255,255,255,0.02)' }}>
        <Dot color={theme.dotR} />
        <Dot color={theme.dotY} />
        <Dot color={theme.dotG} />
        <span style={{ marginLeft: 'auto', fontFamily: MONO_FONT, fontSize: 15, color: theme.text3, letterSpacing: '0.04em' }}>cinch</span>
      </div>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Rail width={railW} />
        <ClipList
          width={listW}
          newClip={newClip}
          restingClips={restingClips}
          newRowOpacity={newRowOpacity}
          newRowShift={newRowShift}
          newRowHighlight={newRowHighlight}
        />
        <div style={{ flex: 1, background: theme.bg }} />
      </div>
    </div>
  );
};
