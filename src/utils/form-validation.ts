import { DrawingInput, ValidationResult, ValidationError, ValidationWarning } from '../types';
import { getMaterialById } from '../data/materials';

export const getDefaultInput = (): DrawingInput => ({
  D0: 100,
  d0: 20,
  d: 80,
  s0: 2,
  s: 1.5,
  h: 50,
  materialId: 'amg3',
  passes: 1,
  kT: 0.15,
  mD: 1.0,
  safetyFactor: 1.5
});

export const validateForm = (input: DrawingInput): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Валидация геометрических параметров
  if (input.D0 <= 0) {
    errors.push({ field: 'D0', message: 'Наружный диаметр заготовки должен быть положительным' });
  }
  if (input.d0 < 0) {
    errors.push({ field: 'd0', message: 'Внутренний диаметр отверстия не может быть отрицательным' });
  }
  if (input.d <= 0) {
    errors.push({ field: 'd', message: 'Диаметр изделия должен быть положительным' });
  }
  if (input.s0 <= 0) {
    errors.push({ field: 's0', message: 'Толщина заготовки должна быть положительной' });
  }
  if (input.s <= 0) {
    errors.push({ field: 's', message: 'Толщина изделия должна быть положительной' });
  }
  if (input.h <= 0) {
    errors.push({ field: 'h', message: 'Высота изделия должна быть положительной' });
  }

  // Проверка соотношений
  if (input.d0 >= input.D0 && input.d0 > 0) {
    errors.push({ field: 'd0', message: 'Внутренний диаметр должен быть меньше наружного' });
  }

  if (input.d >= input.D0 && input.D0 > 0) {
    errors.push({ field: 'd', message: 'Диаметр изделия должен быть меньше диаметра заготовки' });
  }

  // Проверка материала
  const material = getMaterialById(input.materialId);
  if (!material) {
    errors.push({ field: 'materialId', message: 'Материал не выбран из базы' });
  }

  // Проверка технологических параметров
  if (input.passes < 1 || input.passes > 5) {
    errors.push({ field: 'passes', message: 'Количество переходов должно быть от 1 до 5' });
  }

  if (input.kT < 0.05 || input.kT > 0.5) {
    warnings.push({ field: 'kT', message: 'Рекомендуемый коэффициент трения 0.1-0.2' });
  }

  if (input.mD < 0.5 || input.mD > 1.5) {
    warnings.push({ field: 'mD', message: 'Рекомендуемый коэффициент деформационного упрочнения 0.8-1.2' });
  }

  // Проверка утонения
  if (input.s0 > 0 && input.s > 0) {
    const thinningRatio = input.s / input.s0;
    if (thinningRatio < 0.3) {
      warnings.push({ field: 's', message: 'Критическое утонение стенки! Рекомендуется увеличить количество переходов.' });
    }
    if (thinningRatio > 1.1) {
      warnings.push({ field: 's', message: 'Утолщение стенки выше нормы' });
    }
  }

  // Проверка степени вытяжки
  if (input.D0 > 0 && input.d > 0) {
    const drawingRatio = input.D0 / input.d;
    if (drawingRatio > 2.0) {
      warnings.push({ field: 'D0', message: 'Степень вытяжки превышает рекомендуемое значение. Увеличьте количество переходов.' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
