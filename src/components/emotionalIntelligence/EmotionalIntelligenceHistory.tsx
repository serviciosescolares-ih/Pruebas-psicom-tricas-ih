import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  Cloud,
  Sparkles,
} from 'lucide-react';
import { EmotionalIntelligenceRecord } from '../../data/emotionalIntelligenceData';
import { generateEmotionalIntelligencePdf } from '../../services/emotionalIntelligencePdf';

interface EmotionalIntelligenceHistoryProps {
  records: EmotionalIntelligenceRecord[];
  onSelectRecord: (record: EmotionalIntelligenceRecord) => void;
  onDeleteRecord: (id: string) => void;
  onRefreshFromCloud: () => Promise<void>;
  onSeedSampleData?: () => Promise<void>;
  onLoadDataFromSheets?: () => Promise<void>;
  spreadsheetUrl: string | null;
}

export const EmotionalIntelligenceHistory: React.FC<EmotionalIntelligenceHistoryProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onRefreshFromCloud,
  onSeedSampleData,
  onLoadDataFromSheets,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.folio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === 'ALL' || r.level.code === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleDownloadCSV = () => {
    if (records.length === 0) {
      alert('No hay evaluaciones de inteligencia emocional para exportar.');
      return;
    }
    const headers = [
      'Folio',
      'Fecha',
      'Aspirante',
      'Sexo',
      'Edad',
      'Énfasis',
      'Puntaje_Total (90)',
      'Porcentaje (%)',
      'Nivel_Diagnóstico',
      'Autoconocimiento_Pts',
      'Autoconocimiento_%',
      'Autocontrol_Pts',
      'Autocontrol_%',
      'Automotivacion_Pts',
      'Automotivacion_%',
      'Empatia_Pts',
      'Empatia_%',
      'Habilidades_Sociales_Pts',
      'Habilidades_Sociales_%',
      ...Array.from({ length: 45 }, (_, i) => `R${i + 1}`),
    ];
    const rows = [headers];
    for (const r of records) {
      const row = [
        r.folio,
        r.timestamp,
        r.name,
        r.gender === 'M' ? 'Hombre' : 'Mujer',
        r.age,
        r.emphasis,
        r.totalScore,
        r.percentage,
        r.level.label,
        r.dimensions.autoconocimiento.score,
        r.dimensions.autoconocimiento.percentage,
        r.dimensions.autocontrol.score,
        r.dimensions.autocontrol.percentage,
        r.dimensions.automotivacion.score,
        r.dimensions.automotivacion.percentage,
        r.dimensions.empatia.score,
        r.dimensions.empatia.percentage,
        r.dimensions.habilidades_sociales.score,
        r.dimensions.habilidades_sociales.percentage,
      ];
      for (let i = 1; i <= 45; i++) {
        const ans = r.answers[i];
        row.push(ans === 'siempre' ? '2' : ans === 'algunas_veces' ? '1' : '0');
      }
      rows.push(row.map((v) => `"${String(v).replace(/"/g, '""')}"`));
    }
    const csvContent = '\uFEFF' + rows.map((e) => e.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inteligencia_Emocional_Base_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualRefresh = async () => {
    try {
      setIsRefreshing(true);
      await onRefreshFromCloud();
    } finally {
      setIsRefreshing(false);
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
                Historial – Test de Inteligencia Emocional
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Sincronizado en la nube:</span>
                </span>
                <span className="text-slate-600 font-bold">{records.length} aspirantes evaluados</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Visible en PC, tablets y smartphones</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onLoadDataFromSheets && (
            <button
              onClick={async () => {
                try {
                  setIsLoadingSheets(true);
                  await onLoadDataFromSheets();
                } finally {
                  setIsLoadingSheets(false);
                }
              }}
              disabled={isLoadingSheets}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs border border-teal-200 transition cursor-pointer"
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
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isRefreshing ? 'Actualizando...' : 'Recargar de la Nube'}</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
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
          <span className="text-slate-500 font-medium whitespace-nowrap">Nivel Diagnóstico:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none text-xs bg-white"
          >
            <option value="ALL">Todos los niveles</option>
            <option value="MUY_ALTO">Muy Alto (80-90 pts)</option>
            <option value="MEDIO_ALTO">Medio-Alto (46-79 pts)</option>
            <option value="MEDIO_BAJO">Medio-Bajo (36-45 pts)</option>
            <option value="BAJO">Bajo (21-35 pts)</option>
            <option value="MUY_BAJO">Muy Bajo (0-20 pts)</option>
          </select>
        </div>
      </div>

      {/* Records List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-slate-500 space-y-4">
          <History className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <p className="text-sm font-semibold text-slate-800">No se encontraron evaluaciones de Inteligencia Emocional</p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Aplica un test online, realiza la captura rápida o carga aspirantes de ejemplo para probar el sistema de inmediato.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {onSeedSampleData && (
              <button
                onClick={async () => {
                  try {
                    setIsSeeding(true);
                    await onSeedSampleData();
                  } finally {
                    setIsSeeding(false);
                  }
                }}
                disabled={isSeeding}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                <span>Cargar Aspirantes de Ejemplo (IE)</span>
              </button>
            )}
            {onLoadDataFromSheets && (
              <button
                onClick={async () => {
                  try {
                    setIsLoadingSheets(true);
                    await onLoadDataFromSheets();
                  } finally {
                    setIsLoadingSheets(false);
                  }
                }}
                disabled={isLoadingSheets}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cargar desde Google Sheets</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Folio</th>
                  <th className="px-4 py-3">Aspirante</th>
                  <th className="px-4 py-3">Sexo / Edad</th>
                  <th className="px-4 py-3 text-center">Puntaje</th>
                  <th className="px-4 py-3 text-center">Porcentaje</th>
                  <th className="px-4 py-3">Nivel Diagnóstico</th>
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
                    <td className="px-4 py-3 text-center font-black text-slate-800 text-sm">
                      {r.totalScore} <span className="text-slate-400 text-xs font-normal">/ 90</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-700">
                      {r.percentage}%
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${r.level.badgeBg}`}
                      >
                        {r.level.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(r.timestamp).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => onSelectRecord(r)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                        title="Ver reporte gráfico completo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generateEmotionalIntelligencePdf(r)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        title="Descargar informe oficial en PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Eliminar la evaluación de ${r.name}?`)) {
                            onDeleteRecord(r.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                        title="Eliminar evaluación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
