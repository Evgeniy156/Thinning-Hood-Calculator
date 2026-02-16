import React from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from './ui';
import { DrawingOutput, DrawingInput } from '../types';
import { saveCalculation } from '../utils/storage';

interface ResultsPanelProps {
  input: DrawingInput;
  output: DrawingOutput;
  onSave?: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ input, output, onSave }) => {

  const handleSave = () => {
    saveCalculation(
      'drawing-calculator',
      'Калькулятор усилия вытяжки',
      input,
      output
    );
    onSave?.();
  };

  const formatForce = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} кН`;
    }
    return `${value.toFixed(2)} Н`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Основные результаты */}
      <Card>
        <CardHeader>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Результаты расчёта</h2>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Усилия */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 sm:mb-4">
              Усилия
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                <div className="text-xs sm:text-sm text-blue-600 mb-1">Усилие деформации (Pc)</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-700">{formatForce(output.Pc)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 sm:p-4 border border-purple-100">
                <div className="text-xs sm:text-sm text-purple-600 mb-1">Усилие трения (Pt)</div>
                <div className="text-xl sm:text-2xl font-bold text-purple-700">{formatForce(output.Pt)}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 sm:p-4 border border-emerald-100">
                <div className="text-xs sm:text-sm text-emerald-600 mb-1">Максимальное усилие (Pmax)</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-700">{formatForce(output.Pmax)}</div>
              </div>
            </div>
          </div>

          {/* Параметры */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 sm:mb-4">
              Параметры деформации
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                <div className="text-[10px] sm:text-xs text-slate-500">{'Степень деформации (β)'}</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">{output.beta.toFixed(4)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                <div className="text-[10px] sm:text-xs text-slate-500">Коэф. утонения</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">{output.thinningRatio.toFixed(4)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                <div className="text-[10px] sm:text-xs text-slate-500">Степень вытяжки</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">{output.drawingRatio.toFixed(4)}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                <div className="text-[10px] sm:text-xs text-slate-500">Запас прочности</div>
                <div className="text-base sm:text-lg font-semibold text-slate-700">{input.safetyFactor}</div>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} variant="success" className="w-full text-sm sm:text-base">
            💾 Сохранить в историю
          </Button>
        </CardContent>
      </Card>

      {/* Пошаговый расчёт */}
      <Card>
        <CardHeader>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Пошаговый расчёт</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {output.steps.map((step, index) => (
              <div 
                key={step.id} 
                className="relative pl-6 sm:pl-8 pb-3 sm:pb-4 border-l-2 border-slate-200 last:border-l-0 last:pb-0"
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 text-white text-[10px] sm:text-xs flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h4 className="font-medium text-slate-800 text-sm sm:text-base">{step.name}</h4>
                    <Badge variant="info">{step.unit || 'расчёт'}</Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 mb-2 font-mono bg-slate-100 p-2 rounded overflow-x-auto">
                    {step.formula}
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-blue-600">
                    {typeof step.value === 'number' ? step.value.toFixed(4) : step.value} {step.unit}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Рекомендации */}
      {output.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Рекомендации</h2>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 sm:space-y-3">
              {output.recommendations.map((rec, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-slate-50"
                >
                  <span className="text-base sm:text-lg">{rec.charAt(0)}</span>
                  <span className="text-sm sm:text-base text-slate-700">{rec.substring(1)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
