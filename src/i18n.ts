type Language = 'pt' | 'en';

interface Translations {
  [key: string]: {
    pt: string;
    en: string;
  };
}

const translations: Translations = {
  'nav.design': {
    pt: 'Dimensionar Novo',
    en: 'Design New',
  },
  'nav.existing': {
    pt: 'Já Tenho Medidas',
    en: 'Existing Parachute',
  },
  'app.title': {
    pt: 'ParaCalc - Calculadora de Paraquedas',
    en: 'ParaCalc - Parachute Calculator',
  },
  'page.design.subtitle': {
    pt: 'Dimensionar um novo paraquedas | CanSat Junior',
    en: 'Design a new parachute | CanSat Junior',
  },
  'page.existing.subtitle': {
    pt: 'Analisar paraquedas existente | CanSat Junior',
    en: 'Analyze existing parachute | CanSat Junior',
  },
  'section.parameters': {
    pt: 'Parâmetros',
    en: 'Parameters',
  },
  'section.results': {
    pt: 'Resultados',
    en: 'Results',
  },
  'section.data': {
    pt: 'Dados do Paraquedas',
    en: 'Parachute Data',
  },
  'section.simulation': {
    pt: 'Resultados da Simulação',
    en: 'Simulation Results',
  },
  'section.summary': {
    pt: 'Resumo',
    en: 'Summary',
  },
  'label.mass': {
    pt: 'Massa (g)',
    en: 'Mass (g)',
  },
  'label.area': {
    pt: 'Área do Paraquedas (cm²)',
    en: 'Parachute Area (cm²)',
  },
  'label.dragCoeff': {
    pt: 'k - Coeficiente de Atrito',
    en: 'k - Drag Coefficient',
  },
  'label.altitude': {
    pt: 'Altitude de Abertura (m)',
    en: 'Deployment Altitude (m)',
  },
  'label.airDensity': {
    pt: 'Densidade do Ar (kg/m³)',
    en: 'Air Density (kg/m³)',
  },
  'label.hasHole': {
    pt: 'Com chaminé (buraco)',
    en: 'With hole (vent)',
  },
  'label.holeRadius': {
    pt: 'Raio da Chaminé (cm)',
    en: 'Vent Radius (cm)',
  },
  'label.targetVelocity': {
    pt: 'Velocidade Alvo (m/s)',
    en: 'Target Velocity (m/s)',
  },
  'stat.terminal': {
    pt: 'm/s Terminal',
    en: 'm/s Terminal',
  },
  'stat.terminalKmh': {
    pt: 'km/h Terminal',
    en: 'km/h Terminal',
  },
  'stat.fallTime': {
    pt: 'Tempo Queda (s)',
    en: 'Fall Time (s)',
  },
  'stat.fallTimeMin': {
    pt: 'Tempo Queda (min)',
    en: 'Fall Time (min)',
  },
  'stat.diameter': {
    pt: 'Diâmetro',
    en: 'Diameter',
  },
  'stat.radius': {
    pt: 'Raio',
    en: 'Radius',
  },
  'stat.area': {
    pt: 'Área Paraquedas',
    en: 'Parachute Area',
  },
  'stat.holeArea': {
    pt: 'Área Chaminé',
    en: 'Hole Area',
  },
  'stat.effectiveArea': {
    pt: 'Área Efetiva',
    en: 'Effective Area',
  },
  'hint.dragCoeff': {
    pt: 'Paraquedas circular: 0.75-0.80',
    en: 'Circular parachute: 0.75-0.80',
  },
  'hint.airDensity': {
    pt: '1.225 = nível mar',
    en: '1.225 = sea level',
  },
  'hint.hole': {
    pt: 'Reduz a área efetiva',
    en: 'Reduces effective area',
  },
  'hint.totalMass': {
    pt: 'Paraquedas + carga + fios',
    en: 'Parachute + payload + strings',
  },
  'hint.area': {
    pt: 'm² | Ø',
    en: 'm² | Ø',
  },
  'summary.parachute': {
    pt: 'Paraquedas:',
    en: 'Parachute:',
  },
  'summary.vent': {
    pt: 'Chaminé:',
    en: 'Vent:',
  },
  'summary.fall': {
    pt: 'Queda:',
    en: 'Fall:',
  },
  'summary.mass': {
    pt: 'Massa:',
    en: 'Mass:',
  },
};

export const useTranslation = (lang: Language) => {
  return (key: string): string => {
    return translations[key]?.[lang] || key;
  };
};

export type { Language };
