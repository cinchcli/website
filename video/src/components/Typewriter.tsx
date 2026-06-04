import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface TypewriterProps {
  text: string;
  startFrame: number;
  endFrame: number;
  caret?: boolean;
  style?: React.CSSProperties;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, startFrame, endFrame, caret = true, style }) => {
  const frame = useCurrentFrame();
  const count = Math.round(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const blinkOn = Math.floor(frame / 16) % 2 === 0;
  const showCaret = caret && frame >= startFrame;
  return (
    <span style={style}>
      {text.slice(0, count)}
      {showCaret ? (
        <span style={{ opacity: count < text.length ? 1 : blinkOn ? 1 : 0 }}>▋</span>
      ) : null}
    </span>
  );
};
