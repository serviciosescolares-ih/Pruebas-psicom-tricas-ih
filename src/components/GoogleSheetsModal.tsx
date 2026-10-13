import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  LogIn,
  Sparkles,
  Copy,
  Check,
  Code2,
  ShieldAlert,
  Zap,
  Layers,
  RefreshCw,
  Download,
  UploadCloud,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  APPS_SCRIPT_TEMPLATE,
  EvaluationRecord,
  initializeSpreadsheetTabsViaWebhook,
  organizeMixedRowsViaWebhook,
  syncAllEvaluationsToBlankTemplate,
  downloadAllTestsCSVBundle,
  sendTestSimulationRowToWebhook,
} from '../services/googleSheets';
import { LearningStyleRecord } from '../data/learningStylesData';
import { EmotionalIntelligenceRecord } from '../data/emotionalIntelligenceData';
import { PsychosocialRecord } from '../data/psychosocialData';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleUser: User | null;
  activeSpreadsheetId: string | null;
  spreadsheetUrl: string | null;
  webhookUrl: string | null;
  records: EvaluationRecord[];
  learningStyleRecords: LearningStyleRecord[];
  ieRecords: EmotionalIntelligenceRecord[];
  psychosocialRecords: PsychosocialRecord[];
  onSaveWebhookUrl: (url: string) => void;
  onSpreadsheetConfigured: (id: string, url: string) => void;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onLoadDataFromSheets?: (url?: string) => Promise<void>;
  onSeedSampleData?: () => Promise<void>;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  googleUser,
  activeSpreadsheetId,
  spreadsheetUrl,
  webhookUrl,
  records,
  learningStyleRecords,
  ieRecords,
  psychosocialRecords,
  onSaveWebhookUrl,
  onGoogleSignIn,
  onGoogleSignOut,
  onLoadDataFromSheets,
  onSeedSampleData,
}) => {
  const [activeTab, setActiveTab] = useState<'webhook' | 'oauth'>('webhook');
  const [inputWebhook, setInputWebhook] = useState(webhookUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestSuccess, setWebhookTestSuccess] = useState(false);
  const [isSendingTestRow, setIsSendingTestRow] = useState(false);
  const [testRowMsg, setTestRowMsg] = useState('');
  const [isLoadingFromSheets, setIsLoadingAguas] = useState(false);
  const [isSeedingSampleData, setIsSeedingSampleData] = useState(false);
  const [isInitializingTabs, setIsInitializingTabs] = useState(false);
  const [initTabsSuccess, setInitTabsSuccess] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncProgressMsg, setSyncProgressMsg] = useState('');
  const [syncSuccessDetails, setSyncSuccessDetails] = useState<{
    total: number;
    details: { '16pf': number; vak: number; ie: number; psico: number };
  } | null>(null);
  const [isOrganizingRows, setIsOrganizingRows] = useState(false);
  const [organizeSuccess, setOrganizeSuccess] = useState(false);
  const [showRescueAccordion, setShowRescueAccordion] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (webhookUrl) setInputWebhook(webhookUrl);
  }, [webhookUrl]);

  if (!isOpen) return null;

  const totalEvaluationsInApp =
    records.length +
    learningStyleRecords.length +
    ieRecords.length +
    psychosocialRecords.length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveAndTestWebhook = async () => {
    const rawUrl = inputWebhook.trim();
    if (!rawUrl) {
      setErrorMsg('Por favor ingresa la URL de la Aplicación web de Google Apps Script.');
      return;
    }
    if (rawUrl.includes('docs.google.com/spreadsheets')) {
      setErrorMsg(
        'Has pegado el enlace de la hoja de Google Sheets. Para vincular el Webhook debes crear la Aplicación Web en Apps Script (Extensiones > Apps Script > Implementar > Nueva implementación) y pegar aquí la URL que termina en /exec.'
      );
      return;
    }
    if (rawUrl.includes('/edit')) {
      setErrorMsg(
        'La URL ingresada pertenece al editor de código de Google. Debes hacer clic en Implementar > Nueva implementación y copiar la URL de la Aplicación web que termina en /exec.'
      );
      return;
    }
    if (!rawUrl.includes('script.google.com/macros/s/')) {
      setErrorMsg('La URL debe comenzar con https://script.google.com/macros/s/... y terminar en /exec');
      return;
    }

    try {
      setIsTestingWebhook(true);
      setErrorMsg('');
      await fetch(rawUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'ping', test: true, init: true }),
      });
      onSaveWebhookUrl(rawUrl);
      setWebhookTestSuccess(true);
      setTimeout(() => {
        setWebhookTestSuccess(false);
      }, 5000);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Error al conectar con la URL: ' + (e.message || 'Error de red'));
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSendTestRow = async () => {
    const targetUrl = (inputWebhook || webhookUrl || '').trim();
    if (!targetUrl) {
      setErrorMsg('Por favor ingresa primero la URL de tu Webhook.');
      return;
    }
    try {
      setIsSendingTestRow(true);
      setErrorMsg('');
      setTestRowMsg('Enviando filas de simulación a las 4 pestañas oficiales...');
      const res = await sendTestSimulationRowToWebhook(targetUrl);
      onSaveWebhookUrl(targetUrl);
      setTestRowMsg(res.message);
      setTimeout(() => {
        setTestRowMsg('');
      }, 8000);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Error al enviar filas de prueba: ' + (e.message || 'Error de red'));
      setTestRowMsg('');
    } finally {
      setIsSendingTestRow(false);
    }
  };

  const handleInitializeTabs = async () => {
    const targetUrl = (inputWebhook || webhookUrl || '').trim();
    if (!targetUrl) {
      setErrorMsg('Por favor ingresa primero la URL de tu Webhook.');
      return;
    }
    try {
      setIsInitializingTabs(true);
      setErrorMsg('');
      await initializeSpreadsheetTabsViaWebhook(targetUrl);
      onSaveWebhookUrl(targetUrl);
      setInitTabsSuccess(true);
      setTimeout(() => {
        setInitTabsSuccess(false);
      }, 7000);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Error al inicializar pestañas: ' + (e.message || 'Error de red'));
    } finally {
      setIsInitializingTabs(false);
    }
  };

  const handleSyncAllToBlankTemplate = async () => {
    const targetUrl = (inputWebhook || webhookUrl || '').trim();
    if (!targetUrl) {
      setErrorMsg('Por favor ingresa primero la URL de tu Webhook.');
      return;
    }
    try {
      setIsSyncingAll(true);
      setErrorMsg('');
      setSyncSuccessDetails(null);
      setSyncProgressMsg('Iniciando sincronización de toda la información...');
      const res = await syncAllEvaluationsToBlankTemplate(
        targetUrl,
        {
          records,
          learningStyleRecords,
          ieRecords,
          psychosocialRecords,
        },
        (msg) => {
          setSyncProgressMsg(msg);
        }
      );
      onSaveWebhookUrl(targetUrl);
      setSyncSuccessDetails({
        total: res.totalSynced,
        details: res.details,
      });
      setSyncProgressMsg('');
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Error al sincronizar datos a la plantilla: ' + (e.message || 'Error de red'));
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleDownloadCSVBackup = () => {
    downloadAllTestsCSVBundle({
      records,
      learningStyleRecords,
      ieRecords,
      psychosocialRecords,
    });
  };

  const handleOrganizeMixedRows = async () => {
    const targetUrl = (inputWebhook || webhookUrl || '').trim();
    if (!targetUrl) {
      setErrorMsg('Por favor ingresa primero la URL de tu Webhook.');
      return;
    }
    try {
      setIsOrganizingRows(true);
      setErrorMsg('');
      await organizeMixedRowsViaWebhook(targetUrl);
      onSaveWebhookUrl(targetUrl);
      setOrganizeSuccess(true);
      setTimeout(() => {
        setOrganizeSuccess(false);
      }, 8000);
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Error al organizar filas: ' + (e.message || 'Error de red'));
    } finally {
      setIsOrganizingRows(false);
    }
  };

  const handleLoadFromSheets = async () => {
    const targetUrl = (inputWebhook || webhookUrl || '').trim();
    if (!targetUrl) {
      setErrorMsg('Por favor ingresa primero la URL de tu Webhook.');
      return;
    }
    if (!onLoadDataFromSheets) return;
    try {
      setIsLoadingAguas(true);
      setErrorMsg('');
      await onLoadDataFromSheets(targetUrl);
      onSaveWebhookUrl(targetUrl);
    } catch (e: any) {
      setErrorMsg('Error al cargar datos desde Google Sheets: ' + (e.message || 'Error de red'));
    } finally {
      setIsLoadingAguas(false);
    }
  };

  const handleSeedSampleDataClick = async () => {
    if (!onSeedSampleData) return;
    try {
      setIsSeedingSampleData(true);
      await onSeedSampleData();
    } finally {
      setIsSeedingSampleData(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scale-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-700/80">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="font-bold text-base">Plantilla en Blanco de Google Sheets</h3>
              <p className="text-xs text-blue-200">
                Pestañas oficiales independientes: 16PF • VAK • IE • PSICO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-blue-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs">
          <button
            onClick={() => setActiveTab('webhook')}
            className={`pb-3 px-3 font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'webhook'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Plantilla en Blanco v4.2 (Recomendado – Sin Error 403)</span>
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            className={`pb-3 px-3 font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'oauth'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión con Google</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          {activeTab === 'webhook' ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border-2 border-blue-200 rounded-xl p-4 text-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-xs text-blue-950 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Plantilla en Blanco de Google Sheets</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-700">
                  En lugar de modificar hojas con datos ya capturados, utilizamos una <strong>plantilla en blanco</strong>. Al conectarla, el sistema crea automáticamente las <strong>4 pestañas oficiales</strong> y vuelca tanto todos tus <strong>datos ya capturados</strong> como <strong>los nuevos</strong> respetando su estructura exacta.
                </p>
              </div>

              {/* Badges of the 4 tabs */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5 uppercase tracking-wide">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Estructura Oficial por Instrumento Psicométrico:</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900">
                    <strong className="block font-bold">1. "16PF"</strong>
                    <span className="text-blue-700 text-[10px]">187 reactivos • Perfil Docente</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900">
                    <strong className="block font-bold">2. "VAK"</strong>
                    <span className="text-indigo-700 text-[10px]">40 reactivos • Estilos Aprendizaje</span>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-900">
                    <strong className="block font-bold">3. "IE"</strong>
                    <span className="text-teal-700 text-[10px]">45 reactivos • Inteligencia Emocional</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <strong className="block font-bold">4. "PSICO"</strong>
                    <span className="text-emerald-700 text-[10px]">35 reactivos • Bienestar Psicosocial</span>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <span>3 Pasos Simples para Vincular tu Plantilla en Blanco:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2.5 text-slate-600 pl-1">
                  <li>
                    <strong className="text-slate-800">Crea una nueva hoja de cálculo en blanco:</strong>
                    <div className="mt-1">
                      <a
                        href="https://sheets.new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow cursor-pointer text-[11px]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Hoja en Blanco (sheets.new)</span>
                      </a>
                    </div>
                  </li>
                  <li>
                    <strong className="text-slate-800">Copia y pega el código v4.2 en Apps Script:</strong>
                    <span className="block text-[10.5px] text-slate-500 mt-0.5">
                      En la hoja en blanco, ve a <strong>Extensiones &gt; Apps Script</strong>, borra todo lo que haya y pega el código:
                    </span>
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow cursor-pointer text-[11px]"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? '¡Código Copiado al Portapapeles!' : 'Copiar Código v4.2 (Plantilla en Blanco)'}</span>
                      </button>
                    </div>
                  </li>
                  <li>
                    <strong className="text-slate-800">Implementa como Aplicación web:</strong>
                    <div className="text-[10.5px] text-slate-600 mt-1 space-y-1 bg-white p-2.5 rounded-lg border border-slate-200">
                      <div>1. Haz clic en <strong>Implementar &gt; Nueva implementación</strong>.</div>
                      <div>2. Tipo: Selecciona <strong>Aplicación web</strong>.</div>
                      <div>3. <em>Ejecutar como:</em> Elige <strong className="text-slate-900">"Yo (tu cuenta)"</strong>.</div>
                      <div>4. <em>¿Quién tiene acceso?:</em> Selecciona <strong className="text-emerald-700">"Cualquier persona"</strong>.</div>
                      <div>5. Haz clic en <strong>Implementar</strong>, autoriza los permisos y copia la URL terminada en <strong>/exec</strong>.</div>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Paste URL Input */}
              <div className="space-y-2.5">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  URL de la Aplicación Web (Webhook):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    value={inputWebhook}
                    onChange={(e) => setInputWebhook(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleSaveAndTestWebhook}
                    disabled={isTestingWebhook}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow cursor-pointer whitespace-nowrap text-xs flex items-center gap-1.5"
                  >
                    {isTestingWebhook ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Probando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Guardar y Vincular</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleSendTestRow}
                    disabled={isSendingTestRow || !inputWebhook.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                  >
                    {isSendingTestRow ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        <span>Enviando prueba a las 4 pestañas...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Enviar Fila de Prueba a las 4 Pestañas (Verificar Guardado)</span>
                      </>
                    )}
                  </button>
                </div>

                {testRowMsg && (
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{testRowMsg}</span>
                  </div>
                )}
              </div>

              {/* Total Sync Card */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-emerald-700 shrink-0" />
                    <h5 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wide">
                      Sincronización Total de Datos (Viejos y Nuevos)
                    </h5>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    {totalEvaluationsInApp} Evaluaciones Disponibles
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="bg-white p-2 rounded-lg border border-blue-200">
                    <span className="block text-slate-500 font-semibold">16PF</span>
                    <strong className="text-blue-700 text-xs">{records.length}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-indigo-200">
                    <span className="block text-slate-500 font-semibold">VAK</span>
                    <strong className="text-indigo-700 text-xs">{learningStyleRecords.length}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-teal-200">
                    <span className="block text-slate-500 font-semibold">IE</span>
                    <strong className="text-teal-700 text-xs">{ieRecords.length}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-200">
                    <span className="block text-slate-500 font-semibold">PSICO</span>
                    <strong className="text-emerald-700 text-xs">{psychosocialRecords.length}</strong>
                  </div>
                </div>

                {totalEvaluationsInApp === 0 && onSeedSampleData && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>El sistema está limpio. ¿Deseas cargar 3 aspirantes de prueba?</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleSeedSampleDataClick}
                      disabled={isSeedingSampleData}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap cursor-pointer transition shadow-sm"
                    >
                      {isSeedingSampleData ? 'Cargando...' : 'Cargar 3 Ejemplos'}
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSyncAllToBlankTemplate}
                  disabled={isSyncingAll || !inputWebhook.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSyncingAll ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{syncProgressMsg || 'Sincronizando plantilla en blanco...'}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4 text-emerald-200" />
                      <span>Volcar Todos los Datos a la Plantilla en Blanco ({totalEvaluationsInApp} evaluaciones)</span>
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleInitializeTabs}
                    disabled={isInitializingTabs || !inputWebhook.trim()}
                    className="text-[11px] text-teal-800 hover:text-teal-950 font-bold underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Solo inicializar las 4 pestañas vacías</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCSVBackup}
                    className="text-[11px] text-blue-800 hover:text-blue-950 font-bold underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar 4 archivos CSV de respaldo</span>
                  </button>
                </div>
              </div>

              {/* Load from sheets */}
              {onLoadDataFromSheets && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cargar / Importar Evaluaciones desde Google Sheets a la Aplicación:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLoadFromSheets}
                    disabled={isLoadingFromSheets || !inputWebhook.trim()}
                    className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoadingFromSheets ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Leyendo datos de la hoja de cálculo...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Cargar Evaluaciones Almacenadas en Google Sheets</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {syncSuccessDetails && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs space-y-1.5 shadow-sm">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>¡Plantilla en blanco poblada exitosamente!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 pl-6 leading-relaxed">
                    16PF: {syncSuccessDetails.details['16pf']} | VAK: {syncSuccessDetails.details.vak} | IE: {syncSuccessDetails.details.ie} | PSICO: {syncSuccessDetails.details.psico}
                  </p>
                </div>
              )}

              {webhookTestSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Webhook vinculado con éxito! Conexión activa con la plantilla.</span>
                </div>
              )}

              {initTabsSuccess && (
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-300 text-teal-900 text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>¡Pestañas oficiales creadas en la hoja en blanco!</span>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Rescue Accordion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setShowRescueAccordion(!showRescueAccordion)}
                  className="w-full p-3 text-left font-bold text-slate-700 flex items-center justify-between hover:bg-slate-100 transition cursor-pointer text-[11px]"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                    <span>¿Tienes una hoja anterior con datos mezclados? (Modo Rescate Seguro)</span>
                  </span>
                  {showRescueAccordion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showRescueAccordion && (
                  <div className="p-3.5 border-t border-slate-200 bg-white space-y-3 text-[11px]">
                    <p className="text-slate-600">
                      Esta función analiza una hoja previa y copia los registros de VAK, IE y PSICO a sus pestañas respectivas sin alterar los datos originales.
                    </p>
                    <button
                      type="button"
                      onClick={handleOrganizeMixedRows}
                      disabled={isOrganizingRows || !inputWebhook.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isOrganizingRows ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Copiando respuestas sin alterar originales...</span>
                        </>
                      ) : (
                        <>
                          <Layers className="w-4 h-4 text-indigo-200" />
                          <span>Copiar Respuestas a sus Pestañas (100% No Destructivo)</span>
                        </>
                      )}
                    </button>
                    {organizeSuccess && (
                      <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs">
                        Petición de copia enviada. Tus datos originales permanecen intactos.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* OAuth Tab */
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      googleUser ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  ></div>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {googleUser ? 'Sesión de Google Iniciada' : 'Sin Sesión Iniciada'}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {googleUser ? googleUser.email : 'Requiere una cuenta autorizada en Google Cloud.'}
                    </span>
                  </div>
                </div>
                <div>
                  {googleUser ? (
                    <button
                      onClick={onGoogleSignOut}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:text-rose-600 font-semibold text-slate-700 transition cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
                  ) : (
                    <button
                      onClick={onGoogleSignIn}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Iniciar Sesión</span>
                    </button>
                  )}
                </div>
              </div>
              {activeSpreadsheetId && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                  <div className="text-[11px] text-emerald-900">
                    <strong>Hoja Activa Vinculada:</strong> {activeSpreadsheetId}
                  </div>
                  {spreadsheetUrl && (
                    <a
                      href={spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold underline inline-flex items-center gap-1 text-[11px]"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            {webhookUrl ? '✓ Webhook vinculado v4.2' : 'Plantilla pendiente de vincular'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
