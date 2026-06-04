import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { BODY_FONT } from '../fonts';
import { beats } from '../scene';

export const Tagline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [beats.taglineIn, beats.taglineIn + 14, beats.resetStart, beats.end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const rise = interpolate(frame, [beats.taglineIn, beats.taglineIn + 14], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${rise}px)`,
        fontFamily: BODY_FONT,
        fontWeight: 600,
        fontSize: 30,
        lineHeight: 1.3,
        color: theme.text1,
        textAlign: 'center',
        whiteSpace: 'pre-line',
        letterSpacing: '-0.01em',
      }}
    >
      {text}
    </div>
  );
};
