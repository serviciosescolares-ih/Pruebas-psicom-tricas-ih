export interface LearningStyleQuestion {
  id: number;
  text: string;
  options: {
    a: string; // Auditivo
    b: string; // Visual
    c: string; // Kinestésico
  };
}

export interface LearningStyleRecord {
  id: string;
  timestamp: string;
  folio: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  emphasis: string;
  counts: {
    auditivo: number;
    visual: number;
    kinestesico: number;
  };
  percentages: {
    auditivo: number;
    visual: number;
    kinestesico: number;
  };
  predominantStyle: string;
  secondaryStyle?: string;
  answers: Record<number, 'a' | 'b' | 'c'>;
}

export const LEARNING_STYLES_QUESTIONS: LearningStyleQuestion[] = [
  {
    id: 1,
    text: "¿Cuál de las siguientes actividades disfrutas más?",
    options: {
      a: "Escuchar música",
      b: "Ver películas",
      c: "Bailar con buena música",
    },
  },
  {
    id: 2,
    text: "¿Qué programa de televisión prefieres?",
    options: {
      a: "Reportajes de descubrimientos y lugares",
      b: "Cómico y de entretenimiento",
      c: "Noticias del mundo",
    },
  },
  {
    id: 3,
    text: "Cuando conversas con otra persona, tú:",
    options: {
      a: "La escuchas atentamente",
      b: "La observas",
      c: "Tiendes a tocarla",
    },
  },
  {
    id: 4,
    text: "Si pudieras adquirir uno de los siguientes artículos, ¿cuál elegirías?",
    options: {
      a: "Un estéreo",
      b: "Un televisor",
      c: "Un jacuzzi",
    },
  },
  {
    id: 5,
    text: "¿Qué prefieres hacer un sábado por la tarde?",
    options: {
      a: "Ir a un concierto",
      b: "Ir al cine",
      c: "Quedarte en casa descansando",
    },
  },
  {
    id: 6,
    text: "¿Qué tipo de exámenes se te facilitan más?",
    options: {
      a: "Examen oral",
      b: "Examen escrito",
      c: "Examen de opción múltiple",
    },
  },
  {
    id: 7,
    text: "¿Cómo te orientas más fácilmente?",
    options: {
      a: "Pidiendo indicaciones",
      b: "Mediante el uso de un mapa",
      c: "A través de la intuición",
    },
  },
  {
    id: 8,
    text: "¿En qué prefieres ocupar tu tiempo en un lugar de descanso?",
    options: {
      a: "Pensar y reflexionar",
      b: "Caminar por los alrededores",
      c: "Descansar y relajarte",
    },
  },
  {
    id: 9,
    text: "¿Qué te halaga más?",
    options: {
      a: "Que te digan que tienes una conversación interesante",
      b: "Que te digan que tienes buen aspecto",
      c: "Que te digan que tienes un trato muy agradable",
    },
  },
  {
    id: 10,
    text: "¿Cuál de estos ambientes te atrae más?",
    options: {
      a: "Uno en el que se escuchen las olas del mar",
      b: "Uno con una hermosa vista al océano",
      c: "Uno en el que se sienta un clima agradable",
    },
  },
  {
    id: 11,
    text: "¿De qué manera se te facilita aprender algo?",
    options: {
      a: "Repitiendo en voz alta",
      b: "Escribiéndolo varias veces",
      c: "Relacionándolo con algo divertido o práctico",
    },
  },
  {
    id: 12,
    text: "¿A qué evento preferirías asistir?",
    options: {
      a: "A una conferencia o recital",
      b: "A una exposición de arte",
      c: "A una reunión social",
    },
  },
  {
    id: 13,
    text: "¿De qué manera te formas una opinión de otras personas?",
    options: {
      a: "Por la sinceridad y tono en su voz",
      b: "Por su aspecto e imagen",
      c: "Por la forma de estrecharte la mano y su cercanía",
    },
  },
  {
    id: 14,
    text: "¿Cómo te consideras?",
    options: {
      a: "Intelectual",
      b: "Sociable",
      c: "Atlético",
    },
  },
  {
    id: 15,
    text: "¿Qué tipo de películas te gustan más?",
    options: {
      a: "Clásicas y con buen diálogo",
      b: "De acción y grandes efectos",
      c: "De amor o drama emotivo",
    },
  },
  {
    id: 16,
    text: "¿Cómo prefieres mantenerte en contacto con otra persona?",
    options: {
      a: "Por llamada telefónica o notas de voz",
      b: "Por correo electrónico o mensajes de texto",
      c: "Tomando un café juntos en persona",
    },
  },
  {
    id: 17,
    text: "¿Cuál de las siguientes frases se identifica más contigo?",
    options: {
      a: "Percibo hasta el más ligero ruido o vibración",
      b: "Es importante que todo esté limpio y ordenado visualmente",
      c: "Me gusta que las cosas se sientan cómodas y confortables",
    },
  },
  {
    id: 18,
    text: "¿Cómo prefieres pasar el tiempo con tu pareja o amigos cercanos?",
    options: {
      a: "Conversando largamente",
      b: "Mirando algo juntos (película, paisaje)",
      c: "Compartiendo abrazos, caminatas o actividades juntos",
    },
  },
  {
    id: 19,
    text: "Si no encuentras las llaves en una bolsa:",
    options: {
      a: "Sacudes la bolsa para oír el tintineo",
      b: "La buscas mirando detenidamente",
      c: "Buscas al tacto metiendo la mano",
    },
  },
  {
    id: 20,
    text: "Cuando tratas de recordar algo, ¿cómo lo haces?",
    options: {
      a: "A través de sonidos o lo que te dijeron",
      b: "A través de imágenes o esquemas mentales",
      c: "A través de emociones o cómo te sentiste",
    },
  },
  {
    id: 21,
    text: "Si tuvieras dinero disponible, ¿qué harías primero?",
    options: {
      a: "Adquirir un estudio de grabación o buen equipo de audio",
      b: "Comprar una casa con hermoso diseño",
      c: "Viajar y vivir experiencias por el mundo",
    },
  },
  {
    id: 22,
    text: "¿Con qué frase te identificas más?",
    options: {
      a: "Reconozco a las personas por su voz",
      b: "Recuerdo el aspecto de alguien, pero no su nombre",
      c: "Recuerdo cómo me hizo sentir una persona, más que su nombre o cara",
    },
  },
  {
    id: 23,
    text: "Si tuvieras que quedarte en una isla desierta, ¿qué preferirías llevar contigo?",
    options: {
      a: "Un radio portátil o reproductor de música",
      b: "Algunos buenos libros ilustrados",
      c: "Golosinas y alimentos reconfortantes",
    },
  },
  {
    id: 24,
    text: "¿Cuál de los siguientes entretenimientos prefieres?",
    options: {
      a: "Tocar un instrumento musical o cantar",
      b: "Sacar fotografías o pintar",
      c: "Hacer actividades manuales o ejercicio",
    },
  },
  {
    id: 25,
    text: "¿Cómo es tu forma habitual de vestir?",
    options: {
      a: "Informal pero combinada",
      b: "Impecable y visualmente atractiva",
      c: "Muy cómoda y relajada",
    },
  },
  {
    id: 26,
    text: "¿Qué es lo que más te gusta de una fogata nocturna?",
    options: {
      a: "El sonido de la leña crepitando",
      b: "Mirar el baile del fuego y las estrellas",
      c: "El calor del fuego y asar bombones",
    },
  },
  {
    id: 27,
    text: "¿Cómo se te facilita entender un tema nuevo?",
    options: {
      a: "Cuando me lo explican verbalmente paso a paso",
      b: "Cuando utilizan diagramas, diapositivas y medios visuales",
      c: "Cuando se realiza a través de alguna dinámica o práctica",
    },
  },
  {
    id: 28,
    text: "¿Por qué cualidad te distingues más?",
    options: {
      a: "Por ser un buen conversador y saber escuchar",
      b: "Por ser un buen observador y detallista",
      c: "Por tener gran intuición y empatía",
    },
  },
  {
    id: 29,
    text: "¿Qué es lo que más disfrutas de un amanecer?",
    options: {
      a: "El canto de las aves y el silencio matutino",
      b: "Las tonalidades y colores del cielo",
      c: "La emoción y energía fresca de vivir un nuevo día",
    },
  },
  {
    id: 30,
    text: "Si pudieras elegir una profesión artística, ¿qué preferirías ser?",
    options: {
      a: "Un gran músico o compositor",
      b: "Un gran pintor o cineasta",
      c: "Un gran actor o bailarín",
    },
  },
  {
    id: 31,
    text: "Cuando compras ropa, ¿qué es lo más importante para ti?",
    options: {
      a: "Que sea adecuada y cumpla con lo que busco",
      b: "Que luzca bien y tenga buen estilo visual",
      c: "Que sea suave, cómoda y no me apriete",
    },
  },
  {
    id: 32,
    text: "¿Qué es lo que más disfrutas de una habitación?",
    options: {
      a: "Que sea silenciosa y tranquila",
      b: "Que esté limpia, ordenada e iluminada",
      c: "Que sea confortable, cálida y acogedora",
    },
  },
  {
    id: 33,
    text: "¿Qué consideras más atractivo en una cita?",
    options: {
      a: "Una voz seductora o cierta música de fondo",
      b: "Una iluminación tenue y una vista agradable",
      c: "Un aroma agradable y la cercanía física",
    },
  },
  {
    id: 34,
    text: "¿A qué tipo de espectáculo preferirías asistir?",
    options: {
      a: "A un concierto de música en vivo",
      b: "A un espectáculo de magia o artes visuales",
      c: "A una muestra gastronómica o cata interactiva",
    },
  },
  {
    id: 35,
    text: "¿Qué te atrae más de una persona al conocerla?",
    options: {
      a: "Su conversación y timbre de voz",
      b: "Su aspecto físico y su mirada",
      c: "Su trato cálido y su lenguaje corporal",
    },
  },
  {
    id: 36,
    text: "Cuando vas a un centro comercial, ¿en dónde pasas más tiempo?",
    options: {
      a: "En una tienda de música, podcasts o audiolibros",
      b: "En una librería o galería de arte",
      c: "En una perfumería o zona de comida y café",
    },
  },
  {
    id: 37,
    text: "¿Cuál es tu idea de una velada romántica perfecta?",
    options: {
      a: "Una cena con música romántica y charla íntima",
      b: "Una cena a la luz de las velas con hermosa decoración",
      c: "Bailar abrazados o caminar tomados de la mano",
    },
  },
  {
    id: 38,
    text: "¿Qué es lo que más disfrutas al viajar?",
    options: {
      a: "Aprender los sonidos, dialectos y música del lugar",
      b: "Conocer lugares nuevos y tomar fotos increíbles",
      c: "Probar la gastronomía y sentir el ambiente local",
    },
  },
  {
    id: 39,
    text: "Cuando estás en la ciudad, ¿qué es lo que más echas de menos del campo?",
    options: {
      a: "La tranquilidad y los sonidos de la naturaleza",
      b: "Los amplios paisajes verdes y el horizonte despejado",
      c: "El aire fresco en la piel y el descanso corporal",
    },
  },
  {
    id: 40,
    text: "Si te ofrecieran dirigir uno de los siguientes proyectos, ¿cuál elegirías?",
    options: {
      a: "Director de una estación de radio o podcast",
      b: "Director de una revista de diseño visual",
      c: "Director de un club deportivo o cultural interactivo",
    },
  },
];

export interface ChannelInfo {
  name: string;
  code: 'V' | 'A' | 'K';
  color: string;
  badgeBg: string;
  description: string;
  traits: string[];
  languageLearningProfile: string;
  languageTeachingProfile: string;
  recommendedStrategies: string[];
}

export const CHANNELS_DATA: Record<'visual' | 'auditivo' | 'kinestesico', ChannelInfo> = {
  visual: {
    name: 'Estilo Visual',
    code: 'V',
    color: '#2563EB',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description:
      'Aprende preferentemente a través de la vista: imágenes, diagramas, esquemas, lectura, mapas conceptuales y demostraciones gráficas. Necesita ver para procesar y memorizar información.',
    traits: [
      'Memoria fotográfica y espacial.',
      'Anota ideas, toma apuntes estructurados con colores.',
      'Le molestan los desórdenes visuales en el entorno.',
      'Prefiere leer instrucciones antes que escucharlas.',
    ],
    languageLearningProfile:
      'En el aprendizaje del inglés y español: asimila rápidamente vocabulario escrito, reglas gramaticales impresas, ortografía y tablas de conjugación. Retiene mejor viendo subtítulos en películas y leyendo textos bilingües.',
    languageTeachingProfile:
      'Como docente de idiomas: tenderá a utilizar excelentes apoyos visuales (presentaciones claras, flashcards, organizadores gráficos, pizarrón estructurado). Debe cuidar no descuidar las dinámicas de práctica oral y auditiva en el aula.',
    recommendedStrategies: [
      'Emplear tarjetas nemotécnicas (flashcards) para vocabulario en inglés y español.',
      'Diseñar líneas de tiempo para tiempos verbales (Past, Present, Future Perfect).',
      'Utilizar código de colores para categorizar clases de palabras (sustantivos, verbos, adjetivos).',
      'Incorporar videos con subtítulos interactivos para análisis sintáctico.',
    ],
  },
  auditivo: {
    name: 'Estilo Auditivo',
    code: 'A',
    color: '#059669',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description:
      'Aprende preferentemente a través del oído: explicaciones verbales, debates, conferencias, ritmos fonéticos y repetición oral. Piensa y procesa en sonidos y secuencias lingüísticas.',
    traits: [
      'Gran facilidad para recordar nombres, tonos de voz y frases.',
      'Aprende mejor discutiendo y escuchando exposiciones.',
      'Suele repetir o murmurar en voz baja al estudiar.',
      'Sensible a ruidos molestos que interrumpen su concentración.',
    ],
    languageLearningProfile:
      'En el aprendizaje del inglés y español: sobresale en pronunciación, discriminación de fonemas sutiles, entonación nativa y comprensión auditiva (listening). Aprende escuchando podcasts, canciones y diálogos orales.',
    languageTeachingProfile:
      'Como docente de idiomas: excelente comunicador verbal, modelador fonético y moderador de debates orales. Motiva la conversación grupal y los ejercicios de escucha. Debe complementar con apoyos visuales para los alumnos que no son auditivos.',
    recommendedStrategies: [
      'Ejercicios de repetición coral y técnica de "shadowing" para entonación en inglés.',
      'Grabarse leyendo textos en la lengua meta para autoevaluar fluidez y fonética.',
      'Uso de podcasts auténticos, audiolibros y canciones bilingües.',
      'Fomentar debates, mesas redondas y exposiciones orales en clase.',
    ],
  },
  kinestesico: {
    name: 'Estilo Kinestésico',
    code: 'K',
    color: '#D97706',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description:
      'Aprende preferentemente a través del cuerpo, las sensaciones, el movimiento y la práctica vivencial. Necesita involucrarse activamente, asociar el contenido con emociones y "hacer" para asimilar.',
    traits: [
      'Aprende mejor manipulando objetos o viviendo experiencias prácticas.',
      'Le cuesta permanecer sentado quieto durante periodos prolongados.',
      'Acompaña sus explicaciones con gesticulación amplia y lenguaje corporal.',
      'Recuerda lo que hizo o sintió más que lo que vio o escuchó pasivamente.',
    ],
    languageLearningProfile:
      'En el aprendizaje del inglés y español: internaliza el vocabulario mediante dinámicas vivenciales, juegos de rol (role-playing), dramatizaciones teatrales y proyectos colaborativos prácticos.',
    languageTeachingProfile:
      'Como docente de idiomas: dinamizador nato del aula; implementa dinámicas vivenciales, Total Physical Response (TPR), juegos pedagógicos y actividades de inmersión comunicativa activa.',
    recommendedStrategies: [
      'Método TPR (Total Physical Response) para conectar comandos verbales con acciones físicas.',
      'Dramatizaciones y simulaciones situacionales (comprar en una tienda, check-in en aeropuerto).',
      'Actividades de aprendizaje en estaciones dentro del aula para mantener el movimiento.',
      'Juegos interactivos de mesa o tarjetas manipulativas para formar oraciones complejas.',
    ],
  },
};

export function calculateLearningStyleScores(
  answers: Record<number, 'a' | 'b' | 'c'>,
  candidateData: {
    name: string;
    folio: string;
    gender: 'M' | 'F';
    age: number;
    emphasis: string;
  }
): LearningStyleRecord {
  let countA = 0; // Auditivo
  let countB = 0; // Visual
  let countC = 0; // Kinestésico

  for (let i = 1; i <= 40; i++) {
    const ans = answers[i];
    if (ans === 'a') countA++;
    else if (ans === 'b') countB++;
    else if (ans === 'c') countC++;
  }

  const totalAnswered = countA + countB + countC || 1;
  const pctA = Math.round((countA / totalAnswered) * 100);
  const pctB = Math.round((countB / totalAnswered) * 100);
  const pctC = Math.round((countC / totalAnswered) * 100);

  const sorted = [
    { name: 'Auditivo', count: countA, pct: pctA },
    { name: 'Visual', count: countB, pct: pctB },
    { name: 'Kinestésico', count: countC, pct: pctC },
  ].sort((x, y) => y.count - x.count);

  let predominantStyle = sorted[0].name;
  let secondaryStyle: string | undefined = sorted[1].name;

  if (Math.abs(sorted[0].count - sorted[1].count) <= 2) {
    if (Math.abs(sorted[0].count - sorted[2].count) <= 3) {
      predominantStyle = 'Multimodal (Equilibrado)';
      secondaryStyle = undefined;
    } else {
      predominantStyle = `${sorted[0].name} - ${sorted[1].name} (Bimodal)`;
    }
  }

  return {
    id: `VAK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    folio: candidateData.folio || `VAK-${Math.floor(1000 + Math.random() * 9000)}`,
    name: candidateData.name.trim() || 'Aspirante Evaluado',
    gender: candidateData.gender,
    age: candidateData.age || 20,
    emphasis: candidateData.emphasis || 'Español e Inglés',
    counts: {
      auditivo: countA,
      visual: countB,
      kinestesico: countC,
    },
    percentages: {
      auditivo: pctA,
      visual: pctB,
      kinestesico: pctC,
    },
    predominantStyle,
    secondaryStyle,
    answers,
  };
}

export function generateSampleLearningStyleAnswers(
  bias: 'visual' | 'auditivo' | 'kinestesico' | 'equilibrado' = 'visual'
): Record<number, 'a' | 'b' | 'c'> {
  const ans: Record<number, 'a' | 'b' | 'c'> = {};
  for (let i = 1; i <= 40; i++) {
    const roll = Math.random();
    if (bias === 'visual') {
      if (roll < 0.55) ans[i] = 'b';
      else if (roll < 0.8) ans[i] = 'a';
      else ans[i] = 'c';
    } else if (bias === 'auditivo') {
      if (roll < 0.55) ans[i] = 'a';
      else if (roll < 0.8) ans[i] = 'b';
      else ans[i] = 'c';
    } else if (bias === 'kinestesico') {
      if (roll < 0.55) ans[i] = 'c';
      else if (roll < 0.8) ans[i] = 'b';
      else ans[i] = 'a';
    } else {
      if (roll < 0.35) ans[i] = 'a';
      else if (roll < 0.7) ans[i] = 'b';
      else ans[i] = 'c';
    }
  }
  return ans;
}
