import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  FileText,
  ShieldCheck,
  Heart,
  Zap,
  Users,
  Brain,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  EmotionalIntelligenceRecord,
  IE_DIMENSIONS,
  IE_QUESTIONS,
} from '../../data/emotionalIntelligenceData';
import { generateEmotionalIntelligencePdf } from '../../services/emotionalIntelligencePdf';

interface EmotionalIntelligenceReportProps {
  record: EmotionalIntelligenceRecord;
  onSaveToGoogleSheets: (record: EmotionalIntelligenceRecord) => Promise<void>;
  isSavingToSheets: boolean;
  sheetsSavedSuccess: boolean;
  spreadsheetUrl: string | null;
  onNewEvaluation: () => void;
  onExportCSV: () => void;
}

export const EmotionalIntelligenceReport: React.FC<EmotionalIntelligenceReportProps> = ({
  record,
  onSaveToGoogleSheets,
  isSavingToSheets,
  sheetsSavedSuccess,
  onNewEvaluation,
  onExportCSV,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showQuestionsAudit, setShowQuestionsAudit] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateEmotionalIntelligencePdf(record);
    } catch (e) {
      console.error(e);
      alert('Error generando el reporte PDF de Inteligencia Emocional.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const dims = [
    {
      key: 'autoconocimiento',
      meta: IE_DIMENSIONS.autoconocimiento,
      data: record.dimensions.autoconocimiento,
      icon: Brain,
      color: 'blue',
    },
    {
      key: 'autocontrol',
      meta: IE_DIMENSIONS.autocontrol,
      data: record.dimensions.autocontrol,
      icon: ShieldCheck,
      color: 'indigo',
    },
    {
      key: 'automotivacion',
      meta: IE_DIMENSIONS.automotivacion,
      data: record.dimensions.automotivacion,
      icon: Zap,
      color: 'amber',
    },
    {
      key: 'empatia',
      meta: IE_DIMENSIONS.empatia,
      data: record.dimensions.empatia,
      icon: Heart,
      color: 'rose',
    },
    {
      key: 'habilidades_sociales',
      meta: IE_DIMENSIONS.habilidades_sociales,
      data: record.dimensions.habilidades_sociales,
      icon: Users,
      color: 'emerald',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Informe Diagnóstico – Inteligencia Emocional
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Licenciatura en Enseñanza de Lenguas Extranjeras (Español e Inglés) – Cuestionario de 45 Reactivos
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generando PDF...' : 'Descargar Reporte PDF'}</span>
            </button>
            <button
              onClick={() => onSaveToGoogleSheets(record)}
              disabled={isSavingToSheets}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow transition cursor-pointer ${
                sheetsSavedSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>
                {isSavingToSheets
                  ? 'Guardando...'
                  : sheetsSavedSuccess
                  ? 'Guardado en Google Sheets ✓'
                  : 'Guardar en Google Sheets'}
              </span>
            </button>
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onNewEvaluation}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition cursor-pointer"
            >
              <span>Nueva Evaluación</span>
            </button>
          </div>
        </div>

        {/* Candidate Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-6 text-xs">
          <div className="sm:col-span-2">
            <span className="text-slate-400 font-medium block">Aspirante:</span>
            <span className="font-extrabold text-slate-900 text-sm">{record.name}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Folio de Admisión:</span>
            <span className="font-bold text-slate-800 text-sm">{record.folio}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Sexo:</span>
            <span className="font-bold text-slate-800">
              {record.gender === 'M' ? 'Hombre' : 'Mujer'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Edad y Énfasis:</span>
            <span className="font-bold text-slate-800">
              {record.age} años • {record.emphasis}
            </span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Fecha de Evaluación:</span>
            <span className="font-bold text-slate-800">
              {new Date(record.timestamp).toLocaleDateString('es-MX')}
            </span>
          </div>
        </div>
      </div>

      {/* Global Score & Verdict Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-72 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 text-center space-y-2 flex-shrink-0 shadow-lg shadow-blue-900/20">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block">
              Puntuación Global Obtenida
            </span>
            <div className="text-5xl font-black text-white tracking-tight">
              {record.totalScore}
              <span className="text-xl text-blue-300 font-normal"> / 90</span>
            </div>
            <div className="text-xs text-blue-200 font-medium">
              Equivalente al <strong>{record.percentage}%</strong> de la escala
            </div>
            <div className="pt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  record.level.code === 'MUY_ALTO'
                    ? 'bg-emerald-500 text-white'
                    : record.level.code === 'MEDIO_ALTO'
                    ? 'bg-blue-500 text-white'
                    : record.level.code === 'MEDIO_BAJO'
                    ? 'bg-amber-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                Nivel {record.level.label}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Significado y Diagnóstico Oficial de la Puntuación
              </h3>
            </div>
            <blockquote className="p-4 rounded-xl bg-slate-50 border-l-4 border-blue-600 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "{record.level.officialDescription}"
            </blockquote>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>0-20 Muy Bajo</span>
                <span>21-35 Bajo</span>
                <span>36-45 Medio-Bajo</span>
                <span className="text-blue-700 font-bold">46-79 Medio-Alto</span>
                <span className="text-emerald-700 font-bold">80-90 Muy Alto</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-400 w-[22.2%]" title="Muy Bajo (0-20)"></div>
                <div className="h-full bg-amber-400 w-[16.6%]" title="Bajo (21-35)"></div>
                <div className="h-full bg-yellow-400 w-[11.1%]" title="Medio-Bajo (36-45)"></div>
                <div className="h-full bg-blue-500 w-[37.7%]" title="Medio-Alto (46-79)"></div>
                <div className="h-full bg-emerald-500 w-[12.4%]" title="Muy Alto (80-90)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: 5 DIMENSIONES --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Desglose por Competencias Emocionales (5 Dimensiones)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Puntuación obtenida y porcentaje en cada subescala del comportamiento interpersonal e intrapersonal
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dims.map((dim) => {
            const Icon = dim.icon;
            return (
              <div
                key={dim.key}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <span>{dim.meta.name}</span>
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {dim.data.score} / {dim.data.maxScore} pts
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Desarrollo:</span>
                      <span className="text-blue-700 font-black">{dim.data.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${dim.data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {dim.meta.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 text-[11px]">
                  <strong className="text-blue-900 block font-bold mb-0.5">En el aula de idiomas:</strong>
                  <span className="text-slate-600">{dim.meta.teachingRelevance}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SECTION 2: ANÁLISIS VOCACIONAL --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Perfil y Conclusiones Pedagógicas para la Formación Docente Bilingüe</span>
          </h3>
          <p className="text-xs text-slate-500">
            Recomendaciones para el acompañamiento en la Licenciatura en Enseñanza de Lenguas Extranjeras
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-3">
            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Implicación en la Docencia de Español e Inglés:</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {record.level.languageTeacherImplication}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200 space-y-3">
            <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Estrategias de Acompañamiento Psicopedagógico:</span>
            </h4>
            <div className="space-y-2 text-slate-700">
              <div className="p-2.5 rounded-lg bg-white border border-indigo-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Talleres de Resiliencia Pedagógica:</strong> Prácticas de microenseñanza con retroalimentación formativa y regulación ante errores.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-indigo-100 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Comunicación Asertiva y Resolución de Conflictos:</strong> Simulación de situaciones imprevistas con estudiantes diversos o padres de familia.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: AUDITORÍA DE RESPUESTAS --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>Auditoría de Respuestas a los 45 Reactivos</span>
            </h3>
            <p className="text-xs text-slate-500">
              Desglose detallado de cada comportamiento registrado por el evaluador o aspirante
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowQuestionsAudit(!showQuestionsAudit)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            <span>{showQuestionsAudit ? 'Ocultar Detalle' : 'Mostrar 45 Reactivos'}</span>
            {showQuestionsAudit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showQuestionsAudit && (
          <div className="pt-2 overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3 py-2.5 w-12 text-center">N°</th>
                  <th className="px-3 py-2.5">Comportamiento</th>
                  <th className="px-3 py-2.5 text-center w-28">Dimensión</th>
                  <th className="px-3 py-2.5 text-center w-36">Respuesta</th>
                  <th className="px-3 py-2.5 text-center w-20">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {IE_QUESTIONS.map((q) => {
                  const ans = record.answers[q.id];
                  const pts = ans === 'siempre' ? 2 : ans === 'algunas_veces' ? 1 : 0;
                  return (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-center font-bold text-slate-800">{q.id}</td>
                      <td className="px-3 py-2 text-slate-700">{q.text}</td>
                      <td className="px-3 py-2 text-center text-slate-500 capitalize">
                        {q.dimension.replace('_', ' ')}
                      </td>
                      <td className="px-3 py-2 text-center font-bold">
                        {ans === 'siempre' ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Siempre
                          </span>
                        ) : ans === 'algunas_veces' ? (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            Algunas veces
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            Nunca
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center font-black text-blue-900">{pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
