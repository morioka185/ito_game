// 糸通し（ito）ゲームの型定義

export interface Player {
  id: number;
  name: string;
  cardNumber: number;
  hint: string;
  hasRevealed: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentTheme: Theme;
  lives: number;
  maxLives: number;
  revealOrder: number[];
  currentRevealIndex: number;
  isSuccess: boolean | null;
}

export type GamePhase =
  | 'title'
  | 'setup'
  | 'card-reveal'
  | 'hint-input'
  | 'play'
  | 'result';

export interface Theme {
  id: number;
  title: string;
  lowDescription: string;
  highDescription: string;
}

// お題リスト
export const THEMES: Theme[] = [
  { id: 1, title: '温度', lowDescription: '冷たい', highDescription: '熱い' },
  { id: 2, title: '速さ', lowDescription: '遅い', highDescription: '速い' },
  { id: 3, title: '大きさ', lowDescription: '小さい', highDescription: '大きい' },
  { id: 4, title: '値段', lowDescription: '安い', highDescription: '高い' },
  { id: 5, title: '人気', lowDescription: '不人気', highDescription: '大人気' },
  { id: 6, title: '怖さ', lowDescription: '怖くない', highDescription: '怖い' },
  { id: 7, title: '美味しさ', lowDescription: 'まずい', highDescription: '美味しい' },
  { id: 8, title: '危険度', lowDescription: '安全', highDescription: '危険' },
  { id: 9, title: '硬さ', lowDescription: '柔らかい', highDescription: '硬い' },
  { id: 10, title: '重さ', lowDescription: '軽い', highDescription: '重い' },
  { id: 11, title: '明るさ', lowDescription: '暗い', highDescription: '明るい' },
  { id: 12, title: '音量', lowDescription: '静か', highDescription: 'うるさい' },
  { id: 13, title: '年齢', lowDescription: '若い', highDescription: '年配' },
  { id: 14, title: '長さ', lowDescription: '短い', highDescription: '長い' },
  { id: 15, title: '知名度', lowDescription: '無名', highDescription: '有名' },
  { id: 16, title: '匂いの強さ', lowDescription: '無臭', highDescription: '強烈' },
  { id: 17, title: '甘さ', lowDescription: '甘くない', highDescription: 'とても甘い' },
  { id: 18, title: '辛さ', lowDescription: '辛くない', highDescription: 'とても辛い' },
  { id: 19, title: '深さ', lowDescription: '浅い', highDescription: '深い' },
  { id: 20, title: 'ファンタジー度', lowDescription: '現実的', highDescription: 'ファンタジー' },
];
