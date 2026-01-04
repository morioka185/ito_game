interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="screen title-screen">
      <div className="title-content">
        <h1 className="game-title">糸通し</h1>
        <p className="game-subtitle">ito</p>
        <p className="game-description">
          数字を言葉で伝える
          <br />
          協力パーティーゲーム
        </p>
        <button className="btn btn-primary btn-large" onClick={onStart}>
          ゲームを始める
        </button>
      </div>
    </div>
  );
}
