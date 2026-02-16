import {
  ICalculator,
  DrawingInput,
  DrawingOutput,
  CalculationStep,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  Material
} from '../types';
import { getMaterialById } from '../data/materials';

export class DrawingCalculator implements ICalculator<DrawingInput, DrawingOutput> {
  id = 'drawing-calculator';
  name = 'Калькулятор усилия вытяжки';
  version = '1.0.0';
  description = 'Расчёт усилий при вытяжке металла с утонением стенки';
  icon = '🔧';

  private steps: CalculationStep[] = [];

  validate(input: DrawingInput): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Валидация геометрических параметров
    if (input.D0 <= 0) {
      errors.push({ field: 'D0', message: 'Наружный диаметр заготовки должен быть положительным' });
    }
    if (input.d0 <= 0) {
      errors.push({ field: 'd0', message: 'Внутренний диаметр отверстия должен быть положительным' });
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
    if (input.d0 >= input.D0) {
      errors.push({ field: 'd0', message: 'Внутренний диаметр должен быть меньше наружного' });
    }

    if (input.d <= 0) {
      errors.push({ field: 'd', message: 'Диаметр изделия должен быть положительным' });
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
    const thinningRatio = input.s / input.s0;
    if (thinningRatio < 0.3) {
      warnings.push({ field: 's', message: 'Критическое утонение стенки! Рекомендуется увеличить количество переходов.' });
    }
    if (thinningRatio > 1.1) {
      warnings.push({ field: 's', message: 'Утолщение стенки выше нормы' });
    }

    // Проверка степени вытяжки
    const drawingRatio = input.D0 / input.d;
    if (drawingRatio > 2.0) {
      warnings.push({ field: 'D0', message: 'Степень вытяжки превышает рекомендуемое значение. Увеличьте количество переходов.' });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  calculate(input: DrawingInput): DrawingOutput {
    this.steps = [];
    const stepId = { current: 0 };
    const nextId = () => ++stepId.current;

    const material = getMaterialById(input.materialId)!;

    // === Шаг 1: Расчёт геометрических площадей ===
    const F0 = Math.PI / 4 * (Math.pow(input.D0, 2) - Math.pow(input.d0, 2)); // Площадь заготовки
    const Fd = Math.PI * input.d * input.s; // Площадь донной части
    const Fst = Math.PI * (input.d + input.s) * input.h; // Площадь стенки
    
    this.addStep(nextId(), 'Площадь заготовки', 'F₀ = π/4(D₀² - d₀²)', 
      F0, 'мм²', `F₀ = π/4(${input.D0}² - ${input.d0}²) = ${F0.toFixed(2)} мм²`);
    this.addStep(nextId(), 'Площадь донной части', 'Fд = π·d·s', 
      Fd, 'мм²', `Fд = π·${input.d}·${input.s} = ${Fd.toFixed(2)} мм²`);
    this.addStep(nextId(), 'Площадь стенки', 'Fст = π(d+s)h', 
      Fst, 'мм²', `Fст = π(${input.d}+${input.s})·${input.h} = ${Fst.toFixed(2)} мм²`);

    // === Шаг 2: Степень деформации ===
    const beta = Math.pow(input.D0 / input.d, 2);
    this.addStep(nextId(), 'Степень деформации', 'β = (D₀/d)²', 
      beta, '', `β = (${input.D0}/${input.d})² = ${beta.toFixed(4)}`);

    // === Шаг 3: Коэффициент утонения ===
    const thinningRatio = input.s / input.s0;
    this.addStep(nextId(), 'Коэффициент утонения', 'βs = s/s₀', 
      thinningRatio, '', `βs = ${input.s}/${input.s0} = ${thinningRatio.toFixed(4)}`);

    // === Шаг 4: Степень вытяжки ===
    const m = input.d / input.D0;
    const drawingRatio = 1 / m;
    this.addStep(nextId(), 'Степень вытяжки', 'm = d/D₀', 
      m, '', `m = ${input.d}/${input.D0} = ${m.toFixed(4)}`);
    this.addStep(nextId(), 'Коэффициент вытяжки', '1/m', 
      drawingRatio, '', `1/m = ${drawingRatio.toFixed(4)}`);

    // === Шаг 5: Расчёт напряжения по Валиеву ===
    // σp = K * (β^n) * (s/s0)^n
    const sigmaP = material.properties.K * Math.pow(beta, material.properties.n) * 
                   Math.pow(thinningRatio, material.properties.n);
    this.addStep(nextId(), 'Напряжение вытяжки', 'σр = K·βⁿ·βsⁿ', 
      sigmaP, 'МПа', `σр = ${material.properties.K}·${beta.toFixed(4)}^${material.properties.n}·${thinningRatio.toFixed(4)}^${material.properties.n} = ${sigmaP.toFixed(2)} МПа`);

    // === Шаг 6: Усилие деформации (Pc) ===
    // Pc = σp * Fp, где Fp - площадь поверхности зоны деформации
    const Fp = Math.PI * (input.d + input.s) * input.h * 0.5; // Приближенная площадь деформации
    const Pc = sigmaP * Fp * input.mD / 1000; // Перевод в кН
    this.addStep(nextId(), 'Усилие деформации', 'Pд = σр·Fp·mD', 
      Pc, 'кН', `Pд = ${sigmaP.toFixed(2)}·${Fp.toFixed(2)}·${input.mD}/1000 = ${Pc.toFixed(2)} кН`);

    // === Шаг 7: Усилие трения (Pt) ===
    // Pt = kT * σp * Fk, где Fk - контактная площадь
    const Fk = Math.PI * (input.d + input.s) * input.h;
    const Pt = input.kT * material.properties.sigmaT * Fk / 1000;
    this.addStep(nextId(), 'Усилие трения', 'Pt = kT·σт·Fk', 
      Pt, 'кН', `Pt = ${input.kT}·${material.properties.sigmaT}·${Fk.toFixed(2)}/1000 = ${Pt.toFixed(2)} кН`);

    // === Шаг 8: Максимальное усилие ===
    const Pmax = (Pc + Pt) * input.safetyFactor;
    this.addStep(nextId(), 'Максимальное усилие', 'Pmax = (Pд + Pt)·k安全', 
      Pmax, 'кН', `Pmax = (${Pc.toFixed(2)} + ${Pt.toFixed(2)})·${input.safetyFactor} = ${Pmax.toFixed(2)} кН`);

    // === Шаг 9: Перевод в Ньютоны для результата ===
    const PmaxN = Pmax * 1000;
    const PcN = Pc * 1000;
    const PtN = Pt * 1000;

    // === Генерация рекомендаций ===
    const recommendations = this.generateRecommendations({
      Pmax: PmaxN,
      Pc: PcN,
      Pt: PtN,
      thinningRatio,
      drawingRatio,
      material,
      passes: input.passes,
      safetyFactor: input.safetyFactor
    });

    return {
      Pc: PcN,
      Pt: PtN,
      Pmax: PmaxN,
      beta,
      thinningRatio,
      drawingRatio,
      recommendations,
      steps: this.steps
    };
  }

  private addStep(id: number, name: string, formula: string, value: number, unit: string, description: string) {
    this.steps.push({ id, name, formula, value, unit, description });
  }

  getSteps(): CalculationStep[] {
    return this.steps;
  }

  private generateRecommendations(params: {
    Pmax: number;
    Pc: number;
    Pt: number;
    thinningRatio: number;
    drawingRatio: number;
    material: Material;
    passes: number;
    safetyFactor: number;
  }): string[] {
    const recommendations: string[] = [];

    // Анализ утонения
    if (params.thinningRatio < 0.5) {
      recommendations.push('⚠️ Критическое утонение стенки! Рекомендуется увеличить количество переходов до ' + (params.passes + 1));
    } else if (params.thinningRatio < 0.7) {
      recommendations.push('ℹ️ Значительное утонение стенки. Проверьте возможность увеличения переходов.');
    }

    // Анализ степени вытяжки
    if (params.drawingRatio > 1.8) {
      recommendations.push('⚠️ Высокая степень вытяжки. Рекомендуется ' + (params.passes + 1) + ' переходов для равномерного утонения.');
    }

    // Анализ соотношения усилий
    const frictionRatio = params.Pt / params.Pmax;
    if (frictionRatio > 0.3) {
      recommendations.push('💡 Высокое усилие трения (' + (frictionRatio * 100).toFixed(1) + '%). Рекомендуется использовать смазку для снижения износа инструмента.');
    }

    // Анализ запаса прочности
    if (params.safetyFactor < 1.5) {
      recommendations.push('⚠️ Низкий запас прочности. Рекомендуется увеличить до 1.5-2.0 для надёжности.');
    }

    // Материалспецифичные рекомендации
    if (params.material.properties.psi < 25) {
      recommendations.push('📊 Материал ' + params.material.name + ' имеет низкую пластичность. Контролируйте усилие во избежание разрыва.');
    }

    if (params.material.type === 'Алюминиевый сплав' && params.thinningRatio < 0.8) {
      recommendations.push('🔬 Для алюминиевых сплавов рекомендуется промежуточный отжиг между переходами при значительном утонении.');
    }

    if (params.material.type === 'Нержавеющая сталь') {
      recommendations.push('🔧 Нержавеющая сталь склонна к наклёпу. Учитывайте деформационное упрочнение между переходами.');
    }

    // Общие рекомендации
    recommendations.push('✅ Расчёт выполнен. Передайте результаты в отдел технологической подготовки производства.');

    return recommendations;
  }
}

// Экземпляр калькулятора
export const drawingCalculator = new DrawingCalculator();
