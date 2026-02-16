// Общие типы для калькуляторов
export interface CalculationStep {
  id: number;
  name: string;
  formula: string;
  value: number;
  unit: string;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ICalculator<TInput, TOutput> {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  validate(input: TInput): ValidationResult;
  calculate(input: TInput): TOutput;
  getSteps(): CalculationStep[];
}

// Типы для калькулятора вытяжки
export interface DrawingInput {
  // Геометрические параметры
  D0: number; // Наружный диаметр заготовки, мм
  d0: number; // Внутренний диаметр отверстия в заготовке, мм
  d: number; // Диаметр изделия после вытяжки, мм
  s0: number; // Толщина заготовки, мм
  s: number; // Толщина изделия после вытяжки, мм
  h: number; // Высота изделия, мм
  
  // Параметры материала
  materialId: string;
  
  // Технологические параметры
  passes: number; // Количество переходов
  kT: number; // Коэффициент трения
  mD: number; // Коэффициент деформационного упрочнения
  
  // Дополнительные
  safetyFactor: number; // Запас прочности
}

export interface DrawingOutput {
  // Усилия
  Pc: number; // Усилие деформации, Н
  Pt: number; // Усилие трения, Н
  Pmax: number; // Максимальное усилие, Н
  
  // Параметры
  beta: number; // Степень деформации
  thinningRatio: number; // Коэффициент утонения
  drawingRatio: number; // Степень вытяжки
  
  // Рекомендации
  recommendations: string[];
  
  // Промежуточные результаты
  steps: CalculationStep[];
}

export interface Material {
  id: string;
  name: string;
  type: string;
  properties: MaterialProperties;
}

export interface MaterialProperties {
  sigmaB: number; // Предел прочности, МПа
  sigmaT: number; // Предел текучести, МПа
  psi: number; // Относительное сужение, %
  density: number; // Плотность, г/см³
  K: number; // Коэффициент упрочнения
  n: number; // Показатель деформационного упрочнения
}

export interface CalculationHistory {
  id: string;
  calculatorId: string;
  calculatorName: string;
  input: DrawingInput;
  output: DrawingOutput;
  timestamp: Date;
  notes?: string;
}

// Типы для UI
export interface TabItem {
  id: string;
  label: string;
  icon: string;
}
