export const FPS = 30;
export const DURATION_IN_FRAMES = 210; // 7.00s
export const WIDTH = 1280;
export const HEIGHT = 800;

export interface Theme {
  bg: string;
  card: string;
  card2: string;
  terminalBg: string;
  border: string;
  text1: string;
  text2: string;
  text3: string;
  accent: string;
  accentMuted: string;
  accentSubtle: string;
  selected: string;
  accentPastel: string;
  semanticOk: string;
  dotR: string;
  dotY: string;
  dotG: string;
}

export const theme: Theme = {
  bg: '#050505',
  card: '#0e0f10',
  card2: '#161719',
  terminalBg: '#0e0f11',
  border: 'rgba(255,255,255,0.06)',
  text1: '#F0EBE0',
  text2: '#A1A1A1',
  text3: '#6B6B6B',
  accent: '#4FB3A9',
  accentMuted: '#3E928A',
  accentSubtle: 'rgba(79,179,169,0.1)',
  selected: 'rgba(79,179,169,0.20)',
  accentPastel: '#BED9D7',
  semanticOk: '#4ade80',
  dotR: '#ff5f57',
  dotY: '#febc2e',
  dotG: '#28c840',
};
