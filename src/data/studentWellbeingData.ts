export type WellbeingLikertOption = 0 | 1 | 2 | 3 | 4;

export const LIKERT_LABELS: Record<WellbeingLikertOption, { label: string; short: string }> = {
  0: { label: 'Nunca', short: '0: Nunca' },
  1: { label: 'Rara vez', short: '1: Rara vez' },
  2: { label: 'A veces', short: '2: A veces' },
  3: { label: 'Con frecuencia', short: '3: Con frecuencia' },
  4: { label: 'Casi siempre', short: '4: Casi siempre' },
};

export type WellbeingAreaCode = 'EMO' | 'SOC' | 'CON' | 'DIG' | 'ACA';

export interface WellbeingItem {
  id: number;
  code: string;
  area: WellbeingAreaCode;
  text: string;
  isInverse: boolean;
}

export interface ValidityItem {
  id: string;
  text: string;
  expected: string;
}

export interface CriticalItem {
  id: string;
  text: string;
}

export type SemaforoLevel = 'VERDE' | 'AMARILLO' | 'NARANJA' | 'ROJO' | 'ALERTA_CRITICA';

export interface AreaScoreResult {
  code: WellbeingAreaCode;
  name: string;
  rawScore: number;
  maxScore: number;
  index: number;
  level: 'Bajo' | 'Moderado' | 'Alto' | 'Muy alto';
  color: string;
  description: string;
  actions: string;
}

export interface StudentWellbeingRecord {
  id: string;
  timestamp: string;
  folio: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  emphasis: string;
  irp: number;
  semaforo: {
    level: SemaforoLevel;
    label: string;
    colorHex: string;
    badgeBg: string;
    textColor: string;
    ruleApplied: string;
    actionProtocol: string;
    timeline: string;
  };
  areas: Record<WellbeingAreaCode, AreaScoreResult>;
  criticalAlerts: {
    hasActiveAlert: boolean;
    activeItems: { code: string; text: string; value: number }[];
    action: string;
  };
  validity: {
    attentionAlert: boolean;
    socialDesirabilityAlert: boolean;
    inconsistencyAlert: boolean;
    notes: string[];
  };
  answers: Record<number, WellbeingLikertOption>;
  validityAnswers: Record<string, WellbeingLikertOption>;
  criticalAnswers: Record<string, WellbeingLikertOption>;
}

export const WELLBEING_AREAS_META: Record<
  WellbeingAreaCode,
  { name: string; maxScore: number; description: string; actions: Record<string, string> }
> = {
  EMO: {
    name: 'Bienestar Emocional y Salud Mental',
    maxScore: 40,
    description: 'Ansiedad, ánimo, estrés, regulación emocional, autoestima y esperanza.',
    actions: {
      Bajo: 'El aspirante cuenta con recursos adecuados para afrontar la carga habitual universitaria.',
      Moderado: 'Ofrecer psicoeducación sobre manejo del estrés y dar a conocer los servicios de tutoría.',
      Alto: 'Probable sintomatología de ansiedad o ánimo bajo que puede afectar concentración. Entrevista con psicología en las primeras semanas.',
      'Muy alto': 'Entrevista prioritaria (24 a 72 horas) y canalización a atención especializada.',
    },
  },
  SOC: {
    name: 'Condiciones Socioeconómicas y Familiares',
    maxScore: 32,
    description: 'Precariedad, carga laboral y de cuidado, clima familiar, eventos vitales y apoyo familiar.',
    actions: {
      Bajo: 'Condiciones de entorno y apoyo familiar favorables para el estudio.',
      Moderado: 'Informar sobre convocatorias de becas, descuentos, horarios y apoyos institucionales.',
      Alto: 'Riesgo de deserción por carga económica o familiar. Entrevista con tutoría para gestión de apoyos o flexibilidad.',
      'Muy alto': 'Alto riesgo socioeconómico. Coordinación inmediata con tutoría y psicología si hay conflicto familiar severo.',
    },
  },
  CON: {
    name: 'Convivencia, Entorno y Redes de Apoyo',
    maxScore: 32,
    description: 'Acoso, discriminación, violencia, soledad, integración y confianza en otros.',
    actions: {
      Bajo: 'Buenas redes de apoyo y percepción de seguridad e integración social.',
      Moderado: 'Actividades de bienvenida, integración grupal y asignación de tutor(a) de pares.',
      Alto: 'Posible exposición a discriminación, acoso o aislamiento. Entrevista con psicología y revisión de protocolos de seguridad.',
      'Muy alto': 'Situación de riesgo en convivencia o violencia. Activar protocolo institucional y brindar servicios de acompañamiento.',
    },
  },
  DIG: {
    name: 'Hábitos Digitales, Sueño y Conductas de Riesgo',
    maxScore: 32,
    description: 'Uso problemático de pantallas, sueño, consumo de sustancias y actividad física.',
    actions: {
      Bajo: 'Hábitos equilibrados de descanso y uso consciente de pantallas.',
      Moderado: 'Orientación en higiene del sueño, uso consciente de redes sociales y organización del tiempo.',
      Alto: 'Patrón problemático que puede afectar asistencia y rendimiento. Intervención breve motivacional sin juicio moral.',
      'Muy alto': 'Afectación significativa en descanso o consumo de sustancias. Canalización y plan de acompañamiento de salud integral.',
    },
  },
  ACA: {
    name: 'Adaptación Académica y Proyecto Vocacional',
    maxScore: 32,
    description: 'Elección de carrera, autoeficacia, hábitos de estudio, ansiedad ante el inglés y persistencia.',
    actions: {
      Bajo: 'Seguridad vocacional y hábitos académicos favorables para la carrera.',
      Moderado: 'Talleres de técnicas de estudio, gestión del tiempo y expresión oral.',
      Alto: 'Dudas vocacionales o ansiedad ante el idioma inglés. Tutoría académica personalizada y acompañamiento en práctica oral.',
      'Muy alto': 'Riesgo inminente de abandono por dudas o desorganización. Orientación vocacional intensiva y tutoría asignada.',
    },
  },
};

export const WELLBEING_ITEMS: WellbeingItem[] = [
  { id: 1, code: '1', area: 'EMO', text: 'Me he sentido nervioso(a), tenso(a) o al límite.', isInverse: false },
  { id: 2, code: '2', area: 'EMO', text: 'No he podido dejar de preocuparme por muchas cosas a la vez.', isInverse: false },
  { id: 3, code: '3', area: 'EMO', text: 'Me he sentido triste o sin ánimo la mayor parte del día.', isInverse: false },
  { id: 4, code: '4', area: 'EMO', text: 'He perdido el interés o el gusto por actividades que antes disfrutaba.', isInverse: false },
  { id: 5, code: '5', area: 'EMO', text: 'Me he sentido agotado(a) emocionalmente aunque no haya hecho mucho esfuerzo.', isInverse: false },
  { id: 6, code: '6', area: 'EMO', text: 'Me ha costado trabajo calmarme cuando algo me altera.', isInverse: false },
  { id: 7, code: '7', area: 'EMO', text: 'Me ha costado concentrarme por mis preocupaciones o mi estado de ánimo.', isInverse: false },
  { id: 8, code: '8', area: 'EMO', text: 'He sentido que no valgo lo suficiente o que soy un fracaso.', isInverse: false },
  { id: 9, code: '9', area: 'EMO', text: 'Cuando tengo un problema, siento que puedo encontrar la manera de manejarlo.', isInverse: true },
  { id: 10, code: '10', area: 'EMO', text: 'Me he sentido con esperanza respecto a mi futuro.', isInverse: true },
  { id: 11, code: '11', area: 'SOC', text: 'Me preocupa no tener dinero suficiente para transporte, materiales o colegiatura.', isInverse: false },
  { id: 12, code: '12', area: 'SOC', text: 'Trabajo o genero ingresos de forma que me quita tiempo de estudio o descanso.', isInverse: false },
  { id: 13, code: '13', area: 'SOC', text: 'Tengo responsabilidades de cuidado (hermanos, familiares, hogar) que limitan mi tiempo.', isInverse: false },
  { id: 14, code: '14', area: 'SOC', text: 'En mi casa hay discusiones o tensión frecuente que me afectan.', isInverse: false },
  { id: 15, code: '15', area: 'SOC', text: 'Tengo un lugar tranquilo y los medios (internet, equipo) para estudiar.', isInverse: true },
  { id: 16, code: '16', area: 'SOC', text: 'Mi familia apoya mi decisión de estudiar esta licenciatura.', isInverse: true },
  { id: 17, code: '17', area: 'SOC', text: 'Un cambio reciente (mudanza, separación familiar, pérdida de un ser querido, enfermedad) sigue afectándome.', isInverse: false },
  { id: 18, code: '18', area: 'SOC', text: 'Me preocupa mi seguridad en el lugar donde vivo o en mis traslados.', isInverse: false },
  { id: 19, code: '19', area: 'CON', text: 'Me han hecho burlas, insultos o humillaciones, en persona o en redes.', isInverse: false },
  { id: 20, code: '20', area: 'CON', text: 'Me he sentido excluido(a) o discriminado(a) por mi origen, apariencia, identidad u orientación.', isInverse: false },
  { id: 21, code: '21', area: 'CON', text: 'He vivido situaciones de violencia (física, verbal o psicológica) en mi familia o entorno cercano.', isInverse: false },
  { id: 22, code: '22', area: 'CON', text: 'Me he sentido controlado(a) o presionado(a) por una pareja o persona cercana.', isInverse: false },
  { id: 23, code: '23', area: 'CON', text: 'Me cuesta hacer amistades o integrarme a grupos nuevos.', isInverse: false },
  { id: 24, code: '24', area: 'CON', text: 'Me siento solo(a) aunque esté rodeado(a) de gente.', isInverse: false },
  { id: 25, code: '25', area: 'CON', text: 'Tengo al menos una persona de confianza a quien acudir cuando me siento mal.', isInverse: true },
  { id: 26, code: '26', area: 'CON', text: 'Me siento parte de un grupo (amistades, comunidad, actividades).', isInverse: true },
  { id: 27, code: '27', area: 'DIG', text: 'Paso más tiempo en el celular, redes o videojuegos del que quisiera y me cuesta reducirlo.', isInverse: false },
  { id: 28, code: '28', area: 'DIG', text: 'El uso de pantallas ha afectado mis estudios, mi sueño o mis relaciones.', isInverse: false },
  { id: 29, code: '29', area: 'DIG', text: 'Me siento ansioso(a) o irritable cuando no puedo revisar mi celular o mis redes.', isInverse: false },
  { id: 30, code: '30', area: 'DIG', text: 'Duermo menos de lo que necesito o mi sueño se interrumpe con frecuencia.', isInverse: false },
  { id: 31, code: '31', area: 'DIG', text: 'Al compararme con otras personas en redes, me siento mal conmigo.', isInverse: false },
  { id: 32, code: '32', area: 'DIG', text: 'He tomado alcohol en mayor cantidad de la que pretendía.', isInverse: false },
  { id: 33, code: '33', area: 'DIG', text: 'He usado tabaco, vapeadores u otras sustancias para relajarme o enfrentar el estrés.', isInverse: false },
  { id: 34, code: '34', area: 'DIG', text: 'Hago actividad física o recreativa regular fuera de las pantallas.', isInverse: true },
  { id: 35, code: '35', area: 'ACA', text: 'Estoy seguro(a) de mi elección de carrera.', isInverse: true },
  { id: 36, code: '36', area: 'ACA', text: 'Dudo de poder cumplir con las exigencias académicas de una licenciatura.', isInverse: false },
  { id: 37, code: '37', area: 'ACA', text: 'Me angustia mucho hablar en público o usar inglés frente a otras personas.', isInverse: false },
  { id: 38, code: '38', area: 'ACA', text: 'Tengo estrategias y hábitos para organizar mi tiempo de estudio.', isInverse: true },
  { id: 39, code: '39', area: 'ACA', text: 'En mis estudios anteriores he postergado entregas o bajado mi rendimiento por falta de organización.', isInverse: false },
  { id: 40, code: '40', area: 'ACA', text: 'Siento presión de mi familia o entorno por tener resultados perfectos o no fallar.', isInverse: false },
  { id: 41, code: '41', area: 'ACA', text: 'Me motiva la idea de llegar a ser docente de lenguas.', isInverse: true },
  { id: 42, code: '42', area: 'ACA', text: 'He pensado en abandonar los estudios que estoy por comenzar o que realicé antes.', isInverse: false },
];

export const VALIDITY_ITEMS: ValidityItem[] = [
  { id: 'V1', text: 'Nunca me he molestado con nadie.', expected: 'Deseabilidad social (esperado 0 a 2)' },
  { id: 'V2', text: 'Siempre cumplo todo lo que me propongo sin ninguna dificultad.', expected: 'Deseabilidad social (esperado 0 a 2)' },
  { id: 'V3', text: 'Para este reactivo, marca la opción "Con frecuencia".', expected: 'Atención (respuesta correcta = 3)' },
  { id: 'V4', text: 'Con frecuencia me siento sin ánimo.', expected: 'Consistencia con el reactivo 3' },
];

export const CRITICAL_ITEMS: CriticalItem[] = [
  { id: 'K1', text: 'He pensado que sería mejor no estar vivo(a) o he pensado en hacerme daño.' },
  { id: 'K2', text: 'Me he hecho daño a propósito para aliviar lo que siento.' },
  { id: 'K3', text: 'Me siento en peligro por la conducta de alguien cercano.' },
];

export function getAreaLevel(index: number): 'Bajo' | 'Moderado' | 'Alto' | 'Muy alto' {
  if (index < 30) return 'Bajo';
  if (index < 50) return 'Moderado';
  if (index < 70) return 'Alto';
  return 'Muy alto';
}

export function calculateWellbeingScores(
  answers: Record<number, WellbeingLikertOption>,
  validityAnswers: Record<string, WellbeingLikertOption>,
  criticalAnswers: Record<string, WellbeingLikertOption>,
  candidateData: {
    folio?: string;
    name: string;
    gender: 'M' | 'F';
    age?: number;
    emphasis?: string;
  }
): StudentWellbeingRecord {
  const areaRaw: Record<WellbeingAreaCode, number> = {
    EMO: 0,
    SOC: 0,
    CON: 0,
    DIG: 0,
    ACA: 0,
  };

  WELLBEING_ITEMS.forEach((item) => {
    const rawVal = answers[item.id] ?? 0;
    const finalVal = item.isInverse ? (4 - rawVal as WellbeingLikertOption) : rawVal;
    areaRaw[item.area] += finalVal;
  });

  const areasResult: Record<WellbeingAreaCode, AreaScoreResult> = {} as any;
  const areaCodes: WellbeingAreaCode[] = ['EMO', 'SOC', 'CON', 'DIG', 'ACA'];
  let sumIndices = 0;
  let countAlto = 0;
  let countMuyAlto = 0;
  let countModerado = 0;

  areaCodes.forEach((code) => {
    const meta = WELLBEING_AREAS_META[code];
    const raw = areaRaw[code];
    const index = Math.round((raw / meta.maxScore) * 100);
    sumIndices += index;
    const level = getAreaLevel(index);
    if (level === 'Muy alto') countMuyAlto++;
    else if (level === 'Alto') countAlto++;
    else if (level === 'Moderado') countModerado++;

    let color = '#10B981';
    if (level === 'Moderado') color = '#F59E0B';
    else if (level === 'Alto') color = '#F97316';
    else if (level === 'Muy alto') color = '#EF4444';

    areasResult[code] = {
      code,
      name: meta.name,
      rawScore: raw,
      maxScore: meta.maxScore,
      index,
      level,
      color,
      description: meta.description,
      actions: meta.actions[level] || '',
    };
  });

  const irp = Math.round(sumIndices / 5);

  const activeCriticalItems: { code: string; text: string; value: number }[] = [];
  CRITICAL_ITEMS.forEach((k) => {
    const val = criticalAnswers[k.id] ?? 0;
    if (val >= 1) {
      activeCriticalItems.push({ code: k.id, text: k.text, value: val });
    }
  });

  const hasCriticalAlert = activeCriticalItems.length > 0;

  let semaforoLevel: SemaforoLevel = 'VERDE';
  let semaforoLabel = 'Semáforo Verde – Nivel Preventivo Favorable';
  let colorHex = '#10B981';
  let badgeBg = 'bg-emerald-100 border-emerald-300 text-emerald-800';
  let textColor = 'text-emerald-700';
  let ruleApplied = 'IRP < 30 y ninguna área en nivel Alto o Muy Alto';
  let actionProtocol = 'Información general de servicios de bienestar e inducción.';
  let timeline = 'Fase de inducción académica';

  if (hasCriticalAlert) {
    semaforoLevel = 'ALERTA_CRITICA';
    semaforoLabel = 'Alerta Crítica de Apoyo Inmediato';
    colorHex = '#DC2626';
    badgeBg = 'bg-rose-100 border-rose-400 text-rose-900';
    textColor = 'text-rose-700';
    ruleApplied = 'Respuesta positiva en reactivos críticos de seguridad (K1, K2 o K3). Prevalece sobre el semáforo.';
    actionProtocol = activeCriticalItems.some((i) => i.code === 'K1' || i.code === 'K2')
      ? 'Contacto inmediato con el área de psicología para evaluación de contención y apoyo (mismo día).'
      : 'Entrevista prioritaria de seguridad y activación del protocolo de acompañamiento (dentro de 24 horas).';
    timeline = 'Mismo día / Primeras 24 horas';
  } else if (irp >= 70 || countMuyAlto >= 1 || countAlto + countMuyAlto >= 2) {
    semaforoLevel = 'ROJO';
    semaforoLabel = 'Semáforo Rojo – Acompañamiento Prioritario';
    colorHex = '#EF4444';
    badgeBg = 'bg-red-100 border-red-300 text-red-800';
    textColor = 'text-red-700';
    ruleApplied = 'IRP ≥ 70, o al menos un área en Muy Alto, o dos o más áreas en Alto/Muy Alto.';
    actionProtocol = 'Entrevista con el departamento de psicología y diseño de plan de acompañamiento integral.';
    timeline = 'Dentro de 72 horas';
  } else if (irp >= 50 || countAlto === 1) {
    semaforoLevel = 'NARANJA';
    semaforoLabel = 'Semáforo Naranja – Orientación Focalizada';
    colorHex = '#F97316';
    badgeBg = 'bg-orange-100 border-orange-300 text-orange-800';
    textColor = 'text-orange-700';
    ruleApplied = 'IRP de 50 a 69, o una área específica en nivel Alto.';
    actionProtocol = 'Entrevista breve de orientación, vinculación con apoyos específicos y seguimiento al mes.';
    timeline = 'Primeras 2 semanas';
  } else if (irp >= 30 || countModerado >= 1) {
    semaforoLevel = 'AMARILLO';
    semaforoLabel = 'Semáforo Amarillo – Monitoreo y Tutoría';
    colorHex = '#F59E0B';
    badgeBg = 'bg-amber-100 border-amber-300 text-amber-800';
    textColor = 'text-amber-700';
    ruleApplied = 'IRP de 30 a 49, o una o más áreas en nivel Moderado.';
    actionProtocol = 'Información sobre talleres preventivos, técnicas de estudio y asignación de tutor institucional.';
    timeline = 'Al inicio del semestre';
  }

  const v3Val = validityAnswers['V3'] ?? 0;
  const v1Val = validityAnswers['V1'] ?? 0;
  const v2Val = validityAnswers['V2'] ?? 0;
  const v4Val = validityAnswers['V4'] ?? 0;
  const q3Val = answers[3] ?? 0;

  const attentionAlert = v3Val !== 3;
  const socialDesirabilityAlert = v1Val >= 3 && v2Val >= 3;
  const inconsistencyAlert = Math.abs(q3Val - v4Val) >= 3;

  const validityNotes: string[] = [];
  if (attentionAlert) {
    validityNotes.push('Alerta de atención: El reactivo de control V3 no se contestó como se solicitó.');
  }
  if (socialDesirabilityAlert) {
    validityNotes.push('Posible deseabilidad social: Puntajes muy elevados en V1 y V2 (posible minimización del riesgo).');
  }
  if (inconsistencyAlert) {
    validityNotes.push('Inconsistencia en respuestas de estado de ánimo (diferencia notable entre reactivo 3 y V4).');
  }

  return {
    id: `ERPA-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    folio: candidateData.folio || `ERPA-${Math.floor(1000 + Math.random() * 9000)}`,
    name: candidateData.name.trim() || 'Aspirante Evaluado',
    gender: candidateData.gender,
    age: candidateData.age || 18,
    emphasis: candidateData.emphasis || 'Español e Inglés',
    irp,
    semaforo: {
      level: semaforoLevel,
      label: semaforoLabel,
      colorHex,
      badgeBg,
      textColor,
      ruleApplied,
      actionProtocol,
      timeline,
    },
    areas: areasResult,
    criticalAlerts: {
      hasActiveAlert: hasCriticalAlert,
      activeItems: activeCriticalItems,
      action: actionProtocol,
    },
    validity: {
      attentionAlert,
      socialDesirabilityAlert,
      inconsistencyAlert,
      notes: validityNotes,
    },
    answers,
    validityAnswers,
    criticalAnswers,
  };
}

export function generateSampleWellbeingAnswers(
  targetLevel: 'verde' | 'amarillo' | 'naranja' | 'rojo' | 'critico' = 'verde'
): {
  answers: Record<number, WellbeingLikertOption>;
  validityAnswers: Record<string, WellbeingLikertOption>;
  criticalAnswers: Record<string, WellbeingLikertOption>;
} {
  const ans: Record<number, WellbeingLikertOption> = {};
  WELLBEING_ITEMS.forEach((item) => {
    const roll = Math.random();
    let val: WellbeingLikertOption = 0;
    if (targetLevel === 'verde') {
      if (item.isInverse) {
        val = roll < 0.7 ? 3 : roll < 0.9 ? 4 : 2;
      } else {
        val = roll < 0.7 ? 0 : roll < 0.9 ? 1 : 2;
      }
    } else if (targetLevel === 'amarillo') {
      if (item.isInverse) {
        val = roll < 0.5 ? 2 : roll < 0.8 ? 3 : 1;
      } else {
        val = roll < 0.5 ? 1 : roll < 0.8 ? 2 : 0;
      }
    } else if (targetLevel === 'naranja') {
      if (item.isInverse) {
        val = roll < 0.5 ? 1 : roll < 0.8 ? 2 : 0;
      } else {
        val = roll < 0.5 ? 2 : roll < 0.8 ? 3 : 1;
      }
    } else {
      if (item.isInverse) {
        val = roll < 0.7 ? 0 : roll < 0.9 ? 1 : 2;
      } else {
        val = roll < 0.6 ? 3 : roll < 0.9 ? 4 : 2;
      }
    }
    ans[item.id] = val;
  });

  const valAns: Record<string, WellbeingLikertOption> = {
    V1: targetLevel === 'verde' ? 1 : 0,
    V2: targetLevel === 'verde' ? 1 : 0,
    V3: 3,
    V4: ans[3] ?? 1,
  };

  const critAns: Record<string, WellbeingLikertOption> = {
    K1: targetLevel === 'critico' ? 2 : 0,
    K2: 0,
    K3: targetLevel === 'critico' ? 1 : 0,
  };

  return {
    answers: ans,
    validityAnswers: valAns,
    criticalAnswers: critAns,
  };
}
