import React from 'react';
import { theme } from '../theme';

// Minimal left icon rail — three rounded glyphs, the top one active (accent).
const RailIcon: React.FC<{ active?: boolean }> = ({ active = false }) => (
  <div
    style={{
      width: 34,
      height: 34,
      borderRadius: 9,
      background: active ? theme.accentSubtle : 'transparent',
      border: `1.5px solid ${active ? theme.accent : 'rgba(255,255,255,0.14)'}`,
    }}
  />
);

export const Rail: React.FC<{ width: number }> = ({ width }) => (
  <div
    style={{
      width,
      height: '100%',
      background: theme.bg,
      borderRight: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      padding: '20px 0',
    }}
  >
    <RailIcon active />
    <RailIcon />
    <RailIcon />
  </div>
);
