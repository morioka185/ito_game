import { useState } from 'react';

interface SetupScreenProps {
  onStartGame: (playerNames: string[]) => void;
  onBack: () => void;
}

export function SetupScreen({ onStartGame, onBack }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'プレイヤー1',
    'プレイヤー2',
    'プレイヤー3',
  ]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const newNames = [...playerNames];
    while (newNames.length < count) {
      newNames.push(`プレイヤー${newNames.length + 1}`);
    }
    setPlayerNames(newNames.slice(0, count));
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const validNames = playerNames.map((name, i) =>
      name.trim() || `プレイヤー${i + 1}`
    );
    onStartGame(validNames);
  };

  return (
    <div className="screen setup-screen">
      <div className="screen-header">
        <button className="btn btn-back" onClick={onBack}>
          ← 戻る
        </button>
        <h2>ゲーム設定</h2>
      </div>

      <div className="setup-content">
        <div className="player-count-section">
          <label>プレイヤー人数</label>
          <div className="player-count-buttons">
            {[2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                className={`btn btn-count ${playerCount === num ? 'active' : ''}`}
                onClick={() => handlePlayerCountChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="player-names-section">
          <label>プレイヤー名</label>
          <div className="player-names-list">
            {playerNames.slice(0, playerCount).map((name, index) => (
              <div key={index} className="player-name-input">
                <span className="player-number">{index + 1}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`プレイヤー${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-large" onClick={handleStart}>
          ゲーム開始
        </button>
      </div>
    </div>
  );
}
