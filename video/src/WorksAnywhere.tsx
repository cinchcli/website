import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { theme } from './theme';
import { scene, beats } from './scene';
import { MONO_FONT } from './fonts';
import { TerminalWindow } from './components/TerminalWindow';
import { Typewriter } from './components/Typewriter';
import { DesktopWindow } from './components/DesktopWindow';
import { SignalPath } from './components/SignalPath';
import { Tagline } from './components/Tagline';

export const WorksAnywhere: React.FC = () => {
  const frame = useCurrentFrame();

  // Success line fades in after the command is typed; fades out on reset.
  const successOpacity = interpolate(
    frame,
    [beats.successAt, beats.successAt + 8, beats.resetStart, beats.end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Command fades out on reset so the last frame ≈ frame 0 (empty terminal).
  const commandOpacity = interpolate(frame, [beats.resetStart, beats.end], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // New clip row: slide in (from above) + fade in, then fade out on reset.
  const newRowOpacity = interpolate(
    frame,
    [beats.rowSlideStart, beats.rowSlideEnd, beats.resetStart, beats.end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const newRowShift = interpolate(frame, [beats.rowSlideStart, beats.rowSlideEnd], [-26, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const newRowHighlight = interpolate(frame, [beats.rowSlideEnd, beats.rowSlideEnd + 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {/* Source terminal (left) */}
      <div style={{ position: 'absolute', left: 64, top: 256 }}>
        <TerminalWindow title={scene.terminalTitle} width={480} height={290}>
          <div style={{ opacity: commandOpacity }}>
            <span style={{ color: theme.accent }}>$ </span>
            <Typewriter text={scene.promptCommand} startFrame={beats.typeStart} endFrame={beats.typeEnd} />
          </div>
          <div style={{ color: theme.semanticOk, opacity: successOpacity, marginTop: 6 }}>{scene.successLine}</div>
        </TerminalWindow>
      </div>

      {/* Signal path (center) */}
      <div style={{ position: 'absolute', left: 556, top: 300 }}>
        <SignalPath width={120} height={200} />
      </div>

      {/* Desktop window (right, hero) */}
      <div style={{ position: 'absolute', right: 56, top: 120 }}>
        <DesktopWindow
          width={520}
          height={564}
          newClip={scene.newClip}
          restingClips={scene.restingClips}
          newRowOpacity={newRowOpacity}
          newRowShift={newRowShift}
          newRowHighlight={newRowHighlight}
        />
      </div>

      {/* Tagline (bottom center) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', fontFamily: MONO_FONT }}>
        <Tagline text={scene.tagline} />
      </div>
    </AbsoluteFill>
  );
};
