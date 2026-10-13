import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  ClipboardCheck,
  Eye,
  Volume2,
  Activity,
} from 'lucide-react';
import {
  LEARNING_STYLES_QUESTIONS,
  LearningStyleRecord,
  calculateLearningStyleScores,
  generateSampleLearningStyleAnswers,
} from '../../data/learningStylesData';

interface LearningStylesTestProps {
  onComplete: (record: LearningStyleRecord) => void;
}

export const LearningStylesTest: React.FC<LearningStylesTestProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [folio, setFolio] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [age, setAge] = useState<number>(18);
  const [emphasis, setEmphasis] = useState('Español e Inglés');
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, 'a' | 'b' | 'c'>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const totalPages = Math.ceil(LEARNING_STYLES_QUESTIONS.length / pageSize);

  useEffect(() => {
    const saved = localStorage.getItem('vak_in_progress_answers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setAnswers(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    const savedInfo = localStorage.getItem('vak_in_progress_candidate');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        if (parsed.name) setName(parsed.name);
        if (parsed.folio) setFolio(parsed.folio);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.age) setAge(parsed.age);
        if (parsed.emphasis) setEmphasis(parsed.emphasis);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSelectAnswer = (qId: number, val: 'a' | 'b' | 'c') => {
    setAnswers((prev) => {
      const next = { ...prev, [qId]: val };
      localStorage.setItem('vak_in_progress_answers', JSON.stringify(next));
      return next;
    });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / LEARNING_STYLES_QUESTIONS.length) * 100);

  const startTest = () => {
    if (!name.trim()) {
      alert('Por favor escribe el nombre completo del aspirante.');
      return;
    }
    const candidateInfo = { name, folio, gender, age, emphasis };
    localStorage.setItem('vak_in_progress_candidate', JSON.stringify(candidateInfo));
    setIsStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = () => {
    if (answeredCount < 40) {
      const confirmSubmit = window.confirm(
        `Has respondido ${answeredCount} de las 40 preguntas. ¿Deseas finalizar la prueba ahora? Las preguntas sin responder podrían alterar la distribución porcentual.`
      );
      if (!confirmSubmit) return;
    }
    const record = calculateLearningStyleScores(answers, {
      name,
      folio: folio || `VAK-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      age,
      emphasis,
    });
    localStorage.removeItem('vak_in_progress_answers');
    onComplete(record);
  };

  const loadDemoAnswers = (type: 'visual' | 'auditivo' | 'kinestesico' = 'visual') => {
    const demo = generateSampleLearningStyleAnswers(type);
    setAnswers(demo);
    localStorage.setItem('vak_in_progress_answers', JSON.stringify(demo));
    if (!name) setName('Alejandra Morales Castro');
    if (!folio) setFolio(`LELE-VAK-2026-${Math.floor(100 + Math.random() * 900)}`);
    setGender('F');
    setAge(19);
    setIsStarted(true);
  };

  const currentQuestions = LEARNING_STYLES_QUESTIONS.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!isStarted ? (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 text-white p-6 sm:p-8">
            <span className="inline-block bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 mb-3">
              Módulo Psicoeducativo – Admisión 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Test de Estilos de Aprendizaje (Modelo PNL - VAK)
            </h2>
            <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
              Cuestionario diagnóstico de 40 reactivos para identificar el canal perceptual predominante (Visual, Auditivo o Kinestésico) en aspirantes a la Licenciatura en Enseñanza de Lenguas Extranjeras (Español e Inglés).
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <span>1. Datos del Aspirante</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Alejandra Morales Castro"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Folio de Admisión
                  </label>
                  <input
                    type="text"
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    placeholder="LELE-VAK-2026-018"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Sexo
                  </label>
                  <div className="flex gap-4 pt-1.5 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="vak_gender"
                        checked={gender === 'F'}
                        onChange={() => setGender('F')}
                        className="text-blue-600"
                      />
                      <span>Mujer</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="vak_gender"
                        checked={gender === 'M'}
                        onChange={() => setGender('M')}
                        className="text-blue-600"
                      />
                      <span>Hombre</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Edad (años)
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Énfasis Lingüístico
                  </label>
                  <select
                    value={emphasis}
                    onChange={(e) => setEmphasis(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                  >
                    <option value="Español e Inglés">Bilingüe: Español e Inglés</option>
                    <option value="Enseñanza del Inglés">Énfasis en Lengua Inglesa</option>
                    <option value="Enseñanza del Español">Énfasis en Lengua Española</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                <span>2. Instrucciones para Responder</span>
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 text-sm text-slate-700">
                <p>
                  El cuestionario consta de <strong>40 preguntas</strong> basadas en el modelo de Programación Neurolingüística (PNL) de Eric de la Parra Paz (2004).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span>Opción B: Visual</span>
                    </span>
                    <span className="text-blue-800 mt-1 block">
                      Memoria fotográfica, diagramas, lectura, esquemas y observación.
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-emerald-600" />
                      <span>Opción A: Auditivo</span>
                    </span>
                    <span className="text-emerald-800 mt-1 block">
                      Sonidos, explicaciones verbales, fonética, debates y música.
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-600" />
                      <span>Opción C: Kinestésico</span>
                    </span>
                    <span className="text-amber-800 mt-1 block">
                      Sensaciones, emociones, movimiento corporal y práctica viva.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => loadDemoAnswers('visual')}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1.5 p-2 rounded hover:bg-blue-50 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Cargar Caso de Demostración (Simular Aspirante)</span>
              </button>
              <button
                type="button"
                onClick={startTest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer text-sm"
              >
                <span>Comenzar Test (40 reactivos)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-20 z-30">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">{name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-blue-600 font-medium">Folio: {folio || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 font-medium">
                  {answeredCount} de 40 contestadas ({progressPercent}%)
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-700 font-bold">
                  Página {currentPage + 1} de {totalPages}
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {currentQuestions.map((q) => {
              const currentAns = answers[q.id];
              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl p-5 border transition-all shadow-sm ${
                    currentAns ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                      {q.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-semibold text-slate-800 leading-snug mb-3">
                        {q.text}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {(['a', 'b', 'c'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`flex items-center gap-2.5 p-3 rounded-lg border text-left text-xs sm:text-sm font-medium transition cursor-pointer ${
                              currentAns === opt
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                currentAns === opt ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {opt}
                            </span>
                            <span className="flex-1">{q.options[opt]}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => {
                setCurrentPage((p) => Math.max(0, p - 1));
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition ${
                currentPage === 0
                  ? 'text-slate-300 border border-slate-200 cursor-not-allowed'
                  : 'text-slate-700 border border-slate-300 hover:bg-slate-50 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Página Anterior</span>
            </button>
            <span className="text-xs text-slate-500">
              Página {currentPage + 1} de {totalPages}
            </span>
            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow transition cursor-pointer"
              >
                <span>Página Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finalizar y Ver Reporte VAK</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
