import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Input, Select, Button } from './ui';
import { DrawingInput, ValidationResult } from '../types';
import { materials, getMaterialTypes } from '../data/materials';
import { validateForm, getDefaultInput } from '../utils/form-validation';

interface DrawingFormProps {
  onCalculate: (input: DrawingInput) => void;
}

export const DrawingForm: React.FC<DrawingFormProps> = ({ onCalculate }) => {
  const [input, setInput] = useState<DrawingInput>(getDefaultInput());
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);

  const materialTypes = getMaterialTypes();
  const materialsByType = materials.filter(m => m.type === selectedMaterial.type);

  const handleInputChange = (field: keyof DrawingInput, value: string | number) => {
    const newInput = { ...input, [field]: value };
    setInput(newInput);
    setValidation(validateForm(newInput));
  };

  const handleMaterialTypeChange = (type: string) => {
    const firstMaterialOfType = materials.find(m => m.type === type);
    if (firstMaterialOfType) {
      setSelectedMaterial(firstMaterialOfType);
      handleInputChange('materialId', firstMaterialOfType.id);
    }
  };

  const handleCalculate = () => {
    const validationResult = validateForm(input);
    setValidation(validationResult);
    
    if (validationResult.isValid) {
      onCalculate(input);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validation?.errors.find(e => e.field === field)?.message;
  };

  const getFieldWarning = (field: string): string | undefined => {
    return validation?.warnings.find(w => w.field === field)?.message;
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-slate-800">Параметры расчёта</h2>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Геометрические параметры */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 sm:mb-4">
            Геометрические параметры
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <Input
              label="Наружный диаметр заготовки D₀"
              type="number"
              step="0.1"
              min="0"
              value={input.D0}
              onChange={(e) => handleInputChange('D0', parseFloat(e.target.value) || 0)}
              error={getFieldError('D0')}
              warning={getFieldWarning('D0')}
              placeholder="100"
            />
            <Input
              label="Внутренний диаметр отверстия d₀"
              type="number"
              step="0.1"
              min="0"
              value={input.d0}
              onChange={(e) => handleInputChange('d0', parseFloat(e.target.value) || 0)}
              error={getFieldError('d0')}
              placeholder="20"
            />
            <Input
              label="Диаметр изделия d"
              type="number"
              step="0.1"
              min="0"
              value={input.d}
              onChange={(e) => handleInputChange('d', parseFloat(e.target.value) || 0)}
              error={getFieldError('d')}
              placeholder="80"
            />
            <Input
              label="Толщина заготовки s₀"
              type="number"
              step="0.01"
              min="0"
              value={input.s0}
              onChange={(e) => handleInputChange('s0', parseFloat(e.target.value) || 0)}
              error={getFieldError('s0')}
              placeholder="2"
            />
            <Input
              label="Толщина изделия s"
              type="number"
              step="0.01"
              min="0"
              value={input.s}
              onChange={(e) => handleInputChange('s', parseFloat(e.target.value) || 0)}
              error={getFieldError('s')}
              warning={getFieldWarning('s')}
              placeholder="1.5"
            />
            <Input
              label="Высота изделия h"
              type="number"
              step="0.1"
              min="0"
              value={input.h}
              onChange={(e) => handleInputChange('h', parseFloat(e.target.value) || 0)}
              error={getFieldError('h')}
              placeholder="50"
            />
          </div>
        </div>

        {/* Параметры материала */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 sm:mb-4">
            Параметры материала
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Select
              label="Тип материала"
              value={selectedMaterial.type}
              onChange={(e) => handleMaterialTypeChange(e.target.value)}
              options={materialTypes.map(type => ({ value: type, label: type }))}
            />
            <Select
              label="Марка материала"
              value={input.materialId}
              onChange={(e) => {
                handleInputChange('materialId', e.target.value);
                const mat = materials.find(m => m.id === e.target.value);
                if (mat) setSelectedMaterial(mat);
              }}
              options={materialsByType.map(m => ({ value: m.id, label: m.name }))}
            />
          </div>
          
          {/* Свойства выбранного материала */}
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-slate-50 rounded-lg">
            <h4 className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Свойства материала: {selectedMaterial.name}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-slate-500">{'σв:'}</span>
                <span className="sm:ml-1 font-medium">{selectedMaterial.properties.sigmaB} МПа</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-slate-500">{'σт:'}</span>
                <span className="sm:ml-1 font-medium">{selectedMaterial.properties.sigmaT} МПа</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-slate-500">{'ψy:'}</span>
                <span className="sm:ml-1 font-medium">{selectedMaterial.properties.psi}%</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-slate-500">{'ρ:'}</span>
                <span className="sm:ml-1 font-medium">{selectedMaterial.properties.density} г/см³</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-slate-500">K:</span>
                <span className="sm:ml-1 font-medium">{selectedMaterial.properties.K}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="text-slate-500">n:</span>
                <span className="sm:ml-1 font-medium">{selectedMaterial.properties.n}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Технологические параметры */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3 sm:mb-4">
            Технологические параметры
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Input
              label="Количество переходов"
              type="number"
              step="1"
              min="1"
              max="5"
              value={input.passes}
              onChange={(e) => handleInputChange('passes', parseInt(e.target.value) || 1)}
              error={getFieldError('passes')}
            />
            <Input
              label="Коэффициент трения kT"
              type="number"
              step="0.01"
              min="0.05"
              max="0.5"
              value={input.kT}
              onChange={(e) => handleInputChange('kT', parseFloat(e.target.value) || 0.1)}
              warning={getFieldWarning('kT')}
            />
            <Input
              label="Коэф. деформац. упрочнения mD"
              type="number"
              step="0.1"
              min="0.5"
              max="1.5"
              value={input.mD}
              onChange={(e) => handleInputChange('mD', parseFloat(e.target.value) || 1)}
              warning={getFieldWarning('mD')}
            />
            <Input
              label="Запас прочности"
              type="number"
              step="0.1"
              min="1"
              max="3"
              value={input.safetyFactor}
              onChange={(e) => handleInputChange('safetyFactor', parseFloat(e.target.value) || 1.5)}
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
          <Button onClick={handleCalculate} size="lg" className="flex-1 text-sm sm:text-lg">
            Рассчитать
          </Button>
          <Button 
            onClick={() => {
              setInput(getDefaultInput());
              setValidation(null);
            }} 
            variant="outline"
            size="lg"
            className="text-sm sm:text-lg"
          >
            Сбросить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
