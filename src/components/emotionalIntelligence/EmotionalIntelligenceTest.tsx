import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  HelpCircle,
} from 'lucide-react';
import {
  IE_QUESTIONS,
  EmotionalIntelligenceRecord,
  calculateEmotionalIntelligenceScores,
  generateSampleIEAnswers,
  IEOption,
} from '../../data/emotionalIntelligenceData';

interface EmotionalIntelligenceTestProps {
  onComplete: (record: EmotionalIntelligenceRecord) => void;
}

export const EmotionalIntelligenceTest: React.FC<EmotionalIntelligenceTestProps> = ({
  onComplete,
}) => {
  const [name, setName] = useState('');
  const [folio, setFolio] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [age, setAge] = useState<number>(18);
  const [emphasis, setEmphasis] = useState('Español e Inglés');
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, IEOption>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 15;
  const totalPages = Math.ceil(IE_QUESTIONS.length / pageSize);

  useEffect(() => {
    const saved = localStorage.getItem('ie_in_progress_answers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setAnswers(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    const savedInfo = localStorage.getItem('ie_in_progress_candidate');
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

  const handleSelectAnswer = (qId: number, val: IEOption) => {
    setAnswers((prev) => {
      const next = { ...prev, [qId]: val };
      localStorage.setItem('ie_in_progress_answers', JSON.stringify(next));
      return next;
    });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / IE_QUESTIONS.length) * 100);

  const startTest = () => {
    if (!name.trim()) {
      alert('Por favor escribe el nombre completo del aspirante.');
      return;
    }
    const candidateInfo = { name, folio, gender, age, emphasis };
    localStorage.setItem('ie_in_progress_candidate', JSON.stringify(candidateInfo));
    setIsStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = () => {
    if (answeredCount < 45) {
      const confirmSubmit = window.confirm(
        `Has respondido ${answeredCount} de las 45 preguntas. ¿Deseas finalizar la prueba ahora? Las preguntas sin responder contarán como 0 puntos.`
      );
      if (!confirmSubmit) return;
    }
    const record = calculateEmotionalIntelligenceScores(answers, {
      name,
      folio: folio || `IE-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      age,
      emphasis,
    });
    localStorage.removeItem('ie_in_progress_answers');
    onComplete(record);
  };

  const loadDemoAnswers = (level: 'muy_alto' | 'medio_alto' | 'medio_bajo' | 'bajo' = 'medio_alto') => {
    const demo = generateSampleIEAnswers(level);
    setAnswers(demo);
    localStorage.setItem('ie_in_progress_answers', JSON.stringify(demo));
    if (!name) setName('Sofía Valentina Mendoza');
    if (!folio) setFolio(`LELE-IE-2026-${Math.floor(100 + Math.random() * 900)}`);
    setGender('F');
    setAge(20);
    setIsStarted(true);
  };

  const currentQuestions = IE_QUESTIONS.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!isStarted ? (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8">
            <span className="inline-block bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 mb-3">
              Módulo Psicoeducativo – Admisión 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Test de Inteligencia Emocional (45 Reactivos)
            </h2>
            <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
              Evaluación psicométrica sobre el modo habitual de pensar, sentir y actuar frente a los demás, orientada al perfil docente de la Licenciatura en Enseñanza de Lenguas Extranjeras (Español e Inglés).
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
                    placeholder="Ej. Sofía Valentina Mendoza"
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
                    placeholder="LELE-IE-2026-033"
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
                        name="ie_gender"
                        checked={gender === 'F'}
                        onChange={() => setGender('F')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Femenino</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="ie_gender"
                        checked={gender === 'M'}
                        onChange={() => setGender('M')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Masculino</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Edad
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Énfasis de Idioma
                  </label>
                  <select
                    value={emphasis}
                    onChange={(e) => setEmphasis(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                  >
                    <option value="Español e Inglés">Español e Inglés (Ambos)</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Español">Español para Extranjeros</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Instrucciones Oficiales de Aplicación</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Las preguntas de este test se refieren a la manera habitual que tienes de actuar con las personas con quienes te relacionas. <strong>No existen respuestas buenas ni malas</strong>, sino respuestas sinceras que reflejan tu estilo, tu modo habitual de pensar, hacer y sentir.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="font-bold text-rose-800 block">NUNCA (0 pts)</span>
                  <span className="text-slate-600 text-[11px]">Casi nunca o en ningún momento actúas así.</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="font-bold text-amber-800 block">ALGUNAS VECES (1 pt)</span>
                  <span className="text-slate-600 text-[11px]">En ciertas ocasiones o situaciones manifiestas este comportamiento.</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block">SIEMPRE (2 pts)</span>
                  <span className="text-slate-600 text-[11px]">Es tu conducta habitual, constante y espontánea.</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-900">
                  Para fines de prueba o simulación pedagógica:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadDemoAnswers('muy_alto')}
                  className="px-2.5 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold transition text-[11px] cursor-pointer"
                >
                  Simular Muy Alto (80-90 pts)
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoAnswers('medio_alto')}
                  className="px-2.5 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition text-[11px] cursor-pointer"
                >
                  Simular Favorable (46-79 pts)
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={startTest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-700/25 transition cursor-pointer"
              >
                <span>Comenzar Test de Inteligencia Emocional</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-800 text-sm truncate max-w-[220px]">
                  {name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-semibold">{folio || 'Folio Pendiente'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500">
                  Progreso:{' '}
                  <strong className="text-blue-700 font-bold">
                    {answeredCount} de {IE_QUESTIONS.length}
                  </strong>{' '}
                  ({progressPercent}%)
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">
                  Página <strong>{currentPage + 1}</strong> de {totalPages}
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            {currentQuestions.map((q) => {
              const selected = answers[q.id];
              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition bg-white shadow-sm ${
                    selected
                      ? 'border-blue-200 bg-blue-50/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        selected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {q.id}
                    </span>
                    <div className="flex-1 space-y-3">
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {q.text}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, 'nunca')}
                          className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                            selected === 'nunca'
                              ? 'border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-500/20'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                              0
                            </span>
                            <span>Nunca</span>
                          </span>
                          {selected === 'nunca' && (
                            <CheckCircle className="w-4 h-4 text-rose-600" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, 'algunas_veces')}
                          className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                            selected === 'algunas_veces'
                              ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-500/20'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                              1
                            </span>
                            <span>Algunas veces</span>
                          </span>
                          {selected === 'algunas_veces' && (
                            <CheckCircle className="w-4 h-4 text-amber-600" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, 'siempre')}
                          className={`p-3 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                            selected === 'siempre'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                              2
                            </span>
                            <span>Siempre</span>
                          </span>
                          {selected === 'siempre' && (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => {
                setCurrentPage((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 100, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPage(idx);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition cursor-pointer ${
                    currentPage === idx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow transition cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finalizar y Calificar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
