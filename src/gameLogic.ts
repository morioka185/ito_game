import type { GameState, Player, Theme } from './types';
import { THEMES } from './types';

// ランダムな数字を生成（1-100）
export function generateCardNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

// ランダムなテーマを選択
export function selectRandomTheme(): Theme {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

// プレイヤーにユニークなカード番号を配布
export function distributeCards(playerCount: number): number[] {
  const cards: number[] = [];
  while (cards.length < playerCount) {
    const num = generateCardNumber();
    if (!cards.includes(num)) {
      cards.push(num);
    }
  }
  return cards;
}

// 初期ゲーム状態を作成
export function createInitialGameState(): GameState {
  return {
    phase: 'title',
    players: [],
    currentTheme: THEMES[0],
    lives: 3,
    maxLives: 3,
    revealOrder: [],
    currentRevealIndex: 0,
    isSuccess: null,
  };
}

// プレイヤーを追加
export function addPlayers(
  state: GameState,
  playerNames: string[]
): GameState {
  const cards = distributeCards(playerNames.length);
  const players: Player[] = playerNames.map((name, index) => ({
    id: index,
    name,
    cardNumber: cards[index],
    hint: '',
    hasRevealed: false,
  }));

  return {
    ...state,
    players,
    currentTheme: selectRandomTheme(),
  };
}

// カードを公開する順番を確認
export function checkRevealOrder(
  state: GameState,
  playerId: number
): { success: boolean; state: GameState } {
  const sortedPlayers = [...state.players].sort(
    (a, b) => a.cardNumber - b.cardNumber
  );
  const expectedPlayerId = sortedPlayers[state.currentRevealIndex].id;

  if (playerId === expectedPlayerId) {
    // 正解
    const newPlayers = state.players.map((p) =>
      p.id === playerId ? { ...p, hasRevealed: true } : p
    );
    const newRevealOrder = [...state.revealOrder, playerId];
    const newRevealIndex = state.currentRevealIndex + 1;

    // 全員公開したかチェック
    const isComplete = newRevealIndex >= state.players.length;

    return {
      success: true,
      state: {
        ...state,
        players: newPlayers,
        revealOrder: newRevealOrder,
        currentRevealIndex: newRevealIndex,
        phase: isComplete ? 'result' : state.phase,
        isSuccess: isComplete ? true : state.isSuccess,
      },
    };
  } else {
    // 不正解
    const newLives = state.lives - 1;
    const newPlayers = state.players.map((p) =>
      p.id === playerId ? { ...p, hasRevealed: true } : p
    );
    const newRevealOrder = [...state.revealOrder, playerId];

    // ライフが0になったかチェック
    const isGameOver = newLives <= 0;

    return {
      success: false,
      state: {
        ...state,
        players: newPlayers,
        lives: newLives,
        revealOrder: newRevealOrder,
        phase: isGameOver ? 'result' : state.phase,
        isSuccess: isGameOver ? false : state.isSuccess,
      },
    };
  }
}

// ヒントを設定
export function setPlayerHint(
  state: GameState,
  playerId: number,
  hint: string
): GameState {
  const newPlayers = state.players.map((p) =>
    p.id === playerId ? { ...p, hint } : p
  );
  return {
    ...state,
    players: newPlayers,
  };
}

// 全員がヒントを入力したかチェック
export function allHintsEntered(state: GameState): boolean {
  return state.players.every((p) => p.hint.trim() !== '');
}

// ゲームをリセット
export function resetGame(state: GameState): GameState {
  const cards = distributeCards(state.players.length);
  const newPlayers: Player[] = state.players.map((p, index) => ({
    ...p,
    cardNumber: cards[index],
    hint: '',
    hasRevealed: false,
  }));

  return {
    ...state,
    players: newPlayers,
    currentTheme: selectRandomTheme(),
    lives: state.maxLives,
    revealOrder: [],
    currentRevealIndex: 0,
    isSuccess: null,
    phase: 'card-reveal',
  };
}
