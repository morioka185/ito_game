import { useState, useCallback, useEffect } from 'react';
import { BUTTONS, safeEvaluate, formatNumber } from './calculator';
import type { CalcButton } from './calculator';
import './App.css';

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 計算結果をリアルタイム更新
  useEffect(() => {
    if (expression) {
      const { result: calcResult, error } = safeEvaluate(expression);
      if (error) {
        setResult(error);
      } else if (calcResult !== null) {
        setResult(formatNumber(calcResult));
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [expression]);

  // ボタンクリック処理
  const handleButtonClick = useCallback((button: CalcButton) => {
    switch (button.value) {
      case 'clear':
        setExpression('');
        setResult(null);
        break;

      case 'backspace':
        setExpression((prev) => {
          // 関数名を一括削除
          const funcMatch = prev.match(/(sin|cos|tan|asin|acos|atan|log|ln|sqrt|abs|exp|√)\($/);
          if (funcMatch) {
            return prev.slice(0, -funcMatch[0].length);
          }
          return prev.slice(0, -1);
        });
        break;

      case 'negate':
        setExpression((prev) => {
          if (!prev) return '-';
          // 末尾の数値を反転
          const match = prev.match(/(-?\d+\.?\d*)$/);
          if (match) {
            const num = match[1];
            const start = prev.slice(0, -num.length);
            if (num.startsWith('-')) {
              return start + num.slice(1);
            } else {
              return start + '-' + num;
            }
          }
          return '(-' + prev + ')';
        });
        break;

      case 'inverse':
        setExpression((prev) => (prev ? `1/(${prev})` : '1/'));
        break;

      case '=':
        if (expression && result && result !== 'Error' && result !== 'Infinity') {
          setHistory((prev) => [{ expr: expression, result }, ...prev.slice(0, 9)]);
          setExpression(result);
          setResult(null);
        }
        break;

      default:
        setExpression((prev) => prev + button.value);
    }
  }, [expression, result]);

  // キーボード入力対応
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setExpression((prev) => prev + e.key);
      } else if (['+', '-', '*', '/', '(', ')', '.', '^'].includes(e.key)) {
        const keyMap: Record<string, string> = { '*': '×', '/': '÷' };
        setExpression((prev) => prev + (keyMap[e.key] || e.key));
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        if (expression && result && result !== 'Error' && result !== 'Infinity') {
          setHistory((prev) => [{ expr: expression, result }, ...prev.slice(0, 9)]);
          setExpression(result);
          setResult(null);
        }
      } else if (e.key === 'Backspace') {
        setExpression((prev) => prev.slice(0, -1));
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        setExpression('');
        setResult(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, result]);

  // 履歴から復元
  const handleHistoryClick = (item: { expr: string; result: string }) => {
    setExpression(item.result);
    setShowHistory(false);
  };

  return (
    <div className="calculator">
      <div className="display">
        <div className="expression">{expression || '0'}</div>
        <div className={`result ${result === 'Error' || result === 'Infinity' ? 'error' : ''}`}>
          {result && `= ${result}`}
        </div>
      </div>

      <div className="controls">
        <button
          className={`history-toggle ${showHistory ? 'active' : ''}`}
          onClick={() => setShowHistory(!showHistory)}
          title="履歴"
        >
          📜
        </button>
      </div>

      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <span>計算履歴</span>
            <button onClick={() => setHistory([])}>クリア</button>
          </div>
          {history.length === 0 ? (
            <div className="history-empty">履歴がありません</div>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(item)}
                >
                  <span className="history-expr">{item.expr}</span>
                  <span className="history-result">= {item.result}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="buttons">
        {BUTTONS.map((row, rowIndex) => (
          <div key={rowIndex} className="button-row">
            {row.map((button) => (
              <button
                key={button.label}
                className={`calc-btn ${button.type} ${button.span ? `span-${button.span}` : ''}`}
                onClick={() => handleButtonClick(button)}
              >
                {button.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="hints">
        <span>DEG</span>
        <span>キーボード対応</span>
      </div>
    </div>
  );
}

export default App;
