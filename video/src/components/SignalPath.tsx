import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../theme';
import { MONO_FONT } from '../fonts';
import { beats } from '../scene';

interface SignalPathProps {
  width: number; // horizontal span of the path
  height: number;
}

// A glowing accent packet travels left→right, crossing two faint boundary
// markers (VPN, firewall) and pulsing a small relay node on arrival.
export const SignalPath: React.FC<SignalPathProps> = ({ width, height }) => {
  const frame = useCurrentFrame();
  const midY = height / 2;
  const progress = interpolate(frame, [beats.packetStart, beats.packetEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = progress * width;
  const visible = frame >= beats.packetStart && frame <= beats.packetEnd + 6;
  const relayPulse = interpolate(frame, [beats.packetEnd - 8, beats.packetEnd, beats.packetEnd + 16], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const Boundary: React.FC<{ at: number; label: string }> = ({ at, label }) => (
    <>
      <div style={{ position: 'absolute', left: at, top: midY - 46, width: 1.5, height: 92, background: 'rgba(255,255,255,0.10)' }} />
      <span style={{ position: 'absolute', left: at - 22, top: midY + 52, fontFamily: MONO_FONT, fontSize: 13, letterSpacing: '0.08em', color: theme.text3, textTransform: 'uppercase' }}>
        {label}
      </span>
    </>
  );

  return (
    <div style={{ position: 'relative', width, height }}>
      {/* baseline route */}
      <div style={{ position: 'absolute', left: 0, top: midY, width, height: 1.5, background: 'rgba(255,255,255,0.06)' }} />
      <Boundary at={width * 0.3} label="VPN" />
      <Boundary at={width * 0.6} label="firewall" />
      {/* relay node */}
      <div
        style={{
          position: 'absolute',
          left: width - 16,
          top: midY - 16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: `1.5px solid ${theme.accent}`,
          background: `rgba(79,179,169,${0.12 + relayPulse * 0.5})`,
          boxShadow: `0 0 ${10 + relayPulse * 30}px rgba(79,179,169,${0.3 + relayPulse * 0.5})`,
        }}
      />
      <span style={{ position: 'absolute', left: width - 30, top: midY + 28, fontFamily: MONO_FONT, fontSize: 13, color: theme.text3 }}>relay</span>
      {/* the packet */}
      {visible ? (
        <div
          style={{
            position: 'absolute',
            left: x - 7,
            top: midY - 7,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: theme.accent,
            boxShadow: `0 0 22px 6px rgba(79,179,169,0.7)`,
          }}
        />
      ) : null}
    </div>
  );
};
