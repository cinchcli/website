import React from 'react';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';

interface TerminalWindowProps {
  title: string;
  width: number;
  height: number;
  children: React.ReactNode;
}

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ width: 11, height: 11, borderRadius: '50%', background: color, display: 'inline-block' }} />
);

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, width, height, children }) => {
  return (
    <div
      style={{
        width,
        height,
        background: theme.terminalBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 24px 56px -12px rgba(0,0,0,0.45)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '12px 18px',
          background: 'rgba(255,255,255,0.025)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Dot color={theme.dotR} />
        <Dot color={theme.dotY} />
        <Dot color={theme.dotG} />
        <span style={{ marginLeft: 'auto', fontFamily: MONO_FONT, fontSize: 16, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>
          {title}
        </span>
      </div>
      <div
        style={{
          padding: '30px 34px',
          fontFamily: MONO_FONT,
          fontSize: 19,
          lineHeight: 1.85,
          color: 'rgba(255,255,255,0.75)',
          flex: 1,
          fontVariantLigatures: 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};
