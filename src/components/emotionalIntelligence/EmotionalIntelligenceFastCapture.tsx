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
  calculateEmotionalIntelligenceScores,
  generateSampleIEAnswers,
  EmotionalIntelligenceRecord,
  IE_QUESTIONS,
  IEOption,
} from '../../data/emotionalIntelligenceData';

interface EmotionalIntelligenceFastCaptureProps {
  onGenerateReport: (record: EmotionalIntelligenceRecord) => void;
}

export const EmotionalIntelligenceFastCapture: React.FC<EmotionalIntelligenceFastCaptureProps> = ({
  onGenerateReport,
}) => {
  const [name, setName] = useState('');
  const [folio, setFolio] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [age, setAge] = useState<number>(20);
  const [emphasis, setEmphasis] = useState('Español e Inglés');
  const [answers, setAnswers] = useState<Record<number, IEOption>>({});
  const [activeQuestion, setActiveQuestion] = useState<number>(1);

  const columns = [
    { start: 1, end: 15 },
    { start: 16, end: 30 },
    { start: 31, end: 45 },
  ];

  const handleSetAnswer = (qNum: number, choice: IEOption) => {
    setAnswers((prev) => ({ ...prev, [qNum]: choice }));
    if (qNum < 45) {
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
      const key = e.key.toLowerCase();
      if (key === '0' || key === 'n') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 'nunca');
      } else if (key === '1' || key === 'a') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 'algunas_veces');
      } else if (key === '2' || key === 's') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, 'siempre');
      } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setActiveQuestion((prev) => (prev < 45 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveQuestion((prev) => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveQuestion((prev) => Math.min(45, prev + 15));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveQuestion((prev) => Math.max(1, prev - 15));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        setAnswers((prev) => {
          const next = { ...prev };
          delete next[activeQuestion];
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuestion]);

  const answeredCount = Object.keys(answers).length;

  const handleFillDemo = (level: 'muy_alto' | 'medio_alto' | 'medio_bajo' | 'bajo' = 'medio_alto') => {
    const demo = generateSampleIEAnswers(level);
    setAnswers(demo);
    if (!name) setName('Rodrigo Galindo Hinojosa');
    if (!folio) setFolio('LELE-IE-2026-042');
    setAge(21);
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas limpiar todas las respuestas capturadas?')) {
      setAnswers({});
      setActiveQuestion(1);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Por favor introduce el nombre del aspirante.');
      return;
    }
    if (answeredCount < 45) {
      const confirmContinue = window.confirm(
        `Has capturado ${answeredCount} de 45 reactivos. Los no capturados se registrarán con 0 puntos (Nunca). ¿Deseas continuar?`
      );
      if (!confirmContinue) return;
    }
    const record = calculateEmotionalIntelligenceScores(answers, {
      name,
      folio: folio || `IE-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      age,
      emphasis,
    });
    onGenerateReport(record);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Captura Rápida – Test de Inteligencia Emocional (45 Reactivos)
              </h2>
              <p className="text-xs text-slate-500">
                Transcripción rápida de hojas de respuestas en papel con atajos de teclado
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFillDemo('medio_alto')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Ejemplo</span>
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        {/* Candidate Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Nombre del Aspirante *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Rodrigo Galindo Hinojosa"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Folio
            </label>
            <input
              type="text"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              placeholder="LELE-IE-2026-042"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Sexo y Edad
            </label>
            <div className="flex gap-2">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 outline-none text-xs bg-white"
              >
                <option value="F">Mujer</option>
                <option value="M">Hombre</option>
              </select>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                className="w-1/2 px-2 py-2 rounded-lg border border-slate-300 outline-none text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Énfasis
            </label>
            <select
              value={emphasis}
              onChange={(e) => setEmphasis(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none text-xs bg-white"
            >
              <option value="Español e Inglés">Español e Inglés</option>
              <option value="Inglés">Inglés</option>
              <option value="Español">Español</option>
            </select>
          </div>
        </div>

        {/* Keyboard Helper */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">Atajos de Teclado:</span>
            <span>
              Presiona <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold">0</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold">N</kbd> (Nunca), <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold">1</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold">A</kbd> (Algunas veces), <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold">2</kbd> o <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-bold">S</kbd> (Siempre).
            </span>
          </div>
          <div className="flex items-center gap-3 font-semibold">
            <span>
              Capturados: <strong className="text-blue-700">{answeredCount} de 45</strong>
            </span>
            <span className="text-slate-400">•</span>
            <span>
              Activo: <strong className="text-slate-900">Reactivo #{activeQuestion}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Columns Grid of 15 Items each */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col, cIdx) => (
          <div
            key={cIdx}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
          >
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Reactivos {col.start} a {col.end}</span>
              <span className="text-[11px] text-slate-500 font-normal">
                0=Nunca • 1=Algunas • 2=Siempre
              </span>
            </div>
            <div className="divide-y divide-slate-100 p-2 flex-1">
              {Array.from({ length: col.end - col.start + 1 }, (_, idx) => {
                const qNum = col.start + idx;
                const ans = answers[qNum];
                const isActive = activeQuestion === qNum;
                const qData = IE_QUESTIONS.find((item) => item.id === qNum);
                return (
                  <div
                    key={qNum}
                    onClick={() => setActiveQuestion(qNum)}
                    className={`p-2 rounded-xl transition flex items-center justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-blue-100/70 ring-2 ring-blue-500'
                        : ans
                        ? 'bg-slate-50/70 hover:bg-slate-100'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : ans
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {qNum}
                      </span>
                      <span
                        className="text-[11px] text-slate-700 truncate"
                        title={qData?.text}
                      >
                        {qData?.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetAnswer(qNum, 'nunca');
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          ans === 'nunca'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700'
                        }`}
                        title="Nunca (0 puntos)"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetAnswer(qNum, 'algunas_veces');
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          ans === 'algunas_veces'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                        }`}
                        title="Algunas veces (1 punto)"
                      >
                        1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetAnswer(qNum, 'siempre');
                        }}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                          ans === 'siempre'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700'
                        }`}
                        title="Siempre (2 puntos)"
                      >
                        2
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Bar */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600" />
          <span>
            Puntaje acumulado actual:{' '}
            <strong className="text-blue-700 font-bold">
              {Object.values(answers).reduce(
                (sum, val) => sum + (val === 'siempre' ? 2 : val === 'algunas_veces' ? 1 : 0),
                0
              )}{' '}
              de 90 puntos
            </strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Calificar y Generar Reporte de Inteligencia Emocional</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
