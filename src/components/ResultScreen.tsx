import type { Player, Theme } from '../types';

interface ResultScreenProps {
  players: Player[];
  theme: Theme;
  isSuccess: boolean;
  lives: number;
  maxLives: number;
  revealOrder: number[];
  onPlayAgain: () => void;
  onBackToTitle: () => void;
}

export function ResultScreen({
  players,
  theme,
  isSuccess,
  lives,
  maxLives,
  revealOrder,
  onPlayAgain,
  onBackToTitle,
}: ResultScreenProps) {
  // 正しい順番を取得
  const correctOrder = [...players].sort((a, b) => a.cardNumber - b.cardNumber);

  // 実際に公開された順番
  const actualOrder = revealOrder.map((id) => players.find((p) => p.id === id)!);

  return (
    <div className="screen result-screen">
      <div className={`result-banner ${isSuccess ? 'success' : 'fail'}`}>
        <h2>{isSuccess ? '🎉 成功！' : '💔 失敗...'}</h2>
        <p>
          {isSuccess
            ? 'おめでとうございます！全員のカードを正しい順番で出せました！'
            : 'ライフが尽きてしまいました...'}
        </p>
      </div>

      <div className="result-stats">
        <div className="stat">
          <span className="stat-label">お題</span>
          <span className="stat-value">{theme.title}</span>
        </div>
        <div className="stat">
          <span className="stat-label">残りライフ</span>
          <span className="stat-value">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span
                key={i}
                className={`life-heart ${i < lives ? 'active' : 'lost'}`}
              >
                ♥
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="result-comparison">
        <div className="order-column">
          <h4>正しい順番</h4>
          <div className="order-list">
            {correctOrder.map((player, index) => (
              <div key={player.id} className="order-item correct">
                <span className="order-number">{index + 1}</span>
                <span className="card-number">{player.cardNumber}</span>
                <span className="player-name">{player.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-column">
          <h4>みんなの順番</h4>
          <div className="order-list">
            {actualOrder.map((player, index) => {
              const correctIndex = correctOrder.findIndex(
                (p) => p.id === player.id
              );
              const isCorrectPosition = correctIndex === index;
              return (
                <div
                  key={player.id}
                  className={`order-item ${isCorrectPosition ? 'correct' : 'wrong'}`}
                >
                  <span className="order-number">{index + 1}</span>
                  <span className="card-number">{player.cardNumber}</span>
                  <span className="player-name">{player.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="result-hints">
        <h4>みんなのヒント</h4>
        <div className="hints-list">
          {correctOrder.map((player) => (
            <div key={player.id} className="hint-item">
              <span className="card-number">{player.cardNumber}</span>
              <span className="player-name">{player.name}</span>
              <span className="hint-text">「{player.hint}」</span>
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button className="btn btn-primary btn-large" onClick={onPlayAgain}>
          もう一度遊ぶ
        </button>
        <button className="btn btn-secondary" onClick={onBackToTitle}>
          タイトルに戻る
        </button>
      </div>
    </div>
  );
}
