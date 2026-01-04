import type { Player, Theme } from '../types';

interface PlayScreenProps {
  players: Player[];
  theme: Theme;
  lives: number;
  maxLives: number;
  revealOrder: number[];
  onRevealCard: (playerId: number) => void;
  lastRevealResult: { playerId: number; success: boolean } | null;
}

export function PlayScreen({
  players,
  theme,
  lives,
  maxLives,
  revealOrder,
  onRevealCard,
  lastRevealResult,
}: PlayScreenProps) {
  const unrevealedPlayers = players.filter((p) => !p.hasRevealed);
  const revealedPlayers = revealOrder.map((id) =>
    players.find((p) => p.id === id)!
  );

  return (
    <div className="screen play-screen">
      <div className="play-header">
        <div className="theme-display compact">
          <div className="theme-title">{theme.title}</div>
          <div className="theme-scale">
            <span className="scale-low">1: {theme.lowDescription}</span>
            <span className="scale-high">100: {theme.highDescription}</span>
          </div>
        </div>

        <div className="lives-display">
          {Array.from({ length: maxLives }).map((_, i) => (
            <span
              key={i}
              className={`life-heart ${i < lives ? 'active' : 'lost'}`}
            >
              ♥
            </span>
          ))}
        </div>
      </div>

      {lastRevealResult && (
        <div
          className={`reveal-result ${lastRevealResult.success ? 'success' : 'fail'}`}
        >
          {lastRevealResult.success ? '正解！' : '残念！順番が違います'}
        </div>
      )}

      {revealedPlayers.length > 0 && (
        <div className="revealed-section">
          <h4>公開済みカード</h4>
          <div className="revealed-cards">
            {revealedPlayers.map((player, index) => (
              <div key={player.id} className="revealed-card-item">
                <span className="reveal-order">{index + 1}</span>
                <div className="revealed-card">
                  <span className="card-number">{player.cardNumber}</span>
                </div>
                <span className="player-name">{player.name}</span>
                <span className="player-hint">「{player.hint}」</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="unrevealed-section">
        <h4>
          次に出すカードを選んでください
          <span className="instruction-sub">（数字が小さい順）</span>
        </h4>
        <div className="hint-list">
          {unrevealedPlayers.map((player) => (
            <button
              key={player.id}
              className="hint-card"
              onClick={() => onRevealCard(player.id)}
            >
              <span className="player-name">{player.name}</span>
              <span className="player-hint">「{player.hint}」</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
