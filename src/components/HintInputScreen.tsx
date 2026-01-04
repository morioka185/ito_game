import { useState } from 'react';
import type { Player, Theme } from '../types';

interface HintInputScreenProps {
  players: Player[];
  theme: Theme;
  onHintSubmit: (playerId: number, hint: string) => void;
  onAllHintsSubmitted: () => void;
}

export function HintInputScreen({
  players,
  theme,
  onHintSubmit,
  onAllHintsSubmitted,
}: HintInputScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [hint, setHint] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [submittedPlayers, setSubmittedPlayers] = useState<Set<number>>(
    new Set()
  );

  const currentPlayer = players[currentPlayerIndex];

  const handleSubmitHint = () => {
    if (!hint.trim()) return;

    onHintSubmit(currentPlayer.id, hint.trim());
    const newSubmitted = new Set(submittedPlayers);
    newSubmitted.add(currentPlayerIndex);
    setSubmittedPlayers(newSubmitted);
    setHint('');
    setShowCard(false);

    if (newSubmitted.size === players.length) {
      // 全員入力完了
      onAllHintsSubmitted();
    } else {
      // 次のプレイヤーへ
      let nextIndex = (currentPlayerIndex + 1) % players.length;
      while (newSubmitted.has(nextIndex)) {
        nextIndex = (nextIndex + 1) % players.length;
      }
      setCurrentPlayerIndex(nextIndex);
    }
  };

  return (
    <div className="screen hint-input-screen">
      <div className="theme-display compact">
        <div className="theme-title">{theme.title}</div>
        <div className="theme-scale">
          <span className="scale-low">1: {theme.lowDescription}</span>
          <span className="scale-high">100: {theme.highDescription}</span>
        </div>
      </div>

      <div className="progress-indicator">
        {players.map((_, index) => (
          <span
            key={index}
            className={`progress-dot ${submittedPlayers.has(index) ? 'done' : ''} ${
              index === currentPlayerIndex ? 'current' : ''
            }`}
          />
        ))}
      </div>

      <div className="hint-input-content">
        <h3 className="player-turn">{currentPlayer.name}の番</h3>

        <div className="card-preview">
          {showCard ? (
            <div className="mini-card">
              <span>{currentPlayer.cardNumber}</span>
            </div>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => setShowCard(true)}
            >
              カードを確認
            </button>
          )}
        </div>

        <div className="hint-form">
          <label>あなたの数字を表すヒントを入力</label>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder={`例: ${theme.lowDescription}と${theme.highDescription}の間のもの`}
            autoFocus
          />
          <button
            className="btn btn-primary btn-large"
            onClick={handleSubmitHint}
            disabled={!hint.trim()}
          >
            ヒントを決定
          </button>
        </div>
      </div>
    </div>
  );
}
