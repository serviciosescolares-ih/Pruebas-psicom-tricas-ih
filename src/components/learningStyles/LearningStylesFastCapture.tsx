import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  Keyboard,
} from 'lucide-react';
import {
  calculateLearningStyleScores,
  generateSampleLearningStyleAnswers,
  LearningStyleRecord,
} from '../../data/learningStylesData';

interface LearningStylesFastCaptureProps {
  onGenerateReport: (record: LearningStyleRecord) => void;
}

export const LearningStylesFastCapture: React.FC<LearningStylesFastCaptureProps> = ({
  onGenerateReport,
}) => {
  const [name, setName] = useState('');
  const [folio, setFolio] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('F');
  const [age, setAge] = useState<number>(20);
  const [emphasis, setEmphasis] = useState('Español e Inglés');
  const [answers, setAnswers] = useState<Record<number, 'a' | 'b' | 'c'>>({});
  const [activeQuestion, setActiveQuestion] = useState<number>(1);

  const columns = [
    { start: 1, end: 10 },
    { start: 11, end: 20 },
    { start: 21, end: 30 },
    { start: 31, end: 40 },
  ];

  const handleSetAnswer = (qNum: number, choice: 'a' | 'b' | 'c') => {
    setAnswers((prev) => ({ ...prev, [qNum]: choice }));
    if (qNum < 40) {
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
      if (key === 'a' || key === 'b' || key === 'c') {
        e.preventDefault();
        handleSetAnswer(activeQuestion, key);
      } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setActiveQuestion((prev) => (prev < 40 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveQuestion((prev) => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveQuestion((prev) => Math.min(40, prev + 10));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveQuestion((prev) => Math.max(1, prev - 10));
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

  const handleFillDemo = (type: 'visual' | 'auditivo' | 'kinestesico' = 'visual') => {
    const demo = generateSampleLearningStyleAnswers(type);
    setAnswers(demo);
    if (!name) setName('Enrique Manuel Servín Pappalardo');
    if (!folio) setFolio('LELE-VAK-2026-004');
    setAge(21);
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas limpiar todas las respuestas?')) {
      setAnswers({});
      setActiveQuestion(1);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Por favor escribe el nombre del aspirante.');
      return;
    }
    if (answeredCount < 40) {
      const confirmSubmit = window.confirm(
        `Se han capturado ${answeredCount} de las 40 respuestas. ¿Deseas generar el reporte con los reactivos actuales?`
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
    onGenerateReport(record);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Hoja de Captura Rápida – Estilos de Aprendizaje PNL (40 reactivos)
              </h2>
              <p className="text-xs text-slate-500">
                A = Auditivo • B = Visual • C = Kinestésico – Vaciado rápido de exámenes en papel
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => handleFillDemo('visual')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition border border-blue-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cargar Ejemplo</span>
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 font-semibold transition border border-slate-200 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
            <div className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg font-bold">
              {answeredCount} / 40 capturadas
            </div>
          </div>
        </div>

        {/* Candidate Information Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-5">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Nombre del Aspirante:
            </label>
            <input
              type="text"
              placeholder="Ej. Enrique Manuel Servín Pappalardo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Folio de Admisión:
            </label>
            <input
              type="text"
              placeholder="LELE-VAK-2026-004"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Sexo:
            </label>
            <div className="flex gap-4 pt-1.5 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="vak_capture_gender"
                  checked={gender === 'F'}
                  onChange={() => setGender('F')}
                  className="text-blue-600"
                />
                <span>Mujer</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="vak_capture_gender"
                  checked={gender === 'M'}
                  onChange={() => setGender('M')}
                  className="text-blue-600"
                />
                <span>Hombre</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Edad (años):
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 18)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* Keyboard Helper */}
        <div className="mt-4 bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">Captura Rápida por Teclado:</span>
            <span>
              Presione <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-300 font-bold">A</kbd> (Auditivo), <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-300 font-bold">B</kbd> (Visual) o <kbd className="px-1.5 py-0.5 bg-white rounded border border-blue-300 font-bold">C</kbd> (Kinestésico) para registrar y avanzar al siguiente reactivo.
            </span>
          </div>
          <span className="text-[11px] text-blue-700">
            Reactivo activo: <strong className="text-blue-950 font-bold">#{activeQuestion}</strong>
          </span>
        </div>
      </div>

      {/* 4-Columns Grid View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="bg-slate-50/60 rounded-xl p-3 border border-slate-200">
              <div className="text-xs font-bold text-blue-800 text-center pb-2 border-b border-slate-200 mb-2">
                Reactivos {col.start} a {col.end}
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: col.end - col.start + 1 }, (_, i) => {
                  const qNum = col.start + i;
                  const currentAns = answers[qNum];
                  const isActive = activeQuestion === qNum;
                  return (
                    <div
                      key={qNum}
                      onClick={() => setActiveQuestion(qNum)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400'
                          : currentAns
                          ? 'bg-blue-100/60 text-slate-800'
                          : 'hover:bg-slate-200/50 text-slate-600'
                      }`}
                    >
                      <span className={`w-7 font-bold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                        #{qNum}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {(['a', 'b', 'c'] as const).map((opt) => {
                          const isSelected = currentAns === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetAnswer(qNum, opt);
                              }}
                              className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center transition border ${
                                isSelected
                                  ? isActive
                                    ? 'bg-white text-blue-800 border-white shadow-sm'
                                    : 'bg-blue-600 text-white border-blue-600'
                                  : isActive
                                  ? 'bg-blue-700/60 text-blue-100 border-blue-400 hover:bg-blue-500'
                                  : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {opt}
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

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Total reactivos contestados:{' '}
            <strong className="text-slate-800 text-sm">{answeredCount} de 40</strong>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition cursor-pointer text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Generar Reporte de Estilos de Aprendizaje</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
