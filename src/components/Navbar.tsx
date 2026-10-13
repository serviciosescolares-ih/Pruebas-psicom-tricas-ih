import React from 'react';
import {
  GraduationCap,
  FileSpreadsheet,
  BarChart3,
  ClipboardPen,
  History,
  LogOut,
  Zap,
  Cloud,
  Layers,
  Brain,
  Compass,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { User } from 'firebase/auth';

export type AppModule = '16pf' | 'learning_styles' | 'emotional_intelligence' | 'psychosocial';

interface NavbarProps {
  currentModule: AppModule;
  setCurrentModule: (mod: AppModule) => void;
  currentTab: 'test' | 'capture' | 'report' | 'history';
  setCurrentTab: (tab: 'test' | 'capture' | 'report' | 'history') => void;
  hasActiveReport: boolean;
  googleUser: User | null;
  spreadsheetUrl: string | null;
  webhookUrl: string | null;
  isCloudSynced: boolean;
  onOpenGoogleModal: () => void;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModule,
  setCurrentModule,
  currentTab,
  setCurrentTab,
  hasActiveReport,
  googleUser,
  spreadsheetUrl,
  webhookUrl,
  isCloudSynced,
  onOpenGoogleModal,
  onGoogleSignIn,
  onGoogleSignOut,
}) => {
  return (
    <header className="bg-slate-900 border-b border-blue-900/60 sticky top-0 z-40 shadow-md">
      {/* Top University Brand Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white px-4 py-2 border-b border-blue-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-600/80 text-white font-bold text-[11px]">
              LE
            </span>
            <span className="font-semibold text-white">Licenciatura en Enseñanza de Lenguas Extranjeras</span>
            <span className="hidden sm:inline text-blue-200">•</span>
            <span className="hidden sm:inline text-blue-100 font-normal">Español e Inglés – Proceso de Admisión</span>
          </div>

          {/* Sync & Google Sheets Status */}
          <div className="flex items-center gap-2">
            {/* Cloud Multidevice Status */}
            <div
              className="flex items-center gap-1.5 bg-blue-950/90 text-blue-200 px-2.5 py-1 rounded border border-blue-600/40 text-[11px]"
              title="Base de datos en la nube activa: los registros se guardan y consultan en tiempo real desde cualquier dispositivo"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline font-medium">Nube:</span>
              <span className="text-emerald-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Multidispositivo</span>
              </span>
            </div>

            {/* Google Sheets Status */}
            {webhookUrl ? (
              <div className="flex items-center gap-2 bg-blue-950/80 px-2.5 py-1 rounded border border-emerald-500/40 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Google Sheets Vinculado</span>
                </span>
                <button
                  onClick={onOpenGoogleModal}
                  className="text-xs text-blue-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-blue-800 transition cursor-pointer"
                  title="Configuración de Google Sheets"
                >
                  Config
                </button>
              </div>
            ) : googleUser ? (
              <div className="flex items-center gap-2 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-600/40 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-blue-100 hidden md:inline truncate max-w-[140px]">
                  {googleUser.email}
                </span>
                <button
                  onClick={onOpenGoogleModal}
                  className="text-xs text-blue-200 hover:text-white px-1.5 py-0.5 rounded hover:bg-blue-800 transition cursor-pointer"
                >
                  Config
                </button>
                <button
                  onClick={onGoogleSignOut}
                  className="text-xs text-rose-300 hover:text-rose-100 px-1 py-0.5 cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenGoogleModal}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded font-medium transition text-xs shadow-sm cursor-pointer"
                title="Configurar guardado en Google Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-100" />
                <span>Vincular Google Sheets</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module Switcher Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Módulos de Evaluación:</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => {
                setCurrentModule('16pf');
                setCurrentTab('test');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                currentModule === '16pf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>1. 16 Factores (16PF)</span>
            </button>
            <button
              onClick={() => {
                setCurrentModule('learning_styles');
                setCurrentTab('test');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                currentModule === 'learning_styles'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>2. Estilos de Aprendizaje (VAK)</span>
            </button>
            <button
              onClick={() => {
                setCurrentModule('emotional_intelligence');
                setCurrentTab('test');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                currentModule === 'emotional_intelligence'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>3. Inteligencia Emocional</span>
            </button>
            <button
              onClick={() => {
                setCurrentModule('psychosocial');
                setCurrentTab('test');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                currentModule === 'psychosocial'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4. Bienestar Psicosocial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Header & Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg border ${
              currentModule === '16pf'
                ? 'bg-blue-600 border-blue-400/30 shadow-blue-600/20'
                : currentModule === 'learning_styles'
                ? 'bg-indigo-600 border-indigo-400/30 shadow-indigo-600/20'
                : currentModule === 'emotional_intelligence'
                ? 'bg-teal-600 border-teal-400/30 shadow-teal-600/20'
                : 'bg-emerald-600 border-emerald-400/30 shadow-emerald-600/20'
            }`}
          >
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                {currentModule === '16pf' ? (
                  <>
                    16PF <span className="text-blue-400 font-semibold text-sm">Forma A (187 reactivos)</span>
                  </>
                ) : currentModule === 'learning_styles' ? (
                  <>
                    Estilos de Aprendizaje <span className="text-indigo-400 font-semibold text-sm">Modelo PNL (40 reactivos)</span>
                  </>
                ) : currentModule === 'emotional_intelligence' ? (
                  <>
                    Inteligencia Emocional <span className="text-teal-400 font-semibold text-sm">45 Reactivos (0-90 pts)</span>
                  </>
                ) : (
                  <>
                    Bienestar Psicosocial <span className="text-emerald-400 font-semibold text-sm">35 Reactivos (Escala 0 al 4)</span>
                  </>
                )}
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  currentModule === '16pf'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : currentModule === 'learning_styles'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    : currentModule === 'emotional_intelligence'
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                {currentModule === '16pf'
                  ? 'Psicometría Oficial'
                  : currentModule === 'learning_styles'
                  ? 'Canales VAK'
                  : currentModule === 'emotional_intelligence'
                  ? 'Aptitud Socioemocional'
                  : 'Salud y Clima Institucional'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentModule === '16pf'
                ? 'Evaluación diagnóstica de personalidad para la formación docente bilingüe'
                : currentModule === 'learning_styles'
                ? 'Diagnóstico perceptual: Visual, Auditivo y Kinestésico para la enseñanza de lenguas'
                : currentModule === 'emotional_intelligence'
                ? 'Diagnóstico de autoconocimiento, regulación, automotivación, empatía y destrezas sociales'
                : 'Diagnóstico de factores de riesgo psicosocial, carga de trabajo y entorno preventivo'}
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setCurrentTab('test')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              currentTab === 'test'
                ? currentModule === '16pf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : currentModule === 'learning_styles'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : currentModule === 'emotional_intelligence'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ClipboardPen className="w-4 h-4" />
            <span>Test Aspirante (Online)</span>
          </button>
          <button
            onClick={() => setCurrentTab('capture')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              currentTab === 'capture'
                ? currentModule === '16pf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : currentModule === 'learning_styles'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : currentModule === 'emotional_intelligence'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Hoja de Captura Rápida</span>
          </button>
          <button
            onClick={() => setCurrentTab('report')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              currentTab === 'report'
                ? currentModule === '16pf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : currentModule === 'learning_styles'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : currentModule === 'emotional_intelligence'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : hasActiveReport
                ? 'text-emerald-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-400 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>
              {currentModule === '16pf'
                ? 'Reporte Gráfico 16PF'
                : currentModule === 'learning_styles'
                ? 'Reporte Gráfico VAK'
                : currentModule === 'emotional_intelligence'
                ? 'Reporte Inteligencia Emocional'
                : 'Reporte Bienestar Psicosocial'}
            </span>
            {hasActiveReport && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              currentTab === 'history'
                ? currentModule === '16pf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : currentModule === 'learning_styles'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : currentModule === 'emotional_intelligence'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial de Aspirantes</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
