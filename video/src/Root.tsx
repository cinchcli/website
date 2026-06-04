import React from 'react';
import { Composition } from 'remotion';
import { WorksAnywhere } from './WorksAnywhere';
import { WIDTH, HEIGHT, FPS, DURATION_IN_FRAMES } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="WorksAnywhere"
      component={WorksAnywhere}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
