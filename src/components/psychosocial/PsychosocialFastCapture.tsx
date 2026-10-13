import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  Keyboard,
  Info,
} from 'lucide-react';
import {
  calculatePsychosocialScores,
  generateSamplePsychosocialAnswers,
  PsychosocialRecord,
  PSYCHOSOCIAL_QUESTIONS,
  PsychosocialOption,
} from '../../data/psychosocialData';

interface PsychosocialFastCaptureProps {
  onGenerateReport: (record: PsychosocialRecord) => void;
}

export const PsychosocialFastCapture: React.FC<PsychosocialFastCaptureProps> = ({
  onGenerateReport,
}) => {
  const [name, setName] = useState('');
  const [folio, setFolio] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [age, setAge] = useState<number>(20);
  const [emphasis, setEmphasis] = useState('Español e Inglés');
  const [answers, setAnswers] = useState<Record<number, PsychosocialOption>>({});
  const [activeQuestion, setActiveQuestion] = useState<number>(1);

  const columns = [
    { start: 1, end: 12 },
    { start: 13, end: 24 },
    { start: 25, end: 35 },
  ];

  const handleSetAnswer = (qNum: number, choice: PsychosocialOption) => {
    setAnswers((prev) => ({ ...prev, [qNum]: choice }));
    if (qNum < 35) {
      setActiveQuestion(qNum + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      const key = e.key;
      if (key === '0') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 0);
      } else if (key === '1') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 1);
      } else if (key === '2') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 2);
      } else if (key === '3') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 3);
      } else if (key === '4') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 4);
      } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setActiveQuestion((prev) => (prev < 35 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveQuestion((prev) => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveQuestion((prev) => Math.min(35, prev + 12));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveQuestion((prev) => Math.max(1, prev - 12));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        setAnswers((prev) => {
          const updated = { ...prev };
          delete updated[activeQuestion];
          return updated;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuestion]);

  const answeredCount = Object.keys(answers).length;

  const handleFillDemo = () => {
    setName('Andrea Paola Villalobos');
    setFolio(`PSICO-${Math.floor(1000 + Math.random() * 9000)}`);
    setAge(21);
    setGender('F');
    setEmphasis('Español e Inglés');
    setAnswers(generateSamplePsychosocialAnswers());
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas borrar todas las respuestas capturadas?')) {
      setAnswers({});
      setActiveQuestion(1);
    }
  };

  const handleProcess = () => {
    if (!name.trim()) {
      alert('Por favor escribe el nombre completo del aspirante.');
      return;
    }
    if (answeredCount < 35) {
      const confirmCont = window.confirm(
        `Se han capturado ${answeredCount} de 35 respuestas. ¿Deseas calificar ahora? Los reactivos vacíos sumarán 0 puntos.`
      );
      if (!confirmCont) return;
    }
    const record = calculatePsychosocialScores(answers, {
      name,
      folio: folio || `PSICO-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      age,
      emphasis,
    });
    onGenerateReport(record);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Módulo 4 – Captura Rápida de Hojas Físicas</span>
          </div>
          <h2 className="text-xl font-black">
            Hoja de Captura Rápida: Bienestar Psicosocial
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            Vacía rápidamente los cuestionarios impresos aplicando la escala Likert del 0 al 4 con teclado o ratón
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Demo Rápido</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-400/30 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Candidate Data Row */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Datos de Identificación del Aspirante
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Andrea Paola Villalobos"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Folio de Admisión
            </label>
            <input
              type="text"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              placeholder="LELE-PS-044"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Sexo y Edad
            </label>
            <div className="flex gap-2">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none"
              >
                <option value="F">Mujer</option>
                <option value="M">Hombre</option>
              </select>
              <input
                type="number"
                min={15}
                max={80}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 text-xs outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Énfasis
            </label>
            <select
              value={emphasis}
              onChange={(e) => setEmphasis(e.target.value)}
              className="w-full px-2 py-2 rounded-lg border border-slate-300 text-xs bg-white outline-none"
            >
              <option value="Español e Inglés">Español e Inglés</option>
              <option value="Inglés">Inglés</option>
              <option value="Español">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold">Captura ultrarrápida con teclado:</span>
          <span>Presiona <strong>0</strong> (Nunca), <strong>1</strong> (Casi nunca), <strong>2</strong> (Algunas veces), <strong>3</strong> (Casi siempre) o <strong>4</strong> (Siempre).</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Flechas: navegar</span>
          <span>•</span>
          <span>Reactivo activo: <strong className="text-emerald-800 font-mono">#{activeQuestion}</strong></span>
          <span>•</span>
          <span>Progreso: <strong className="text-emerald-800">{answeredCount}/35</strong></span>
        </div>
      </div>

      {/* 3 Columns Grid of 35 items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Reactivos {col.start} al {col.end}</span>
              <span className="text-[10px] text-slate-500 font-normal">Escala 0 al 4</span>
            </div>
            <div className="divide-y divide-slate-100">
              {Array.from(
                { length: col.end - col.start + 1 },
                (_, i) => col.start + i
              ).map((qNum) => {
                const currentAns = answers[qNum];
                const isActive = activeQuestion === qNum;
                const questionData = PSYCHOSOCIAL_QUESTIONS.find((q) => q.id === qNum);
                return (
                  <div
                    key={qNum}
                    onClick={() => setActiveQuestion(qNum)}
                    className={`px-3 py-2 flex items-center justify-between gap-2 text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-100/70 ring-1 ring-emerald-500 z-10'
                        : currentAns !== undefined
                        ? 'bg-emerald-50/20 hover:bg-slate-50'
                        : 'hover:bg-slate-50'
                    }`}
                    title={questionData?.text}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          isActive
                            ? 'bg-emerald-700 text-white'
                            : currentAns !== undefined
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {qNum}
                      </span>
                      <span className="truncate text-slate-700 text-[11px] max-w-[130px]">
                        {questionData?.text || `Reactivo ${qNum}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {[0, 1, 2, 3, 4].map((val) => {
                        const isVal = currentAns === val;
                        let btnColor = 'bg-emerald-600 text-white';
                        if (val === 4) btnColor = 'bg-rose-600 text-white';
                        else if (val === 3) btnColor = 'bg-orange-600 text-white';
                        else if (val === 2) btnColor = 'bg-amber-600 text-white';
                        else if (val === 1) btnColor = 'bg-teal-600 text-white';
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetAnswer(qNum, val as PsychosocialOption);
                            }}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition cursor-pointer ${
                              isVal
                                ? `${btnColor} shadow-sm font-black`
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Footer */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Respondidos: <strong className="text-emerald-700 font-bold">{answeredCount}</strong> de 35 reactivos
            {answeredCount === 35 && (
              <span className="ml-2 text-emerald-600 font-bold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Cuestionario completo!
              </span>
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={handleProcess}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer"
        >
          <span>Calificar y Ver Informe Gráfico</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
