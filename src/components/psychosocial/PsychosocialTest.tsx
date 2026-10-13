import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  RotateCcw,
  HelpCircle,
  HeartHandshake,
} from 'lucide-react';
import {
  PSYCHOSOCIAL_QUESTIONS,
  PSYCHOSOCIAL_OPTIONS,
  PSYCHOSOCIAL_DIMENSIONS,
  PsychosocialRecord,
  calculatePsychosocialScores,
  generateSamplePsychosocialAnswers,
  PsychosocialOption,
} from '../../data/psychosocialData';

interface PsychosocialTestProps {
  onComplete: (record: PsychosocialRecord) => void;
}

export const PsychosocialTest: React.FC<PsychosocialTestProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [folio, setFolio] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [age, setAge] = useState<number>(19);
  const [emphasis, setEmphasis] = useState('Español e Inglés');
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, PsychosocialOption>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;
  const totalPages = Math.ceil(PSYCHOSOCIAL_QUESTIONS.length / pageSize);

  useEffect(() => {
    const saved = localStorage.getItem('psychosocial_in_progress_answers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') setAnswers(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    const savedInfo = localStorage.getItem('psychosocial_in_progress_candidate');
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

  const handleSelectAnswer = (qId: number, val: PsychosocialOption) => {
    setAnswers((prev) => {
      const next = { ...prev, [qId]: val };
      localStorage.setItem('psychosocial_in_progress_answers', JSON.stringify(next));
      return next;
    });
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / PSYCHOSOCIAL_QUESTIONS.length) * 100);

  const startTest = () => {
    if (!name.trim()) {
      alert('Por favor escribe el nombre completo del aspirante.');
      return;
    }
    const candidateInfo = { name, folio, gender, age, emphasis };
    localStorage.setItem('psychosocial_in_progress_candidate', JSON.stringify(candidateInfo));
    setIsStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = () => {
    if (answeredCount < 35) {
      const confirmSubmit = window.confirm(
        `Has respondido ${answeredCount} de las 35 preguntas. ¿Deseas finalizar la prueba ahora? Las preguntas sin responder contarán como 0 puntos (sin riesgo).`
      );
      if (!confirmSubmit) return;
    }
    const record = calculatePsychosocialScores(answers, {
      name,
      folio: folio || `PSICO-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      age,
      emphasis,
    });
    localStorage.removeItem('psychosocial_in_progress_answers');
    localStorage.removeItem('psychosocial_in_progress_candidate');
    onComplete(record);
  };

  const handleFillDemo = () => {
    setName('Carlos Eduardo Montemayor');
    setFolio(`PSICO-${Math.floor(1000 + Math.random() * 9000)}`);
    setAge(20);
    setGender('M');
    setEmphasis('Español e Inglés');
    const demoAnswers = generateSamplePsychosocialAnswers();
    setAnswers(demoAnswers);
    localStorage.setItem('psychosocial_in_progress_answers', JSON.stringify(demoAnswers));
    setIsStarted(true);
  };

  const resetAll = () => {
    if (window.confirm('¿Reiniciar cuestionario? Se perderán las respuestas actuales no guardadas.')) {
      setAnswers({});
      localStorage.removeItem('psychosocial_in_progress_answers');
      setIsStarted(false);
      setCurrentPage(0);
    }
  };

  const currentQuestions = PSYCHOSOCIAL_QUESTIONS.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-emerald-700/60 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Módulo 4 – Evaluación Psicoeducativa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Escala de Clima y Bienestar Psicosocial</span>
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl font-light">
            Diagnóstico preventivo de factores psicosociales, entorno institucional, carga de trabajo y salud socioemocional para docentes de lenguas extranjeras (Español e Inglés).
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-emerald-700/50 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">35</span> Reactivos de diagnóstico
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              Escala Likert <span className="font-bold text-white">0 al 4</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">5</span> Dimensiones del entorno
            </div>
          </div>
        </div>
      </div>

      {!isStarted ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <span>Ficha de Identificación del Aspirante / Evaluado</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa los datos del aspirante para el informe psicopedagógico institucional.
            </p>
          </div>
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
                placeholder="Ej. Carlos Eduardo Montemayor"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
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
                placeholder="LELE-PS-2026-088"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
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
                    name="psico_gender"
                    checked={gender === 'F'}
                    onChange={() => setGender('F')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Femenino</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="psico_gender"
                    checked={gender === 'M'}
                    onChange={() => setGender('M')}
                    className="text-emerald-600 focus:ring-emerald-500"
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
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Énfasis de Idioma
              </label>
              <select
                value={emphasis}
                onChange={(e) => setEmphasis(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-sm bg-white"
              >
                <option value="Español e Inglés">Español e Inglés (Ambos)</option>
                <option value="Inglés">Inglés</option>
                <option value="Español">Español para Extranjeros</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Instrucciones y Escala de Calificación Likert (0 al 4)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Este cuestionario explora las condiciones de tu entorno formativo, el ritmo de estudio/trabajo, la convivencia con compañeros y el equilibrio con tu vida personal. <strong>Responde con total sinceridad</strong> considerando tu experiencia en los últimos meses:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                <span className="font-bold text-emerald-800 block text-sm">0</span>
                <span className="font-semibold text-emerald-700 block">Nunca</span>
                <span className="text-[10px] text-slate-500">0 puntos</span>
              </div>
              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-center">
                <span className="font-bold text-teal-800 block text-sm">1</span>
                <span className="font-semibold text-teal-700 block">Casi nunca</span>
                <span className="text-[10px] text-slate-500">1 punto</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
                <span className="font-bold text-amber-800 block text-sm">2</span>
                <span className="font-semibold text-amber-700 block">Algunas veces</span>
                <span className="text-[10px] text-slate-500">2 puntos</span>
              </div>
              <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200 text-center">
                <span className="font-bold text-orange-800 block text-sm">3</span>
                <span className="font-semibold text-orange-700 block">Casi siempre</span>
                <span className="text-[10px] text-slate-500">3 puntos</span>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center col-span-2 sm:col-span-1">
                <span className="font-bold text-rose-800 block text-sm">4</span>
                <span className="font-semibold text-rose-700 block">Siempre</span>
                <span className="text-[10px] text-slate-500">4 puntos</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Llenar con Datos Demo de Prueba</span>
            </button>
            <button
              type="button"
              onClick={startTest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer"
            >
              <span>Iniciar Cuestionario (35 Reactivos)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 sticky top-28 z-20">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-mono text-[11px]">{folio || 'SIN FOLIO'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">
                  Respondidas: <strong className="text-emerald-700">{answeredCount}</strong> de 35
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">{progressPercent}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  const startItem = i * pageSize + 1;
                  const endItem = Math.min((i + 1) * pageSize, PSYCHOSOCIAL_QUESTIONS.length);
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i);
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                        currentPage === i
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Pág {i + 1} ({startItem}-{endItem})
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="text-slate-400 hover:text-rose-600 p-1 text-[11px] flex items-center gap-1 cursor-pointer"
                title="Reiniciar cuestionario"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {currentQuestions.map((q) => {
              const selectedValue = answers[q.id];
              const dimMeta = PSYCHOSOCIAL_DIMENSIONS[q.dimension];
              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl p-5 border transition-all ${
                    selectedValue !== undefined
                      ? 'border-emerald-300 shadow-sm bg-gradient-to-r from-emerald-50/20 to-white'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {q.id}
                      </span>
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 mb-1">
                          {dimMeta.shortName}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {q.text}
                        </p>
                      </div>
                    </div>
                    {selectedValue !== undefined && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                    {PSYCHOSOCIAL_OPTIONS.map((opt) => {
                      const isSelected = selectedValue === opt.value;
                      let activeStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm';
                      if (opt.value === 4) activeStyle = 'bg-rose-600 text-white border-rose-600 shadow-sm';
                      else if (opt.value === 3) activeStyle = 'bg-orange-600 text-white border-orange-600 shadow-sm';
                      else if (opt.value === 2) activeStyle = 'bg-amber-600 text-white border-amber-600 shadow-sm';
                      else if (opt.value === 1) activeStyle = 'bg-teal-600 text-white border-teal-600 shadow-sm';

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, opt.value)}
                          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                            isSelected
                              ? activeStyle
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-sm font-black">{opt.value}</span>
                          <span className="text-[11px] font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => {
                setCurrentPage((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 180, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Página Anterior</span>
            </button>
            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
                  window.scrollTo({ top: 180, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition cursor-pointer"
              >
                <span>Siguiente Página</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Calificar y Generar Informe</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
