import { useState, useCallback } from 'react';
import type { GameState } from './types';
import {
  createInitialGameState,
  addPlayers,
  setPlayerHint,
  checkRevealOrder,
  resetGame,
} from './gameLogic';
import { TitleScreen } from './components/TitleScreen';
import { SetupScreen } from './components/SetupScreen';
import { CardRevealScreen } from './components/CardRevealScreen';
import { HintInputScreen } from './components/HintInputScreen';
import { PlayScreen } from './components/PlayScreen';
import { ResultScreen } from './components/ResultScreen';
import './App.css';

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [lastRevealResult, setLastRevealResult] = useState<{
    playerId: number;
    success: boolean;
  } | null>(null);

  const handleStartSetup = useCallback(() => {
    setGameState((state) => ({ ...state, phase: 'setup' }));
  }, []);

  const handleBackToTitle = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  const handleStartGame = useCallback((playerNames: string[]) => {
    setGameState((state) => {
      const newState = addPlayers(state, playerNames);
      return { ...newState, phase: 'card-reveal' };
    });
  }, []);

  const handleAllCardsRevealed = useCallback(() => {
    setGameState((state) => ({ ...state, phase: 'hint-input' }));
  }, []);

  const handleHintSubmit = useCallback((playerId: number, hint: string) => {
    setGameState((state) => setPlayerHint(state, playerId, hint));
  }, []);

  const handleAllHintsSubmitted = useCallback(() => {
    setGameState((state) => ({ ...state, phase: 'play' }));
    setLastRevealResult(null);
  }, []);

  const handleRevealCard = useCallback((playerId: number) => {
    setGameState((state) => {
      const result = checkRevealOrder(state, playerId);
      setLastRevealResult({ playerId, success: result.success });

      // 結果表示を数秒後にクリア（結果画面以外の場合）
      if (result.state.phase === 'play') {
        setTimeout(() => setLastRevealResult(null), 2000);
      }

      return result.state;
    });
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState((state) => resetGame(state));
    setLastRevealResult(null);
  }, []);

  return (
    <div className="app">
      {gameState.phase === 'title' && (
        <TitleScreen onStart={handleStartSetup} />
      )}

      {gameState.phase === 'setup' && (
        <SetupScreen onStartGame={handleStartGame} onBack={handleBackToTitle} />
      )}

      {gameState.phase === 'card-reveal' && (
        <CardRevealScreen
          players={gameState.players}
          theme={gameState.currentTheme}
          onAllCardsRevealed={handleAllCardsRevealed}
        />
      )}

      {gameState.phase === 'hint-input' && (
        <HintInputScreen
          players={gameState.players}
          theme={gameState.currentTheme}
          onHintSubmit={handleHintSubmit}
          onAllHintsSubmitted={handleAllHintsSubmitted}
        />
      )}

      {gameState.phase === 'play' && (
        <PlayScreen
          players={gameState.players}
          theme={gameState.currentTheme}
          lives={gameState.lives}
          maxLives={gameState.maxLives}
          revealOrder={gameState.revealOrder}
          onRevealCard={handleRevealCard}
          lastRevealResult={lastRevealResult}
        />
      )}

      {gameState.phase === 'result' && (
        <ResultScreen
          players={gameState.players}
          theme={gameState.currentTheme}
          isSuccess={gameState.isSuccess ?? false}
          lives={gameState.lives}
          maxLives={gameState.maxLives}
          revealOrder={gameState.revealOrder}
          onPlayAgain={handlePlayAgain}
          onBackToTitle={handleBackToTitle}
        />
      )}
    </div>
  );
}

export default App;
