import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';

// Per-machine tint. Local-ish machines read muted; the hero "prod-box" reads in
// the porcelain accent so the eye lands on the new remote clip.
const TINTS: Record<string, { bg: string; fg: string }> = {
  'prod-box': { bg: 'rgba(79,179,169,0.18)', fg: theme.accentPastel },
  macbook: { bg: 'rgba(255,255,255,0.06)', fg: theme.text2 },
  'deploy-box': { bg: 'rgba(190,217,215,0.10)', fg: '#9db8b5' },
};

export const SourcePill: React.FC<{ machine: string }> = ({ machine }) => {
  const tint = TINTS[machine] ?? { bg: 'rgba(255,255,255,0.06)', fg: theme.text2 };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: tint.bg,
        color: tint.fg,
        fontSize: 15,
        fontFamily: MONO_FONT,
        letterSpacing: '0.04em',
        padding: '2px 11px',
        borderRadius: 999,
        whiteSpace: 'nowrap',
      }}
    >
      {machine}
    </span>
  );
};
