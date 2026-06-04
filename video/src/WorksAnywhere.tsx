import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from './theme';
import { scene } from './scene';
import { TerminalWindow } from './components/TerminalWindow';
import { Typewriter } from './components/Typewriter';
import { MONO_FONT } from './fonts';

export const WorksAnywhere: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <div style={{ position: 'absolute', left: 70, top: 250, fontFamily: MONO_FONT }}>
        <TerminalWindow title={scene.terminalTitle} width={440} height={300}>
          <div>
            <span style={{ color: theme.accent }}>$ </span>
            <Typewriter text={scene.promptCommand} startFrame={4} endFrame={42} />
          </div>
          <div style={{ color: theme.semanticOk }}>{scene.successLine}</div>
        </TerminalWindow>
      </div>
    </AbsoluteFill>
  );
};
