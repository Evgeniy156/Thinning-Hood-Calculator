import { CalculationHistory, DrawingInput, DrawingOutput } from '../types';

const HISTORY_KEY = 'engineering_calculator_history';

export const saveCalculation = (
  calculatorId: string,
  calculatorName: string,
  input: DrawingInput,
  output: DrawingOutput,
  notes?: string
): CalculationHistory => {
  const history = getHistory();
  
  const newEntry: CalculationHistory = {
    id: crypto.randomUUID(),
    calculatorId,
    calculatorName,
    input,
    output,
    timestamp: new Date(),
    notes
  };
  
  history.unshift(newEntry);
  
  // Ограничиваем историю последними 100 записями
  const limitedHistory = history.slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  
  return newEntry;
};

export const getHistory = (): CalculationHistory[] => {
  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((item: CalculationHistory) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch {
    return [];
  }
};

export const deleteHistoryItem = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const exportHistoryToJSON = (): string => {
  const history = getHistory();
  return JSON.stringify(history, null, 2);
};

export const exportToCSV = (history: CalculationHistory[]): string => {
  const headers = ['Дата', 'Калькулятор', 'D0 (мм)', 'd0 (мм)', 'd (мм)', 's0 (мм)', 's (мм)', 'h (мм)', 'Pmax (Н)', 'Pc (Н)', 'Pt (Н)'];
  
  const rows = history.map(item => [
    new Date(item.timestamp).toLocaleString('ru-RU'),
    item.calculatorName,
    item.input.D0,
    item.input.d0,
    item.input.d,
    item.input.s0,
    item.input.s,
    item.input.h,
    item.output.Pmax.toFixed(2),
    item.output.Pc.toFixed(2),
    item.output.Pt.toFixed(2)
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};
