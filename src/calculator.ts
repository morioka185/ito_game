// 関数電卓のロジック

// 度数法/ラジアン変換
export const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
export const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

// 安全な計算実行
export function safeEvaluate(expression: string): { result: number | null; error: string | null } {
  try {
    // 空の式
    if (!expression.trim()) {
      return { result: null, error: null };
    }

    // 式を計算可能な形式に変換
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/e(?![x])/g, `(${Math.E})`)
      .replace(/(\d)(\()/g, '$1*(')
      .replace(/(\))(\d)/g, ')*$2')
      .replace(/(\))(\()/g, ')*(');

    // 関数の変換（度数法）
    expr = expr
      .replace(/sin\(([^)]+)\)/g, (_, arg) => `Math.sin((${arg})*Math.PI/180)`)
      .replace(/cos\(([^)]+)\)/g, (_, arg) => `Math.cos((${arg})*Math.PI/180)`)
      .replace(/tan\(([^)]+)\)/g, (_, arg) => `Math.tan((${arg})*Math.PI/180)`)
      .replace(/asin\(([^)]+)\)/g, (_, arg) => `(Math.asin(${arg})*180/Math.PI)`)
      .replace(/acos\(([^)]+)\)/g, (_, arg) => `(Math.acos(${arg})*180/Math.PI)`)
      .replace(/atan\(([^)]+)\)/g, (_, arg) => `(Math.atan(${arg})*180/Math.PI)`)
      .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
      .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
      .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/abs\(([^)]+)\)/g, 'Math.abs($1)')
      .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)')
      .replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)')
      .replace(/\^/g, '**');

    // 危険な文字列をブロック
    if (/[a-zA-Z_$]/.test(expr.replace(/Math\.(sin|cos|tan|asin|acos|atan|log|log10|sqrt|abs|exp|pow|PI|E)/g, ''))) {
      return { result: null, error: 'Invalid expression' };
    }

    // 計算実行
    const result = Function(`"use strict"; return (${expr})`)();

    if (typeof result !== 'number' || !isFinite(result)) {
      if (isNaN(result)) {
        return { result: null, error: 'Error' };
      }
      return { result: null, error: 'Infinity' };
    }

    return { result, error: null };
  } catch {
    return { result: null, error: 'Error' };
  }
}

// 数値をフォーマット
export function formatNumber(num: number): string {
  if (Number.isInteger(num) && Math.abs(num) < 1e15) {
    return num.toString();
  }

  // 非常に小さいまたは大きい数は指数表記
  if (Math.abs(num) < 1e-10 || Math.abs(num) >= 1e10) {
    return num.toExponential(8).replace(/\.?0+e/, 'e');
  }

  // 小数点以下10桁まで、末尾の0を削除
  return parseFloat(num.toPrecision(10)).toString();
}

// ボタンの種類
export type ButtonType = 'number' | 'operator' | 'function' | 'action' | 'equals';

export interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
}

// 電卓のボタン配置
export const BUTTONS: CalcButton[][] = [
  [
    { label: 'sin', value: 'sin(', type: 'function' },
    { label: 'cos', value: 'cos(', type: 'function' },
    { label: 'tan', value: 'tan(', type: 'function' },
    { label: 'π', value: 'π', type: 'number' },
    { label: 'e', value: 'e', type: 'number' },
  ],
  [
    { label: 'x²', value: '^2', type: 'operator' },
    { label: 'xʸ', value: '^', type: 'operator' },
    { label: '√', value: '√(', type: 'function' },
    { label: 'log', value: 'log(', type: 'function' },
    { label: 'ln', value: 'ln(', type: 'function' },
  ],
  [
    { label: '(', value: '(', type: 'operator' },
    { label: ')', value: ')', type: 'operator' },
    { label: '%', value: '/100', type: 'operator' },
    { label: 'AC', value: 'clear', type: 'action' },
    { label: '⌫', value: 'backspace', type: 'action' },
  ],
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '÷', value: '÷', type: 'operator' },
    { label: '±', value: 'negate', type: 'action' },
  ],
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '×', value: '×', type: 'operator' },
    { label: '1/x', value: 'inverse', type: 'action' },
  ],
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '-', value: '-', type: 'operator' },
    { label: 'abs', value: 'abs(', type: 'function' },
  ],
  [
    { label: '0', value: '0', type: 'number' },
    { label: '.', value: '.', type: 'number' },
    { label: '=', value: '=', type: 'equals', span: 2 },
    { label: '+', value: '+', type: 'operator' },
  ],
];
