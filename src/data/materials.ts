import { Material } from '../types';

export const materials: Material[] = [
  // Алюминий и его сплавы
  {
    id: 'amg3',
    name: 'АМг3',
    type: 'Алюминиевый сплав',
    properties: {
      sigmaB: 190,
      sigmaT: 100,
      psi: 25,
      density: 2.75,
      K: 420,
      n: 0.15
    }
  },
  {
    id: 'amg6',
    name: 'АМг6',
    type: 'Алюминиевый сплав',
    properties: {
      sigmaB: 315,
      sigmaT: 160,
      psi: 20,
      density: 2.64,
      K: 450,
      n: 0.13
    }
  },
  {
    id: 'd16t',
    name: 'Д16Т',
    type: 'Алюминиевый сплав',
    properties: {
      sigmaB: 440,
      sigmaT: 290,
      psi: 15,
      density: 2.78,
      K: 650,
      n: 0.12
    }
  },
  {
    id: 'ad1',
    name: 'АД1',
    type: 'Алюминий технический',
    properties: {
      sigmaB: 80,
      sigmaT: 30,
      psi: 35,
      density: 2.71,
      K: 160,
      n: 0.24
    }
  },
  
  // Медь и её сплавы
  {
    id: 'm1',
    name: 'М1',
    type: 'Медь',
    properties: {
      sigmaB: 220,
      sigmaT: 60,
      psi: 45,
      density: 8.94,
      K: 380,
      n: 0.31
    }
  },
  {
    id: 'lmc59-1',
    name: 'ЛМц59-1',
    type: 'Латунь',
    properties: {
      sigmaB: 440,
      sigmaT: 180,
      psi: 30,
      density: 8.5,
      K: 680,
      n: 0.18
    }
  },
  {
    id: 'lt68',
    name: 'ЛТ68',
    type: 'Латунь',
    properties: {
      sigmaB: 320,
      sigmaT: 100,
      psi: 40,
      density: 8.5,
      K: 500,
      n: 0.22
    }
  },
  
  // Сталь
  {
    id: 'st08kp',
    name: '08кп',
    type: 'Сталь',
    properties: {
      sigmaB: 330,
      sigmaT: 200,
      psi: 60,
      density: 7.85,
      K: 600,
      n: 0.22
    }
  },
  {
    id: 'st10kp',
    name: '10кп',
    type: 'Сталь',
    properties: {
      sigmaB: 340,
      sigmaT: 210,
      psi: 55,
      density: 7.85,
      K: 620,
      n: 0.21
    }
  },
  {
    id: 'st20',
    name: '20',
    type: 'Сталь',
    properties: {
      sigmaB: 420,
      sigmaT: 250,
      psi: 50,
      density: 7.85,
      K: 700,
      n: 0.20
    }
  },
  {
    id: 'st45',
    name: '45',
    type: 'Сталь',
    properties: {
      sigmaB: 600,
      sigmaT: 350,
      psi: 40,
      density: 7.85,
      K: 850,
      n: 0.17
    }
  },
  {
    id: '12x18h10t',
    name: '12Х18Н10Т',
    type: 'Нержавеющая сталь',
    properties: {
      sigmaB: 550,
      sigmaT: 200,
      psi: 40,
      density: 7.9,
      K: 1200,
      n: 0.35
    }
  },
  
  // Титан и его сплавы
  {
    id: 'bt1-0',
    name: 'ВТ1-0',
    type: 'Титан',
    properties: {
      sigmaB: 400,
      sigmaT: 280,
      psi: 30,
      density: 4.51,
      K: 800,
      n: 0.12
    }
  },
  {
    id: 'ot4',
    name: 'ОТ4',
    type: 'Титановый сплав',
    properties: {
      sigmaB: 700,
      sigmaT: 550,
      psi: 20,
      density: 4.55,
      K: 1100,
      n: 0.10
    }
  }
];

export const getMaterialById = (id: string): Material | undefined => {
  return materials.find(m => m.id === id);
};

export const getMaterialsByType = (type: string): Material[] => {
  return materials.filter(m => m.type === type);
};

export const getMaterialTypes = (): string[] => {
  return [...new Set(materials.map(m => m.type))];
};
