export type IEOption = 'nunca' | 'algunas_veces' | 'siempre';

export interface IEQuestion {
  id: number;
  text: string;
  dimension: 'autoconocimiento' | 'autocontrol' | 'automotivacion' | 'empatia' | 'habilidades_sociales';
}

export type IELevelCode = 'MUY_BAJO' | 'BAJO' | 'MEDIO_BAJO' | 'MEDIO_ALTO' | 'MUY_ALTO';

export interface IELevelDefinition {
  code: IELevelCode;
  label: string;
  minScore: number;
  maxScore: number;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  officialDescription: string;
  languageTeacherImplication: string;
}

export interface IEDimensionDefinition {
  key: 'autoconocimiento' | 'autocontrol' | 'automotivacion' | 'empatia' | 'habilidades_sociales';
  name: string;
  shortName: string;
  questionIds: number[];
  description: string;
  teachingRelevance: string;
}

export interface EmotionalIntelligenceRecord {
  id: string;
  timestamp: string;
  folio: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  emphasis: string;
  totalScore: number; // 0 to 90
  maxPossibleScore: number; // 90
  percentage: number; // 0 to 100%
  level: IELevelDefinition;
  dimensions: {
    autoconocimiento: { score: number; maxScore: number; percentage: number };
    autocontrol: { score: number; maxScore: number; percentage: number };
    automotivacion: { score: number; maxScore: number; percentage: number };
    empatia: { score: number; maxScore: number; percentage: number };
    habilidades_sociales: { score: number; maxScore: number; percentage: number };
  };
  answers: Record<number, IEOption>;
}

export const IE_DIMENSIONS: Record<string, IEDimensionDefinition> = {
  autoconocimiento: {
    key: 'autoconocimiento',
    name: 'Autoconocimiento Emocional',
    shortName: 'Autoconciencia',
    questionIds: [1, 5, 7, 10, 11, 17, 21, 26, 30, 34, 36],
    description: 'Capacidad para reconocer las propias emociones, fortalezas, debilidades, valores y metas personales.',
    teachingRelevance: 'Permite al docente de idiomas ser consciente de sus propias reacciones en clase y mantener seguridad frente al grupo.',
  },
  autocontrol: {
    key: 'autocontrol',
    name: 'Autocontrol y Regulación Emocional',
    shortName: 'Autocontrol',
    questionIds: [3, 8, 12, 14, 15, 27, 28, 31, 32, 37, 44],
    description: 'Habilidad para manejar impulsos, tolerar la frustración, modular el estrés y mantener la calma bajo presión.',
    teachingRelevance: 'Esencial para gestionar la disciplina en el aula, manejar el ruido y afrontar la ansiedad de los alumnos ante el error lingüístico.',
  },
  automotivacion: {
    key: 'automotivacion',
    name: 'Automotivación y Optimismo',
    shortName: 'Automotivación',
    questionIds: [2, 6, 9, 18, 19, 20, 22, 35, 43, 45],
    description: 'Impulso interno para aprender, superar dificultades, proponer ideas creativas y perseverar con actitud positiva.',
    teachingRelevance: 'Transmite entusiasmo por el aprendizaje del inglés y español, dinamiza las actividades y fomenta una atmósfera optimista.',
  },
  empatia: {
    key: 'empatia',
    name: 'Empatía y Sensibilidad Interpersonal',
    shortName: 'Empatía',
    questionIds: [16, 23, 39, 40, 41],
    description: 'Capacidad de percibir lo que otros sienten, sintonizar con sus estados emocionales y ver el mundo desde su perspectiva.',
    teachingRelevance: 'Clave para comprender las dificultades y el bloqueo afectivo (filtro afectivo de Krashen) de los estudiantes de lenguas.',
  },
  habilidades_sociales: {
    key: 'habilidades_sociales',
    name: 'Habilidades Sociales y Resolución de Conflictos',
    shortName: 'Habilidades Sociales',
    questionIds: [4, 13, 24, 25, 29, 33, 38, 42],
    description: 'Competencia para comunicarse con asertividad, dialogar ante desacuerdos, calmar tensiones y trabajar en equipo.',
    teachingRelevance: 'Facilita la interacción comunicativa constante en el idioma meta, el trabajo colegiado y la mediación constructiva.',
  },
};

export const IE_QUESTIONS: IEQuestion[] = [
  { id: 1, text: 'Me conozco a mí mismo, sé lo que pienso, lo que siento y lo que hago.', dimension: 'autoconocimiento' },
  { id: 2, text: 'Soy capaz de auto motivarme para aprender, estudiar, aprobar, conseguir algo.', dimension: 'automotivacion' },
  { id: 3, text: 'Cuando las cosas me van mal, mi estado de ánimo aguanta hasta que las cosas vayan mejor.', dimension: 'autocontrol' },
  { id: 4, text: 'Llego a acuerdos razonables con otras personas cuando tenemos posturas enfrentadas.', dimension: 'habilidades_sociales' },
  { id: 5, text: 'Sé qué cosas me ponen alegre y qué cosas me ponen triste.', dimension: 'autoconocimiento' },
  { id: 6, text: 'Sé lo que es más importante en cada momento.', dimension: 'automotivacion' },
  { id: 7, text: 'Cuando hago las cosas bien me felicito a mí mismo.', dimension: 'autoconocimiento' },
  { id: 8, text: 'Cuando los demás me provocan intencionadamente soy capaz de no responder.', dimension: 'autocontrol' },
  { id: 9, text: 'Me fijo en el lado positivo de las cosas, soy optimista.', dimension: 'automotivacion' },
  { id: 10, text: 'Controlo mis pensamientos, pienso lo que de verdad me interesa.', dimension: 'autoconocimiento' },
  { id: 11, text: 'Hablo conmigo mismo, en voz baja claro.', dimension: 'autoconocimiento' },
  { id: 12, text: 'Cuando me piden que diga o haga algo que me parece inaceptable me niego a hacerlo.', dimension: 'autocontrol' },
  { id: 13, text: 'Cuando alguien me critica injustamente me defiendo adecuadamente con el diálogo.', dimension: 'habilidades_sociales' },
  { id: 14, text: 'Cuando me critican por algo que es justo lo acepto porque tienen razón.', dimension: 'autocontrol' },
  { id: 15, text: 'Soy capaz de quitarme de la mente las preocupaciones que me obsesionan.', dimension: 'autocontrol' },
  { id: 16, text: 'Me doy cuenta de lo que dicen, piensan y sienten las personas más cercanas a mí (amigos, compañeros, familiares).', dimension: 'empatia' },
  { id: 17, text: 'Valoro las cosas buenas que hago.', dimension: 'autoconocimiento' },
  { id: 18, text: 'Soy capaz de divertirme y pasármelo bien allá donde esté.', dimension: 'automotivacion' },
  { id: 19, text: 'Hay cosas que no me gusta hacer pero sé que hay que hacerlas y las hago.', dimension: 'automotivacion' },
  { id: 20, text: 'Soy capaz de sonreír.', dimension: 'automotivacion' },
  { id: 21, text: 'Tengo confianza en mí mismo, en lo que soy capaz de hacer, pensar y sentir.', dimension: 'autoconocimiento' },
  { id: 22, text: 'Soy una persona activa, me gusta hacer cosas.', dimension: 'automotivacion' },
  { id: 23, text: 'Comprendo los sentimientos de los demás.', dimension: 'empatia' },
  { id: 24, text: 'Mantengo conversaciones con la gente.', dimension: 'habilidades_sociales' },
  { id: 25, text: 'Tengo buen sentido del humor.', dimension: 'habilidades_sociales' },
  { id: 26, text: 'Aprendo de los errores que cometo.', dimension: 'autoconocimiento' },
  { id: 27, text: 'En momentos de tensión y ansiedad soy capaz de relajarme y tranquilizarme para no perder el control y actuar apresuradamente.', dimension: 'autocontrol' },
  { id: 28, text: 'Soy una persona realista con los ofrecimientos que hago, sabiendo qué cosa puedo cumplir y qué no me será posible hacer.', dimension: 'autocontrol' },
  { id: 29, text: 'Cuando alguien se muestra muy nervioso/a o exaltado/a lo calmo y tranquilizo.', dimension: 'habilidades_sociales' },
  { id: 30, text: 'Tengo las ideas muy claras sobre lo que quiero.', dimension: 'autoconocimiento' },
  { id: 31, text: 'Controlo bien mis miedos y temores.', dimension: 'autocontrol' },
  { id: 32, text: 'Si he de estar solo no me agobio por eso.', dimension: 'autocontrol' },
  { id: 33, text: 'Formo parte de algún grupo o equipo de deporte o de ocio para compartir intereses o aficiones.', dimension: 'habilidades_sociales' },
  { id: 34, text: 'Sé cuáles son mis defectos y cómo cambiarlos.', dimension: 'autoconocimiento' },
  { id: 35, text: 'Soy creativo, tengo ideas originales y las desarrollo.', dimension: 'automotivacion' },
  { id: 36, text: 'Sé qué pensamientos son capaces de hacerme sentir feliz, triste, enfadado, altruista, angustiado.', dimension: 'autoconocimiento' },
  { id: 37, text: 'Soy capaz de aguantar bien la frustración cuando no consigo lo que me propongo.', dimension: 'autocontrol' },
  { id: 38, text: 'Me comunico bien con la gente con la que me relaciono.', dimension: 'habilidades_sociales' },
  { id: 39, text: 'Soy capaz de comprender el punto de vista de los demás.', dimension: 'empatia' },
  { id: 40, text: 'Identifico las emociones que expresa la gente a mi alrededor.', dimension: 'empatia' },
  { id: 41, text: 'Soy capaz de verme a mí mismo desde la perspectiva de los otros.', dimension: 'empatia' },
  { id: 42, text: 'Me responsabilizo de las cosas que hago.', dimension: 'habilidades_sociales' },
  { id: 43, text: 'Me adapto a las nuevas situaciones, aunque me cuesten algún cambio en mi manera de sentir las cosas.', dimension: 'automotivacion' },
  { id: 44, text: 'Creo que soy una persona equilibrada emocionalmente.', dimension: 'autocontrol' },
  { id: 45, text: 'Tomo decisiones sin dudar ni titubear demasiado.', dimension: 'automotivacion' },
];

export const IE_LEVELS: Record<IELevelCode, IELevelDefinition> = {
  MUY_BAJO: {
    code: 'MUY_BAJO',
    label: 'Muy Bajo',
    minScore: 0,
    maxScore: 20,
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-400',
    officialDescription:
      'Con esta puntuación debes saber que todavía no conoces suficientemente qué emociones son las que vives, no valoras adecuadamente tus capacidades, que seguramente tienes. Son muchas las habilidades que no pones en práctica, y son necesarias para que te sientas más a gusto contigo mismo y para que las relaciones con la gente sean satisfactorias.',
    languageTeacherImplication:
      'Requiere acompañamiento tutorado para fortalecer la seguridad frente al grupo de clase y el manejo de la ansiedad comunicativa en el idioma extranjero.',
  },
  BAJO: {
    code: 'BAJO',
    label: 'Bajo',
    minScore: 21,
    maxScore: 35,
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-400',
    officialDescription:
      'Con esta puntuación tus habilidades emocionales son todavía escasas. Necesitas conocerte un poco mejor y valorar más lo que tú puedes ser capaz de hacer. Saber qué emociones experimentas, cómo las controlas, cómo las expresas y cómo las identificas en los demás es fundamental para que te puedas sentir bien, y desarrollar toda tu personalidad de una manera eficaz.',
    languageTeacherImplication:
      'Se aconseja trabajar en dinámicas de asertividad docente, regulación ante el error de pronunciación y desarrollo del autoconcepto profesional.',
  },
  MEDIO_BAJO: {
    code: 'MEDIO_BAJO',
    label: 'Medio - Bajo',
    minScore: 36,
    maxScore: 45,
    badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-400',
    officialDescription:
      'Casi lo conseguiste. Con esta puntuación te encuentras rayando lo deseable para tus habilidades emocionales. Ya conoces muchas cosas de lo que piensas, haces y sientes y, posiblemente, de cómo manejar tus emociones y comunicarte con eficacia con los demás. No obstante, no te conformes con este puntaje conseguido.',
    languageTeacherImplication:
      'Cuenta con bases para interactuar con alumnos en clase de idiomas; se beneficiará de fortalecer técnicas de modulación del estrés y resiliencia pedagógica.',
  },
  MEDIO_ALTO: {
    code: 'MEDIO_ALTO',
    label: 'Medio - Alto (Favorable)',
    minScore: 46,
    maxScore: 79,
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-400',
    officialDescription:
      'No está nada mal la puntuación que has obtenido. Indica que sabes quién eres, cómo te emocionas, cómo manejas tus sentimientos y cómo descubres todo esto en los demás. Tus relaciones con la gente las llevas bajo control, empleando para ello tus habilidades para saber cómo te sientes tú y cómo debes expresarlo y también conociendo cómo se sienten los demás, y qué debes hacer para mantener relaciones satisfactorias con otras personas.',
    languageTeacherImplication:
      'Perfil idóneo para la docencia de lenguas extranjeras. Manifiesta empatía hacia el alumnado, autocontrol durante la exposición oral bilingüe y excelente disposición al trabajo colaborativo.',
  },
  MUY_ALTO: {
    code: 'MUY_ALTO',
    label: 'Muy Alto (Excelente)',
    minScore: 80,
    maxScore: 90,
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-400',
    officialDescription:
      'Eres un modelo de la emoción y su control. Se diría que eres un referente en inteligencia emocional. Tus habilidades te permiten ser consciente de quién eres, qué objetivos pretendes, qué emociones vives, sabes valorarte como te mereces, manejas bien tus estados emocionales y, además, eres capaz de comunicarte eficazmente con quienes te rodean y solucionar posconflictos interpersonales.',
    languageTeacherImplication:
      'Sobresaliente potencial de liderazgo educativo bilingüe. Capacidad natural para inspirar confianza, desarticular la tensión y crear un ambiente de aprendizaje seguro y motivador.',
  },
};

export function getIELevelByScore(score: number): IELevelDefinition {
  if (score <= 20) return IE_LEVELS.MUY_BAJO;
  if (score <= 35) return IE_LEVELS.BAJO;
  if (score <= 45) return IE_LEVELS.MEDIO_BAJO;
  if (score <= 79) return IE_LEVELS.MEDIO_ALTO;
  return IE_LEVELS.MUY_ALTO;
}

export function calculateEmotionalIntelligenceScores(
  answers: Record<number, IEOption>,
  candidateData: {
    folio?: string;
    name: string;
    gender: 'M' | 'F';
    age?: number;
    emphasis?: string;
  }
): EmotionalIntelligenceRecord {
  let totalScore = 0;
  const dimScores: Record<string, { score: number; maxScore: number }> = {
    autoconocimiento: { score: 0, maxScore: IE_DIMENSIONS.autoconocimiento.questionIds.length * 2 },
    autocontrol: { score: 0, maxScore: IE_DIMENSIONS.autocontrol.questionIds.length * 2 },
    automotivacion: { score: 0, maxScore: IE_DIMENSIONS.automotivacion.questionIds.length * 2 },
    empatia: { score: 0, maxScore: IE_DIMENSIONS.empatia.questionIds.length * 2 },
    habilidades_sociales: { score: 0, maxScore: IE_DIMENSIONS.habilidades_sociales.questionIds.length * 2 },
  };

  for (let i = 1; i <= 45; i++) {
    const ans = answers[i];
    let val = 0;
    if (ans === 'siempre') val = 2;
    else if (ans === 'algunas_veces') val = 1;
    else if (ans === 'nunca') val = 0;
    totalScore += val;

    const q = IE_QUESTIONS.find((item) => item.id === i);
    if (q && dimScores[q.dimension]) {
      dimScores[q.dimension].score += val;
    }
  }

  const percentage = Math.round((totalScore / 90) * 100);
  const level = getIELevelByScore(totalScore);

  return {
    id: `IE-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    folio: candidateData.folio || `IE-${Math.floor(1000 + Math.random() * 9000)}`,
    name: candidateData.name.trim() || 'Aspirante Evaluado',
    gender: candidateData.gender,
    age: candidateData.age || 20,
    emphasis: candidateData.emphasis || 'Español e Inglés',
    totalScore,
    maxPossibleScore: 90,
    percentage,
    level,
    dimensions: {
      autoconocimiento: {
        score: dimScores.autoconocimiento.score,
        maxScore: dimScores.autoconocimiento.maxScore,
        percentage: Math.round((dimScores.autoconocimiento.score / dimScores.autoconocimiento.maxScore) * 100),
      },
      autocontrol: {
        score: dimScores.autocontrol.score,
        maxScore: dimScores.autocontrol.maxScore,
        percentage: Math.round((dimScores.autocontrol.score / dimScores.autocontrol.maxScore) * 100),
      },
      automotivacion: {
        score: dimScores.automotivacion.score,
        maxScore: dimScores.automotivacion.maxScore,
        percentage: Math.round((dimScores.automotivacion.score / dimScores.automotivacion.maxScore) * 100),
      },
      empatia: {
        score: dimScores.empatia.score,
        maxScore: dimScores.empatia.maxScore,
        percentage: Math.round((dimScores.empatia.score / dimScores.empatia.maxScore) * 100),
      },
      habilidades_sociales: {
        score: dimScores.habilidades_sociales.score,
        maxScore: dimScores.habilidades_sociales.maxScore,
        percentage: Math.round((dimScores.habilidades_sociales.score / dimScores.habilidades_sociales.maxScore) * 100),
      },
    },
    answers,
  };
}

export function generateSampleIEAnswers(
  level: 'muy_alto' | 'medio_alto' | 'medio_bajo' | 'bajo' = 'medio_alto'
): Record<number, IEOption> {
  const ans: Record<number, IEOption> = {};
  for (let i = 1; i <= 45; i++) {
    const roll = Math.random();
    if (level === 'muy_alto') {
      if (roll < 0.85) ans[i] = 'siempre';
      else ans[i] = 'algunas_veces';
    } else if (level === 'medio_alto') {
      if (roll < 0.5) ans[i] = 'siempre';
      else if (roll < 0.95) ans[i] = 'algunas_veces';
      else ans[i] = 'nunca';
    } else if (level === 'medio_bajo') {
      if (roll < 0.2) ans[i] = 'siempre';
      else if (roll < 0.7) ans[i] = 'algunas_veces';
      else ans[i] = 'nunca';
    } else {
      if (roll < 0.1) ans[i] = 'siempre';
      else if (roll < 0.5) ans[i] = 'algunas_veces';
      else ans[i] = 'nunca';
    }
  }
  return ans;
}
