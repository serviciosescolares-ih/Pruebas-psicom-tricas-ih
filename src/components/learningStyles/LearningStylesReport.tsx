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
  Lightbulb,
  Eye,
  Volume2,
  Activity,
} from 'lucide-react';
import { LearningStyleRecord, CHANNELS_DATA } from '../../data/learningStylesData';
import { generateLearningStylesPdf } from '../../services/learningStylesPdf';

interface LearningStylesReportProps {
  record: LearningStyleRecord;
  onSaveToGoogleSheets: (record: LearningStyleRecord) => Promise<void>;
  isSavingToSheets: boolean;
  sheetsSavedSuccess: boolean;
  spreadsheetUrl: string | null;
  onNewEvaluation: () => void;
  onExportCSV: () => void;
}

export const LearningStylesReport: React.FC<LearningStylesReportProps> = ({
  record,
  onSaveToGoogleSheets,
  isSavingToSheets,
  sheetsSavedSuccess,
  onNewEvaluation,
  onExportCSV,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generateLearningStylesPdf(record);
    } catch (e) {
      console.error(e);
      alert('Error generando el PDF de Estilos de Aprendizaje.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const primaryKey =
    record.counts.visual >= record.counts.auditivo && record.counts.visual >= record.counts.kinestesico
      ? 'visual'
      : record.counts.auditivo >= record.counts.kinestesico
      ? 'auditivo'
      : 'kinestesico';

  const channelMeta = CHANNELS_DATA[primaryKey];

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
                Informe Diagnóstico – Estilos de Aprendizaje (Modelo PNL)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Licenciatura en Enseñanza de Lenguas Extranjeras (Español e Inglés) – Modelo VAK de 40 Reactivos
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

        {/* Predominant Banner */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
              {channelMeta.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                  Canal Perceptual Predominante:
                </span>
                <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${channelMeta.badgeBg}`}>
                  {record.predominantStyle}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{channelMeta.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 1: GRÁFICO DE DISTRIBUCIÓN VAK --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Distribución Porcentual y Conteo de Reactivos (40 Totales)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Comparativa de los 3 canales de acceso a la información según el Modelo PNL de Eric de la Parra Paz
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Visual Channel Card */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                <Eye className="w-5 h-5 text-blue-600" />
                <span>Canal Visual (V)</span>
              </span>
              <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {record.counts.visual} de 40
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-blue-700">{record.percentages.visual}%</span>
                <span className="text-xs text-slate-500 font-medium">del perfil total</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${record.percentages.visual}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {CHANNELS_DATA.visual.description}
            </p>
          </div>

          {/* Auditivo Channel Card */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                <span>Canal Auditivo (A)</span>
              </span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {record.counts.auditivo} de 40
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-emerald-700">{record.percentages.auditivo}%</span>
                <span className="text-xs text-slate-500 font-medium">del perfil total</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${record.percentages.auditivo}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {CHANNELS_DATA.auditivo.description}
            </p>
          </div>

          {/* Kinestésico Channel Card */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                <Activity className="w-5 h-5 text-amber-600" />
                <span>Canal Kinestésico (K)</span>
              </span>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {record.counts.kinestesico} de 40
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-amber-700">{record.percentages.kinestesico}%</span>
                <span className="text-xs text-slate-500 font-medium">del perfil total</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${record.percentages.kinestesico}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {CHANNELS_DATA.kinestesico.description}
            </p>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: IMPLICACIONES PARA LA ENSEÑANZA --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Perfil del Futuro Docente de Lenguas Extranjeras (Español e Inglés)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Orientación psicopedagógica para su proceso formativo y su futura práctica en aula bilingüe
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-3">
            <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Cómo Asimila Mejor el Inglés y Español:</span>
            </h4>
            <p className="text-slate-700">{channelMeta.languageLearningProfile}</p>
            <div className="pt-2 border-t border-blue-200/60">
              <span className="font-bold text-blue-950 block mb-1">Rasgos distintivos observados:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {channelMeta.traits.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200 space-y-3">
            <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Tendencia y Estilo en la Docencia de Idiomas:</span>
            </h4>
            <p className="text-slate-700">{channelMeta.languageTeachingProfile}</p>
            <div className="pt-2 border-t border-indigo-200/60">
              <span className="font-bold text-indigo-950 block mb-1">Recomendación pedagógica clave:</span>
              <p className="text-slate-600">
                Los docentes suelen enseñar en el canal en que aprenden. Es fundamental que desarrolle competencias para planear clases multimodales que atiendan a alumnos visuales, auditivos y kinestésicos por igual.
              </p>
            </div>
          </div>
        </div>

        {/* Strategies Section */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Estrategias Didácticas Sugeridas para el Aula Bilingüe:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {channelMeta.recommendedStrategies.map((strat, idx) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-slate-700 text-xs">{strat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
