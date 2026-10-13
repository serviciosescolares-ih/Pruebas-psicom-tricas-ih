export type PsychosocialOption = 0 | 1 | 2 | 3 | 4;

export interface PsychosocialOptionDef {
  value: PsychosocialOption;
  label: string;
  shortLabel: string;
  points: number;
  description: string;
}

export const PSYCHOSOCIAL_OPTIONS: PsychosocialOptionDef[] = [
  { value: 0, label: 'Nunca', shortLabel: '0 - Nunca', points: 0, description: 'No ocurre jamás o no aplica en mi experiencia' },
  { value: 1, label: 'Casi nunca', shortLabel: '1 - Casi nunca', points: 1, description: 'Rara vez ocurre (menos de una vez al mes)' },
  { value: 2, label: 'Algunas veces', shortLabel: '2 - Algunas veces', points: 2, description: 'Ocurre ocasionalmente (algunas veces al mes)' },
  { value: 3, label: 'Casi siempre', shortLabel: '3 - Casi siempre', points: 3, description: 'Ocurre con frecuencia habitual (semanalmente)' },
  { value: 4, label: 'Siempre', shortLabel: '4 - Siempre', points: 4, description: 'Ocurre de forma continua o diaria' },
];

export type PsychosocialDimensionKey =
  | 'ambiente_entorno'
  | 'carga_ritmo'
  | 'control_autonomia'
  | 'liderazgo_relaciones'
  | 'balance_desgaste';

export interface PsychosocialQuestion {
  id: number;
  text: string;
  dimension: PsychosocialDimensionKey;
}

export type PsychosocialRiskCode =
  | 'NULO'
  | 'BAJO'
  | 'MEDIO'
  | 'ALTO'
  | 'MUY_ALTO';

export interface PsychosocialRiskLevel {
  code: PsychosocialRiskCode;
  label: string;
  friendlyTitle: string;
  minScore: number;
  maxScore: number;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  barColor: string;
  officialDescription: string;
  teachingImplication: string;
  recommendations: string[];
}

export interface PsychosocialDimensionDefinition {
  key: PsychosocialDimensionKey;
  name: string;
  shortName: string;
  questionIds: number[];
  description: string;
  teachingRelevance: string;
  preventiveAdvice: string;
}

export interface PsychosocialRecord {
  id: string;
  timestamp: string;
  folio: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  emphasis: string;
  totalScore: number; // 0 to 140
  maxPossibleScore: number; // 140
  percentage: number; // 0 to 100%
  level: PsychosocialRiskLevel;
  dimensions: {
    ambiente_entorno: { score: number; maxScore: number; percentage: number; riskLevel: string };
    carga_ritmo: { score: number; maxScore: number; percentage: number; riskLevel: string };
    control_autonomia: { score: number; maxScore: number; percentage: number; riskLevel: string };
    liderazgo_relaciones: { score: number; maxScore: number; percentage: number; riskLevel: string };
    balance_desgaste: { score: number; maxScore: number; percentage: number; riskLevel: string };
  };
  answers: Record<number, PsychosocialOption>;
}

export const PSYCHOSOCIAL_DIMENSIONS: Record<PsychosocialDimensionKey, PsychosocialDimensionDefinition> = {
  ambiente_entorno: {
    key: 'ambiente_entorno',
    name: 'Condiciones del Entorno Físico y Recursos',
    shortName: 'Entorno y Recursos',
    questionIds: [1, 2, 3, 4, 5, 6, 7],
    description: 'Evalúa la exposición a ruido, ergonomía precaria, falta de equipamiento y materiales necesarios para la labor de enseñanza y aprendizaje.',
    teachingRelevance: 'En laboratorios de idiomas y aulas bilingües, el ruido excesivo y la falta de equipo audiovisual aumentan la fatiga vocal y el estrés del docente.',
    preventiveAdvice: 'Asegurar mantenimiento oportuno de tecnologías de audio/video, ventilación adecuada y ergonomía del mobiliario docente.',
  },
  carga_ritmo: {
    key: 'carga_ritmo',
    name: 'Carga Mental y Ritmo de Trabajo',
    shortName: 'Carga y Ritmo',
    questionIds: [8, 9, 10, 11, 12, 13, 14],
    description: 'Mide la sobrecarga cuantitativa de tareas, la prisa constante, la exigencia de concentración simultánea y el esfuerzo mental sostenido.',
    teachingRelevance: 'La planeación de clases en dos idiomas, evaluación de redacción bilingüe y preparación de exámenes demanda alto esfuerzo atencional.',
    preventiveAdvice: 'Distribuir fechas de entrega de proyectos, utilizar rúbricas de evaluación sistematizadas y tomar pausas activas programadas.',
  },
  control_autonomia: {
    key: 'control_autonomia',
    name: 'Falta de Control y Limitación de Autonomía',
    shortName: 'Control y Autonomía',
    questionIds: [15, 16, 17, 18, 19, 20, 21],
    description: 'Explora la sensación de rigidez, falta de participación en decisiones metodológicas, imposición de tiempos y escaso margen para innovar.',
    teachingRelevance: 'La pedagogía lingüística florece cuando el maestro tiene libertad para adaptar materiales auténticos y dinámicas comunicativas a su grupo.',
    preventiveAdvice: 'Incentivar la co-creación de programas, autonomía pedagógica y libertad para elegir metodologías interactivas de enseñanza.',
  },
  liderazgo_relaciones: {
    key: 'liderazgo_relaciones',
    name: 'Liderazgo y Relaciones Interpersonales',
    shortName: 'Liderazgo y Clima',
    questionIds: [22, 23, 24, 25, 26, 27, 28],
    description: 'Analiza la calidad de la convivencia, trabajo en equipo, apoyo social entre pares, claridad en instrucciones y trato con directivos o coordinadores.',
    teachingRelevance: 'Un claustro docente colaborativo y empático amortigua el estrés y fomenta el intercambio de mejores prácticas de enseñanza en idiomas.',
    preventiveAdvice: 'Fomentar círculos docentes de apoyo mutuo, comunicación asertiva y reconocimiento horizontal entre colegas.',
  },
  balance_desgaste: {
    key: 'balance_desgaste',
    name: 'Interferencia Vida-Trabajo y Desgaste Psicoemocional',
    shortName: 'Balance y Desgaste',
    questionIds: [29, 30, 31, 32, 33, 34, 35],
    description: 'Valora la invasión de deberes académicos/laborales sobre el tiempo personal, la dificultad para descansar y la fatiga emocional acumulada.',
    teachingRelevance: 'El burnout o fatiga docente afecta directamente la paciencia pedagógica, la empatía hacia el alumno y la calidad de la pronunciación e interacción.',
    preventiveAdvice: 'Establecer límites estrictos de desconexión digital fuera de horario escolar, higiene del sueño y actividades recreativas.',
  },
};

export const PSYCHOSOCIAL_QUESTIONS: PsychosocialQuestion[] = [
  { id: 1, text: 'En mi espacio habitual de estudio o trabajo, el ruido ambiental dificulta mi concentración o la comunicación clara.', dimension: 'ambiente_entorno' },
  { id: 2, text: 'La iluminación, temperatura o ventilación del lugar donde realizo mis actividades académicas me resultan incómodas o sofocantes.', dimension: 'ambiente_entorno' },
  { id: 3, text: 'Carezco de los recursos tecnológicos, materiales didácticos o conectividad adecuada para desempeñar mis labores con eficiencia.', dimension: 'ambiente_entorno' },
  { id: 4, text: 'El mobiliario (silla, mesa o espacio físico) me provoca molestias físicas, tensión en espalda/cuello o incomodidad postural.', dimension: 'ambiente_entorno' },
  { id: 5, text: 'Siento que las instalaciones no ofrecen condiciones suficientes de seguridad o privacidad para trabajar tranquilamente.', dimension: 'ambiente_entorno' },
  { id: 6, text: 'Debo invertir tiempo excesivo en solucionar fallas de equipo o plataformas digitales antes de poder iniciar mis actividades.', dimension: 'ambiente_entorno' },
  { id: 7, text: 'El desorden o la falta de espacio adecuado para mis materiales de idiomas me genera frustración o pérdida de tiempo.', dimension: 'ambiente_entorno' },
  { id: 8, text: 'La cantidad de tareas, lecturas o proyectos asignados sobrepasa el tiempo real del que dispongo para completarlos.', dimension: 'carga_ritmo' },
  { id: 9, text: 'Debo trabajar con un ritmo acelerado y bajo presión continua de plazos de entrega muy ajustados.', dimension: 'carga_ritmo' },
  { id: 10, text: 'Tengo que realizar varias actividades complejas de manera simultánea sin poder concluir una antes de empezar otra.', dimension: 'carga_ritmo' },
  { id: 11, text: 'Mis actividades me exigen un esfuerzo mental y de concentración prolongado durante varias horas continuas sin descanso.', dimension: 'carga_ritmo' },
  { id: 12, text: 'Siento que el nivel de exigencia técnica o lingüística requerida supera con frecuencia mi preparación actual.', dimension: 'carga_ritmo' },
  { id: 13, text: 'Debo memorizar y procesar un volumen excesivo de información detallada en lapsos muy breves.', dimension: 'carga_ritmo' },
  { id: 14, text: 'Termino mi jornada académica o laboral con una sensación de agotamiento mental o embotamiento cognitivo.', dimension: 'carga_ritmo' },
  { id: 15, text: 'Tengo poco margen de decisión sobre el orden o los métodos que empleo para realizar mis tareas o clases.', dimension: 'control_autonomia' },
  { id: 16, text: 'Se me imponen reglas excesivamente rígidas que limitan mi creatividad y propuesta de nuevas ideas pedagógicas.', dimension: 'control_autonomia' },
  { id: 17, text: 'Me resulta difícil o imposible tomar pausas breves cuando siento fatiga física o mental durante mis labores.', dimension: 'control_autonomia' },
  { id: 18, text: 'Rara vez se toma en cuenta mi opinión al planificar horarios, calendarios de evaluación o actividades grupales.', dimension: 'control_autonomia' },
  { id: 19, text: 'Mis actividades se vuelven monótonas o repetitivas, sin oportunidades para aprender o aplicar nuevas habilidades.', dimension: 'control_autonomia' },
  { id: 20, text: 'Siento incertidumbre porque las metas, instrucciones o criterios de evaluación cambian sin aviso previo.', dimension: 'control_autonomia' },
  { id: 21, text: 'Tengo que pedir autorización constante para resolver situaciones imprevistas o cotidianas en mi entorno formativo.', dimension: 'control_autonomia' },
  { id: 22, text: 'Percibo un ambiente de competencia poco saludable o desconfianza entre mis compañeros o colegas.', dimension: 'liderazgo_relaciones' },
  { id: 23, text: 'La comunicación con directivos, coordinadores o profesores es poco clara, distante o genera malentendidos.', dimension: 'liderazgo_relaciones' },
  { id: 24, text: 'Cuando enfrento una dificultad académica o profesional, me resulta difícil recibir apoyo solidario de mi equipo.', dimension: 'liderazgo_relaciones' },
  { id: 25, text: 'He presenciado o experimentado comentarios descalificadores, críticas poco constructivas o falta de respeto.', dimension: 'liderazgo_relaciones' },
  { id: 26, text: 'Siento que el esfuerzo y compromiso que pongo en mis actividades rara vez es valorado o reconocido por otros.', dimension: 'liderazgo_relaciones' },
  { id: 27, text: 'Existen conflictos no resueltos en el grupo que entorpecen la colaboración y el trabajo pedagógico.', dimension: 'liderazgo_relaciones' },
  { id: 28, text: 'Me cuesta trabajo expresar mis dudas o desacuerdos por temor a ser juzgado, criticado o sancionado.', dimension: 'liderazgo_relaciones' },
  { id: 29, text: 'Las exigencias académicas o de trabajo me obligan con frecuencia a sacrificar mis horas de sueño o descanso.', dimension: 'balance_desgaste' },
  { id: 30, text: 'Suelo recibir mensajes, correos o tareas fuera de mi horario habitual que me impiden desconectarme mentalmente.', dimension: 'balance_desgaste' },
  { id: 31, text: 'El tiempo que dedico a mis responsabilidades formativas afecta negativamente mi convivencia familiar o social.', dimension: 'balance_desgaste' },
  { id: 32, text: 'Incluso en mis días libres, sigo pensando con preocupación en los pendientes o evaluaciones pendientes.', dimension: 'balance_desgaste' },
  { id: 33, text: 'He experimentado síntomas físicos vinculados al estrés (dolores de cabeza, tensión muscular, problemas gástricos).', dimension: 'balance_desgaste' },
  { id: 34, text: 'Me siento irritable, impaciente o con desánimo al inicio de mis actividades académicas cotidianas.', dimension: 'balance_desgaste' },
  { id: 35, text: 'Siento que mi energía personal se agota con facilidad y que los fines de semana no me bastan para recuperarme.', dimension: 'balance_desgaste' },
];

export const PSYCHOSOCIAL_RISK_LEVELS: Record<PsychosocialRiskCode, PsychosocialRiskLevel> = {
  NULO: {
    code: 'NULO',
    label: 'Riesgo Nulo o Despreciable',
    friendlyTitle: 'Bienestar Óptimo y Clima Saludable',
    minScore: 0,
    maxScore: 28,
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-500',
    barColor: '#10b981',
    officialDescription:
      'La persona percibe condiciones altamente favorables en su entorno, carga balanceada, excelente autonomía y relaciones interpersonales armónicas. El nivel de estrés es mínimo y plenamente adaptativo.',
    teachingImplication:
      'Perfil idóneo para la labor docente en lenguas extranjeras. Manifiesta alta vitalidad, filtro afectivo abierto, paciencia pedagógica y capacidad para sostener dinámicas bilingües entusiastas.',
    recommendations: [
      'Mantener los hábitos de organización y autocuidado que han demostrado eficacia.',
      'Aprovechar la alta energía para innovar en proyectos metodológicos e investigación lingüística.',
      'Apoyar a compañeros que puedan estar experimentando mayores niveles de sobrecarga.',
    ],
  },
  BAJO: {
    code: 'BAJO',
    label: 'Riesgo Bajo',
    friendlyTitle: 'Bienestar Favorable y Manejo Adecuado',
    minScore: 29,
    maxScore: 56,
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-500',
    barColor: '#14b8a6',
    officialDescription:
      'Se observan factores estresores de baja intensidad que son manejados de forma efectiva mediante recursos personales de adaptación. Las condiciones generales son estables y propicias.',
    teachingImplication:
      'Buen desempeño frente al grupo y en la interacción comunicativa en inglés/español. Las presiones académicas se resuelven satisfactoriamente sin generar agotamiento crónico.',
    recommendations: [
      'Reforzar la gestión del tiempo ante semanas de evaluación o entregas intensas.',
      'Sostener pausas activas durante jornadas prolongadas de planeación didáctica.',
      'Fomentar canales de comunicación abierta con coordinadores y compañeros.',
    ],
  },
  MEDIO: {
    code: 'MEDIO',
    label: 'Riesgo Medio / Moderado',
    friendlyTitle: 'Alerta Preventiva de Desgaste',
    minScore: 57,
    maxScore: 84,
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-500',
    barColor: '#f59e0b',
    officialDescription:
      'Presencia notable de factores de tensión en una o más dimensiones (carga, ritmo, recursos o relaciones). Requiere medidas preventivas para evitar que el estrés evolucione a fatiga crónica.',
    teachingImplication:
      'Puede manifestar momentos de irritabilidad, cansancio vocal o disminución transitoria en el entusiasmo didáctico ante grupos demandantes. Es oportuno ajustar la distribución de tareas.',
    recommendations: [
      'Calendarizar descansos obligatorios y limitar el uso de dispositivos en horarios de descanso.',
      'Solicitar retroalimentación o apoyo cuando la carga de proyectos resulte excesiva.',
      'Participar en talleres de resiliencia y técnicas de manejo del estrés para educadores.',
    ],
  },
  ALTO: {
    code: 'ALTO',
    label: 'Riesgo Alto',
    friendlyTitle: 'Tensión Significativa (Intervención Sugerida)',
    minScore: 85,
    maxScore: 112,
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-500',
    barColor: '#f97316',
    officialDescription:
      'Nivel significativo de sobrecarga, interferencia con la vida personal y posible tensión interpersonal. Existe vulnerabilidad a manifestaciones psicosomáticas y desmotivación.',
    teachingImplication:
      'Riesgo directo sobre la paciencia pedagógica y la fluidez en el aula. El agotamiento puede mermar la calidad de la retroalimentación a los estudiantes e incrementar la ansiedad ante errores.',
    recommendations: [
      'Reestructurar de inmediato el cronograma de actividades académicas/laborales.',
      'Buscar asesoría psicopedagógica o tutoría institucional para priorizar tareas críticas.',
      'Establecer acuerdos de convivencia y desconexión digital con el equipo de trabajo.',
    ],
  },
  MUY_ALTO: {
    code: 'MUY_ALTO',
    label: 'Riesgo Muy Alto / Crítico',
    friendlyTitle: 'Sobrecarga Severa (Atención Prioritaria)',
    minScore: 113,
    maxScore: 140,
    badgeBg: 'bg-red-100 text-red-800 border-red-300',
    textColor: 'text-red-700',
    borderColor: 'border-red-500',
    barColor: '#ef4444',
    officialDescription:
      'Situación crítica de desgaste psicofísico con afectación sustancial en múltiples dimensiones. Elevado riesgo de síndrome de burnout, fatiga extrema y aislamiento.',
    teachingImplication:
      'Compromiso severo de la salud docente y formativa. Se requiere intervención de apoyo institucional antes de someter al docente a ambientes educativos de alta presión.',
    recommendations: [
      'Canalización inmediata a servicios de orientación psicológica y salud ocupacional.',
      'Ajuste temporal de cargas académicas y exención de compromisos extraordinarios.',
      'Implementar un plan de acompañamiento integral y reincorporación gradual y saludable.',
    ],
  },
};

export function getPsychosocialRiskLevel(score: number): PsychosocialRiskLevel {
  if (score <= 28) return PSYCHOSOCIAL_RISK_LEVELS.NULO;
  if (score <= 56) return PSYCHOSOCIAL_RISK_LEVELS.BAJO;
  if (score <= 84) return PSYCHOSOCIAL_RISK_LEVELS.MEDIO;
  if (score <= 112) return PSYCHOSOCIAL_RISK_LEVELS.ALTO;
  return PSYCHOSOCIAL_RISK_LEVELS.MUY_ALTO;
}

export function getDimensionRiskLabel(percentage: number): { label: string; color: string } {
  if (percentage <= 20) return { label: 'Riesgo Nulo / Excelente', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  if (percentage <= 40) return { label: 'Riesgo Bajo / Favorable', color: 'text-teal-600 bg-teal-50 border-teal-200' };
  if (percentage <= 60) return { label: 'Riesgo Medio / Alerta', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  if (percentage <= 80) return { label: 'Riesgo Alto / Tensión', color: 'text-orange-600 bg-orange-50 border-orange-200' };
  return { label: 'Riesgo Crítico / Severo', color: 'text-red-600 bg-red-50 border-red-200' };
}

export function calculatePsychosocialScores(
  answers: Record<number, PsychosocialOption>,
  candidateData: {
    folio: string;
    name: string;
    gender: 'M' | 'F';
    age: number;
    emphasis: string;
  }
): PsychosocialRecord {
  const dimensionScores: Record<PsychosocialDimensionKey, { score: number; maxScore: number; percentage: number; riskLevel: string }> = {
    ambiente_entorno: { score: 0, maxScore: 28, percentage: 0, riskLevel: '' },
    carga_ritmo: { score: 0, maxScore: 28, percentage: 0, riskLevel: '' },
    control_autonomia: { score: 0, maxScore: 28, percentage: 0, riskLevel: '' },
    liderazgo_relaciones: { score: 0, maxScore: 28, percentage: 0, riskLevel: '' },
    balance_desgaste: { score: 0, maxScore: 28, percentage: 0, riskLevel: '' },
  };

  let totalScore = 0;
  for (const q of PSYCHOSOCIAL_QUESTIONS) {
    const val = answers[q.id] ?? 0;
    dimensionScores[q.dimension].score += val;
    totalScore += val;
  }

  for (const key of Object.keys(dimensionScores) as PsychosocialDimensionKey[]) {
    const dim = dimensionScores[key];
    dim.percentage = Math.round((dim.score / dim.maxScore) * 100);
    dim.riskLevel = getDimensionRiskLabel(dim.percentage).label;
  }

  const maxPossibleScore = 140; // 35 * 4
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  const level = getPsychosocialRiskLevel(totalScore);

  return {
    id: `PSICO-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    folio: candidateData.folio,
    name: candidateData.name,
    gender: candidateData.gender,
    age: candidateData.age,
    emphasis: candidateData.emphasis,
    totalScore,
    maxPossibleScore,
    percentage,
    level,
    dimensions: dimensionScores,
    answers,
  };
}

export function generateSamplePsychosocialAnswers(): Record<number, PsychosocialOption> {
  const sample: Record<number, PsychosocialOption> = {};
  for (let i = 1; i <= 35; i++) {
    const rand = Math.random();
    if (rand < 0.40) {
      sample[i] = 0;
    } else if (rand < 0.70) {
      sample[i] = 1;
    } else if (rand < 0.88) {
      sample[i] = 2;
    } else if (rand < 0.96) {
      sample[i] = 3;
    } else {
      sample[i] = 4;
    }
  }
  return sample;
}
