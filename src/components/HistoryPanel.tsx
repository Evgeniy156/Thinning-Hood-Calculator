import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Button, Badge } from './ui';
import { CalculationHistory, DrawingOutput, DrawingInput } from '../types';
import { getHistory, deleteHistoryItem, clearHistory, exportHistoryToJSON, exportToCSV } from '../utils/storage';
import { getMaterialById } from '../data/materials';

interface HistoryPanelProps {
  onLoadCalculation?: (input: DrawingInput, output: DrawingOutput) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onLoadCalculation }) => {
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  const handleClear = () => {
    if (confirm('Очистить всю историю расчётов?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleExportJSON = () => {
    const json = exportHistoryToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculations_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(history);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaterialName = (materialId: string) => {
    const material = getMaterialById(materialId);
    return material?.name || materialId;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с действиями */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">История расчётов</h2>
          <div className="flex gap-2">
            <Button onClick={handleExportJSON} variant="outline" size="sm">
              📄 JSON
            </Button>
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              📊 CSV
            </Button>
            <Button onClick={handleClear} variant="danger" size="sm">
              🗑️ Очистить
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Список истории */}
      {history.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-slate-600 mb-2">История пуста</h3>
            <p className="text-slate-500">Выполните расчёт, чтобы сохранить его в историю</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.calculatorName}</h3>
                    <p className="text-sm text-slate-500">{formatDate(item.timestamp)}</p>
                  </div>
                  <Badge variant="success">Сохранено</Badge>
                </div>

                {/* Краткая информация о расчёте */}
                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500">D₀:</span>
                      <span className="ml-1 font-medium">{item.input.D0} мм</span>
                    </div>
                    <div>
                      <span className="text-slate-500">d:</span>
                      <span className="ml-1 font-medium">{item.input.d} мм</span>
                    </div>
                    <div>
                      <span className="text-slate-500">s₀→s:</span>
                      <span className="ml-1 font-medium">{item.input.s0}→{item.input.s} мм</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Pmax:</span>
                      <span className="ml-1 font-medium text-emerald-600">
                        {(item.output.Pmax / 1000).toFixed(2)} кН
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Материал: <span className="font-medium">{getMaterialName(item.input.materialId)}</span>
                  </div>
                </div>

                {/* Действия */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onLoadCalculation?.(item.input, item.output)}
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    📥 Загрузить
                  </Button>
                  <Button 
                    onClick={() => handleDelete(item.id)}
                    variant="danger" 
                    size="sm"
                  >
                    🗑️
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
