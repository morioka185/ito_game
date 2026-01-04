import { useState } from 'react';
import type { Player, Theme } from '../types';

interface CardRevealScreenProps {
  players: Player[];
  theme: Theme;
  onAllCardsRevealed: () => void;
}

export function CardRevealScreen({
  players,
  theme,
  onAllCardsRevealed,
}: CardRevealScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [revealedPlayers, setRevealedPlayers] = useState<Set<number>>(
    new Set()
  );

  const currentPlayer = players[currentPlayerIndex];

  const handleShowCard = () => {
    setShowCard(true);
  };

  const handleHideCard = () => {
    setShowCard(false);
    const newRevealed = new Set(revealedPlayers);
    newRevealed.add(currentPlayerIndex);
    setRevealedPlayers(newRevealed);

    if (newRevealed.size === players.length) {
      // 全員確認完了
      onAllCardsRevealed();
    } else {
      // 次のプレイヤーへ
      let nextIndex = (currentPlayerIndex + 1) % players.length;
      while (newRevealed.has(nextIndex)) {
        nextIndex = (nextIndex + 1) % players.length;
      }
      setCurrentPlayerIndex(nextIndex);
    }
  };

  return (
    <div className="screen card-reveal-screen">
      <div className="theme-display">
        <div className="theme-label">今回のお題</div>
        <div className="theme-title">{theme.title}</div>
        <div className="theme-scale">
          <span className="scale-low">1: {theme.lowDescription}</span>
          <span className="scale-arrow">→</span>
          <span className="scale-high">100: {theme.highDescription}</span>
        </div>
      </div>

      <div className="progress-indicator">
        {players.map((_, index) => (
          <span
            key={index}
            className={`progress-dot ${revealedPlayers.has(index) ? 'done' : ''} ${
              index === currentPlayerIndex ? 'current' : ''
            }`}
          />
        ))}
      </div>

      <div className="card-reveal-content">
        <h3 className="player-turn">{currentPlayer.name}の番</h3>

        {!showCard ? (
          <>
            <p className="instruction">
              他のプレイヤーに見えないようにしてください
            </p>
            <button className="btn btn-primary btn-large" onClick={handleShowCard}>
              カードを見る
            </button>
          </>
        ) : (
          <>
            <div className="card-display">
              <div className="card">
                <span className="card-number">{currentPlayer.cardNumber}</span>
              </div>
            </div>
            <p className="instruction">この数字を覚えてください</p>
            <button className="btn btn-secondary btn-large" onClick={handleHideCard}>
              確認完了
            </button>
          </>
        )}
      </div>
    </div>
  );
}
