export interface ClipData {
  machine: string; // SourcePill label
  time: string; // e.g. "now", "2m"
  preview: string; // row preview text
}

export interface SceneData {
  terminalTitle: string;
  promptCommand: string; // text typed after the "$ "
  successLine: string; // e.g. "✓ sent · E2EE"
  restingClips: ClipData[];
  newClip: ClipData;
  tagline: string; // may contain "\n"
}

export const scene: SceneData = {
  terminalTitle: 'ssh prod-box — bash',
  promptCommand: 'tail -n 20 err.log | cinch send',
  successLine: '✓ sent · E2EE',
  restingClips: [
    { machine: 'macbook', time: '2m', preview: 'git diff --stat HEAD~1' },
    { machine: 'deploy-box', time: '14m', preview: 'postgres://stg-db.internal:5432/cinch?sslmode=require' },
  ],
  newClip: {
    machine: 'prod-box',
    time: 'now',
    preview: "panic: ttl in ms, not s — thread 'main' panicked at clips.rs:212",
  },
  tagline: 'Copied behind a firewall.\nAlready on your desktop.',
};

// Beat timing — frames at 30fps. Frame 0 and frame 209 must read as the same
// "resting" state for a seamless loop.
export const beats = {
  typeStart: 4,
  typeEnd: 42,
  successAt: 46,
  packetStart: 60,
  packetEnd: 108,
  rowSlideStart: 108,
  rowSlideEnd: 132,
  taglineIn: 132,
  resetStart: 198,
  end: 210,
} as const;
