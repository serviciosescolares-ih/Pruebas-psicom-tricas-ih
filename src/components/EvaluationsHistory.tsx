import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  FileSpreadsheet,
  Trash2,
  Eye,
  RefreshCw,
  Cloud,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { EvaluationRecord, exportToCSV } from '../services/googleSheets';
import { generate16PFPdf } from '../services/pdfReport';

interface EvaluationsHistoryProps {
  records: EvaluationRecord[];
  onSelectRecord: (record: EvaluationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onSyncRecordToSheets: (record: EvaluationRecord) => Promise<void>;
  onRefreshFromCloud: () => Promise<void>;
  onSeedSampleData?: () => Promise<void>;
  onLoadDataFromSheets?: () => Promise<void>;
  isSyncing: boolean;
  spreadsheetUrl: string | null;
}

export const EvaluationsHistory: React.FC<EvaluationsHistoryProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onSyncRecordToSheets,
  onRefreshFromCloud,
  onSeedSampleData,
  onLoadDataFromSheets,
  isSyncing,
  spreadsheetUrl,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.folio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerdict = verdictFilter === 'ALL' || r.suitabilityVerdict === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  const handleDownloadAllCSV = () => {
    if (records.length === 0) {
      alert('No hay evaluaciones para exportar.');
      return;
    }
    exportToCSV(records, `16PF_Base_Aspirantes_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      await onRefreshFromCloud();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSeed = async () => {
    if (!onSeedSampleData) return;
    try {
      setIsSeeding(true);
      await onSeedSampleData();
    } finally {
      setIsSeeding(false);
    }
  };

  const handleLoadSheets = async () => {
    if (!onLoadDataFromSheets) return;
    try {
      setIsLoadingSheets(true);
      await onLoadDataFromSheets();
    } finally {
      setIsLoadingSheets(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <History className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Historial de Evaluaciones Psicométricas (16PF)
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Sincronizado en la nube:</span>
                </span>
                <span className="text-slate-600 font-bold">{records.length} aspirantes registrados</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Visible en PC, tablets y smartphones</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onLoadDataFromSheets && (
            <button
              onClick={handleLoadSheets}
              disabled={isLoadingSheets}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition cursor-pointer"
              title="Cargar evaluaciones almacenadas en tu Google Sheets"
            >
              <Download className={`w-3.5 h-3.5 ${isLoadingSheets ? 'animate-spin' : ''}`} />
              <span>{isLoadingSheets ? 'Cargando...' : 'Cargar de Sheets'}</span>
            </button>
          )}

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 transition cursor-pointer"
            title="Recargar los registros más recientes desde la nube"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRefreshing ? 'Actualizando...' : 'Recargar de la Nube'}</span>
          </button>

          <button
            onClick={handleDownloadAllCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Todo (Excel / CSV)</span>
          </button>

          {spreadsheetUrl && (
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Abrir Google Sheets</span>
            </a>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre o folio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-xs"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium whitespace-nowrap">Dictamen:</span>
          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-xs bg-white"
          >
            <option value="ALL">Todos los dictámenes</option>
            <option value="Altamente Idóneo">Altamente Idóneo</option>
            <option value="Favorable">Favorable</option>
            <option value="Favorable con Observaciones">Favorable con Observaciones</option>
            <option value="Requiere Acompañamiento">Requiere Acompañamiento</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center text-slate-500 space-y-4">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <p className="text-sm font-bold text-slate-800">Aún no hay evaluaciones registradas</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Puedes aplicar una nueva prueba en línea, capturar resultados en papel o cargar aspirantes de ejemplo para probar el sistema de inmediato.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {onSeedSampleData && (
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>{isSeeding ? 'Cargando...' : 'Cargar 3 Aspirantes de Ejemplo'}</span>
              </button>
            )}
            {onLoadDataFromSheets && (
              <button
                onClick={handleLoadSheets}
                disabled={isLoadingSheets}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isLoadingSheets ? 'Leyendo...' : 'Cargar desde Google Sheets'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE & TABLET CARD VIEW */}
          <div className="grid grid-cols-1 md:hidden gap-3">
            {filtered.map((r) => {
              const isExpanded = expandedRecordId === r.id;
              return (
                <div
                  key={r.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {r.folio}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{r.name}</h4>
                      <div className="text-slate-500 text-[11px]">
                        {r.gender === 'M' ? 'Hombre' : 'Mujer'} • {r.age} años • {r.emphasis}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-blue-700">
                        {r.suitabilityScore}%
                      </div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          r.suitabilityVerdict === 'Altamente Idóneo'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.suitabilityVerdict === 'Favorable'
                            ? 'bg-blue-100 text-blue-800'
                            : r.suitabilityVerdict === 'Favorable con Observaciones'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.suitabilityVerdict}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectRecord(r)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Reporte Gráfico</span>
                    </button>
                    <button
                      onClick={() => generate16PFPdf(r)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedRecordId(isExpanded ? null : r.id)}
                      className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                      title="Ver estenes de los 16 factores"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Stens Preview */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 text-[11px] bg-slate-50 p-2.5 rounded-lg space-y-2">
                      <div className="font-bold text-slate-700">
                        Estenes Primarios (1 a 10):
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                        {(['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4'] as const).map((f) => (
                          <div key={f} className="bg-white p-1 rounded border border-slate-200">
                            <span className="text-blue-700 font-bold block">{f}</span>
                            <span className="font-extrabold text-slate-800">{r.estens[f]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Folio</th>
                    <th className="px-4 py-3">Aspirante</th>
                    <th className="px-4 py-3">Sexo / Edad</th>
                    <th className="px-4 py-3">Énfasis</th>
                    <th className="px-4 py-3">Idoneidad</th>
                    <th className="px-4 py-3">Dictamen</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition">
                      <td className="px-4 py-3 font-bold text-blue-900">{r.folio}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{r.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {r.gender === 'M' ? 'Hombre' : 'Mujer'} • {r.age} a
                      </td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-[120px]">
                        {r.emphasis}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-blue-700 text-sm">
                        {r.suitabilityScore}%
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.suitabilityVerdict === 'Altamente Idóneo'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.suitabilityVerdict === 'Favorable'
                              ? 'bg-blue-100 text-blue-800'
                              : r.suitabilityVerdict === 'Favorable con Observaciones'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.suitabilityVerdict}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(r.timestamp).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectRecord(r)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer shadow-sm text-xs"
                            title="Ver Reporte Gráfico Detallado"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Reporte</span>
                          </button>
                          <button
                            onClick={() => generate16PFPdf(r)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                            title="Descargar Informe Oficial en PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSyncRecordToSheets(r)}
                            disabled={isSyncing}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                            title="Guardar / Reenviar a Google Sheets"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar la evaluación de ${r.name}? Se borrará también de la nube.`)) {
                                onDeleteRecord(r.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="Eliminar evaluación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
