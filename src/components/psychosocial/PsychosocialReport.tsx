import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  CheckCircle,
  GraduationCap,
  Sparkles,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Activity,
  Lightbulb,
  Building,
  Clock,
  Sliders,
  Users2,
} from 'lucide-react';
import {
  PsychosocialRecord,
  PSYCHOSOCIAL_DIMENSIONS,
  PSYCHOSOCIAL_QUESTIONS,
  PsychosocialDimensionKey,
} from '../../data/psychosocialData';
import { generatePsychosocialPdf } from '../../services/psychosocialPdf';

interface PsychosocialReportProps {
  record: PsychosocialRecord;
  onSaveToGoogleSheets: (record: PsychosocialRecord) => Promise<void>;
  isSavingToSheets: boolean;
  sheetsSavedSuccess: boolean;
  spreadsheetUrl: string | null;
  onNewEvaluation: () => void;
  onExportCSV: () => void;
}

export const PsychosocialReport: React.FC<PsychosocialReportProps> = ({
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
      await generatePsychosocialPdf(record);
    } catch (e) {
      console.error(e);
      alert('Error generando el informe PDF de Bienestar Psicosocial.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const dimIcons: Record<PsychosocialDimensionKey, any> = {
    ambiente_entorno: Building,
    carga_ritmo: Clock,
    control_autonomia: Sliders,
    liderazgo_relaciones: Users2,
    balance_desgaste: Activity,
  };

  const dimsList: PsychosocialDimensionKey[] = [
    'ambiente_entorno',
    'carga_ritmo',
    'control_autonomia',
    'liderazgo_relaciones',
    'balance_desgaste',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <GraduationCap className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Informe Diagnóstico – Clima y Bienestar Psicosocial
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Licenciatura en Enseñanza de Lenguas Extranjeras (Español e Inglés) – Escala Likert de 35 Reactivos (0 al 4)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generando PDF...' : 'Descargar PDF Institucional'}</span>
            </button>
            <button
              onClick={() => onSaveToGoogleSheets(record)}
              disabled={isSavingToSheets}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                sheetsSavedSuccess
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
            >
              {sheetsSavedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>¡Guardado en Sheets!</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{isSavingToSheets ? 'Guardando...' : 'Guardar en Google Sheets'}</span>
                </>
              )}
            </button>
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              title="Descargar base en CSV"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>CSV</span>
            </button>
            <button
              onClick={onNewEvaluation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nueva Evaluación</span>
            </button>
          </div>
        </div>

        {/* Candidate Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Aspirante / Docente</span>
            <span className="font-bold text-slate-800 text-sm truncate block mt-0.5">{record.name}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Folio de Admisión</span>
            <span className="font-mono font-bold text-emerald-700 text-sm block mt-0.5">{record.folio}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Sexo y Edad</span>
            <span className="font-bold text-slate-800 text-sm block mt-0.5">
              {record.gender === 'M' ? 'Hombre' : 'Mujer'} • {record.age} a
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Énfasis</span>
            <span className="font-bold text-slate-800 text-sm block mt-0.5">{record.emphasis}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 text-[11px] block font-medium">Fecha y Hora</span>
            <span className="font-medium text-slate-700 text-xs block mt-0.5">
              {new Date(record.timestamp).toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-emerald-700 text-[11px] block font-medium">Nivel de Riesgo</span>
            <span className="font-black text-emerald-800 text-sm block mt-0.5">
              {record.level.label}
            </span>
          </div>
        </div>
      </div>

      {/* Global Score & Verdict Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ÍNDICE GLOBAL DE RIESGO</span>
            </div>
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tight my-2">
              {record.totalScore}
              <span className="text-lg sm:text-xl font-normal text-slate-300"> / 140 pts</span>
            </div>
            <div className="text-xs text-emerald-200 font-medium">
              Porcentaje de Carga/Riesgo: <strong>{record.percentage}%</strong>
            </div>
            <div className="mt-4 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border shadow-sm uppercase"
              style={{
                backgroundColor: `${record.level.barColor}25`,
                borderColor: record.level.barColor,
                color: record.level.barColor === '#10b981' ? '#34d399' : '#fbbf24',
              }}
            >
              {record.level.friendlyTitle}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                Diagnóstico del Clima y Entorno Psicosocial
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {record.level.friendlyTitle} ({record.level.label})
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {record.level.officialDescription}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
                <span>Escala Global de Exposición a Factores de Riesgo</span>
                <span>{record.percentage}% ({record.totalScore} de 140)</span>
              </div>
              <div className="w-full bg-slate-700/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-600">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${record.percentage}%`,
                    backgroundColor: record.level.barColor,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 pts (Óptimo)</span>
                <span>28 (Nulo)</span>
                <span>56 (Bajo)</span>
                <span>84 (Medio)</span>
                <span>112 (Alto)</span>
                <span>140 pts (Crítico)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
              <strong className="text-emerald-300 block mb-1">
                Implicación para Docentes de Lenguas Extranjeras (Español e Inglés)
              </strong>
              {record.level.teachingImplication}
            </div>
          </div>
        </div>
      </div>

      {/* 5 Dimensions Cards Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Desglose por Factores Psicosociales Evaluados</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            5 dimensiones fundamentales del entorno, la carga mental, autonomía y relaciones interpersonales (7 reactivos c/u, máx 28 pts).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dimsList.map((key) => {
            const meta = PSYCHOSOCIAL_DIMENSIONS[key];
            const data = record.dimensions[key];
            const Icon = dimIcons[key];
            return (
              <div
                key={key}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {meta.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {meta.questionIds.length} Reactivos
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                    {meta.description}
                  </p>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">Puntaje obtenido:</span>
                      <span className="text-slate-900 font-mono">
                        {data.score} / {data.maxScore} pts ({data.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${data.percentage}%`,
                          backgroundColor:
                            data.percentage > 60
                              ? '#ef4444'
                              : data.percentage > 40
                              ? '#f59e0b'
                              : data.percentage > 20
                              ? '#14b8a6'
                              : '#10b981',
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center pt-1 text-[10px]">
                      <span className="text-slate-400 font-medium">Clasificación:</span>
                      <span className="font-bold text-emerald-700">{data.riskLevel}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100 mb-2">
                    <strong className="text-emerald-900 block font-semibold mb-0.5">
                      Impacto en la enseñanza de idiomas:
                    </strong>
                    {meta.teachingRelevance}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-100 italic">
                  <strong>Consejo:</strong> {meta.preventiveAdvice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations & Action Plan */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Recomendaciones Preventivas y Plan de Cuidado Integral</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {record.level.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsible Full Answer Audit */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowQuestionsAudit(!showQuestionsAudit)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Auditoría Detallada de Respuestas (35 Reactivos)
              </h3>
              <p className="text-xs text-slate-500">
                Revisa la respuesta asignada en la escala Likert (0 al 4) para cada reactivo específico.
              </p>
            </div>
          </div>
          {showQuestionsAudit ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showQuestionsAudit && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-200">
            <div className="divide-y divide-slate-100">
              {PSYCHOSOCIAL_QUESTIONS.map((q) => {
                const ansVal = record.answers[q.id] ?? 0;
                const dimMeta = PSYCHOSOCIAL_DIMENSIONS[q.dimension];
                let tagColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                if (ansVal === 4) tagColor = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
                else if (ansVal === 3) tagColor = 'bg-orange-100 text-orange-800 border-orange-200';
                else if (ansVal === 2) tagColor = 'bg-amber-100 text-amber-800 border-amber-200';
                else if (ansVal === 1) tagColor = 'bg-teal-100 text-teal-800 border-teal-200';
                const optionLabels = ['0 - Nunca', '1 - Casi nunca', '2 - Algunas veces', '3 - Casi siempre', '4 - Siempre'];

                return (
                  <div key={q.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                        {q.id}
                      </span>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {dimMeta.shortName}
                        </span>
                        <p className="text-slate-800 font-medium">{q.text}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[11px] shrink-0 font-medium ${tagColor}`}>
                      {optionLabels[ansVal]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
