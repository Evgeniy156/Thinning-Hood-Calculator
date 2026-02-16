import React, { useState } from 'react';
import { DrawingForm } from './components/DrawingForm';
import { ResultsPanel } from './components/ResultsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { VisualizationPanel } from './components/VisualizationPanel';
import { Tabs, Card, CardContent } from './components/ui';
import { DrawingInput, DrawingOutput } from './types';
import { drawingCalculator } from './calculators/drawing-calculator';

type TabId = 'calculator' | 'visualization' | 'history';

const tabs = [
  { id: 'calculator', label: 'Калькулятор', icon: '🧮' },
  { id: 'visualization', label: 'Визуализация', icon: '📊' },
  { id: 'history', label: 'История', icon: '📚' }
];

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('calculator');
  const [input, setInput] = useState<DrawingInput | null>(null);
  const [output, setOutput] = useState<DrawingOutput | null>(null);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleCalculate = (calcInput: DrawingInput) => {
    const result = drawingCalculator.calculate(calcInput);
    setInput(calcInput);
    setOutput(result);
    setActiveTab('calculator');
  };

  const handleLoadCalculation = (calcInput: DrawingInput, result: DrawingOutput) => {
    setInput(calcInput);
    setOutput(result);
    setActiveTab('calculator');
  };

  const handleSaveSuccess = () => {
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-9 w-9 sm:h-12 sm:w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                <span className="text-lg sm:text-2xl">⚙️</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                  Инженерный Калькулятор
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Расчёт усилия вытяжки с утонением</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <span>🔧</span>
              <span>Модульная система калькуляторов v1.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Навигация по вкладкам */}
        <div className="mb-4 sm:mb-8">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onChange={(id) => setActiveTab(id as TabId)} 
          />
        </div>

        {/* Сообщение об успешном сохранении */}
        {showSaveMessage && (
          <div className="fixed top-16 sm:top-24 right-3 sm:right-4 z-50 animate-bounce">
            <div className="bg-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm sm:text-base">
              <span>✅</span>
              <span>Расчёт сохранён в историю</span>
            </div>
          </div>
        )}

        {/* Контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Левая колонка - форма */}
          <div className="space-y-4 sm:space-y-6">
            <DrawingForm onCalculate={handleCalculate} />
          </div>

          {/* Правая колонка - результаты */}
          <div className="space-y-4 sm:space-y-6">
            {activeTab === 'calculator' && (
              output && input ? (
                <ResultsPanel 
                  input={input} 
                  output={output} 
                  onSave={handleSaveSuccess}
                />
              ) : (
                <Card>
                  <CardContent className="text-center py-10 sm:py-16">
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🧮</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-600 mb-2">
                      Введите параметры
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500">
                      Заполните форму и нажмите "Рассчитать" для получения результатов
                    </p>
                  </CardContent>
                </Card>
              )
            )}

            {activeTab === 'visualization' && (
              output && input ? (
                <VisualizationPanel output={output} />
              ) : (
                <Card>
                  <CardContent className="text-center py-10 sm:py-16">
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📊</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-600 mb-2">
                      Нет данных для визуализации
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500">
                      Выполните расчёт, чтобы увидеть графики и диаграммы
                    </p>
                  </CardContent>
                </Card>
              )
            )}

            {activeTab === 'history' && (
              <HistoryPanel onLoadCalculation={handleLoadCalculation} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span>📐</span>
              <span>Инженерный калькулятор v1.0.0</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>{'Точность: < 0.1%'}</span>
              <span>{'•'}</span>
              <span>{'Время расчёта: < 100мс'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
