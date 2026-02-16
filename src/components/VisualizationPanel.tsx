import React from 'react';
import { Card, CardHeader, CardContent } from './ui';
import { DrawingOutput } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface VisualizationPanelProps {
  output: DrawingOutput;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ output }) => {
  // Данные для круговой диаграммы усилий
  const forceData = [
    { name: 'Деформация (Pc)', value: output.Pc, color: '#3B82F6' },
    { name: 'Трение (Pt)', value: output.Pt, color: '#8B5CF6' },
    { name: 'Запас прочности', value: output.Pmax - output.Pc - output.Pt, color: '#10B981' }
  ].filter(item => item.value > 0);

  // Данные для гистограммы параметров
  const paramsData = [
    { name: 'β (деформация)', value: output.beta * 100 },
    { name: 'βs (утонение)', value: output.thinningRatio * 100 },
    { name: 'm (вытяжка)', value: output.drawingRatio * 100 }
  ];

  // Данные для сравнения с предельными значениями
  const limitsData = [
    { 
      name: 'Утонение', 
      actual: output.thinningRatio * 100, 
      limit: 100,
      recommended: 70 
    },
    { 
      name: 'Вытяжка', 
      actual: output.drawingRatio * 100, 
      limit: 200,
      recommended: 180 
    }
  ];

  const formatForce = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} кН`;
    }
    return `${value.toFixed(2)} Н`;
  };

  return (
    <div className="space-y-6">
      {/* Круговая диаграмма распределения усилий */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-800">Распределение усилий</h2>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={forceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {forceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatForce(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {forceData.map((item, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-1" 
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs text-slate-500">{item.name}</div>
                <div className="font-semibold text-slate-700">{formatForce(item.value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Гистограмма параметров деформации */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-800">Параметры деформации</h2>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paramsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-slate-500 text-center">
            Относительные значения параметров (%)
          </div>
        </CardContent>
      </Card>

      {/* Индикаторы предельных значений */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-800">Контроль предельных значений</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          {limitsData.map((item, index) => {
            const percentage = Math.min((item.actual / item.limit) * 100, 100);
            const isWarning = item.actual > item.recommended;
            const isDanger = item.actual > item.limit;
            
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className={isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}>
                    {item.actual.toFixed(1)}% / {item.limit}%
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDanger ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span>
                  <span>Рекомендуемое: {item.recommended}%</span>
                  <span>Предельное: {item.limit}%</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
