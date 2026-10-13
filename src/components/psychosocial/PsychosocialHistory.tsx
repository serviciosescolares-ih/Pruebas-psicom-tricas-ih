import React, { useState } from 'react';
import {
  Search,
  Download,
  Trash2,
  Eye,
  RefreshCw,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { PsychosocialRecord } from '../../data/psychosocialData';
import { generatePsychosocialPdf } from '../../services/psychosocialPdf';

interface PsychosocialHistoryProps {
  records: PsychosocialRecord[];
  onSelectRecord: (record: PsychosocialRecord) => void;
  onDeleteRecord: (id: string) => void;
  onRefreshFromCloud: () => Promise<void>;
  onSeedSampleData?: () => Promise<void>;
  onLoadDataFromSheets?: () => Promise<void>;
  spreadsheetUrl: string | null;
}

export const PsychosocialHistory: React.FC<PsychosocialHistoryProps> = ({
  records,
  onSelectRecord,
  onDeleteRecord,
  onRefreshFromCloud,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      alert('No hay evaluaciones de bienestar psicosocial para exportar.');
      return;
    }
    const headers = [
      'Folio',
      'Fecha',
      'Aspirante',
      'Sexo',
      'Edad',
      'Énfasis',
      'Puntaje_Total (140)',
      'Porcentaje (%)',
      'Nivel_Riesgo',
      'Entorno_Pts (28)',
      'Entorno_%',
      'Carga_Pts (28)',
      'Carga_%',
      'Autonomia_Pts (28)',
      'Autonomia_%',
      'Liderazgo_Pts (28)',
      'Liderazgo_%',
      'Desgaste_Pts (28)',
      'Desgaste_%',
      ...Array.from({ length: 35 }, (_, i) => `R${i + 1}`),
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
        r.dimensions.ambiente_entorno.score,
        r.dimensions.ambiente_entorno.percentage,
        r.dimensions.carga_ritmo.score,
        r.dimensions.carga_ritmo.percentage,
        r.dimensions.control_autonomia.score,
        r.dimensions.control_autonomia.percentage,
        r.dimensions.liderazgo_relaciones.score,
        r.dimensions.liderazgo_relaciones.percentage,
        r.dimensions.balance_desgaste.score,
        r.dimensions.balance_desgaste.percentage,
        ...Array.from({ length: 35 }, (_, i) => r.answers[i + 1] ?? 0),
      ];
      rows.push(row.map((val) => `"${String(val).replace(/"/g, '""')}"`));
    }
    const csvContent = '\uFEFF' + rows.map((e) => e.join(',')).join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bienestar_Psicosocial_Historial_${new Date().toISOString().slice(0, 10)}.csv`);
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
      {/* Header and Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Historial – Bienestar Psicosocial
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Registro histórico consolidado de evaluaciones del clima y factores de riesgo psicosocial (sincronizado en tiempo real).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
              title="Sincronizar con la base de datos en la nube"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV Completo</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-5">
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre del aspirante o folio de admisión..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
            />
          </div>
          <div className="md:col-span-4">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 outline-none"
            >
              <option value="ALL">Todos los Niveles de Riesgo ({records.length})</option>
              <option value="NULO">Riesgo Nulo / Despreciable</option>
              <option value="BAJO">Riesgo Bajo</option>
              <option value="MEDIO">Riesgo Medio / Moderado</option>
              <option value="ALTO">Riesgo Alto</option>
              <option value="MUY_ALTO">Riesgo Muy Alto / Crítico</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No se encontraron evaluaciones</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {records.length === 0
                ? 'Aún no hay evaluaciones de bienestar psicosocial registradas. Aplica una evaluación en la pestaña de cuestionario o captura rápida.'
                : 'Ninguna evaluación coincide con los filtros de búsqueda aplicados.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Folio / Fecha</th>
                  <th className="px-4 py-3.5">Aspirante / Datos</th>
                  <th className="px-4 py-3.5 text-center">Puntaje Global</th>
                  <th className="px-4 py-3.5 text-center">Nivel de Riesgo</th>
                  <th className="px-4 py-3.5">Desglose Factores</th>
                  <th className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-emerald-800 block text-xs">
                        {rec.folio}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rec.timestamp).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block text-xs">
                        {rec.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {rec.gender === 'M' ? 'Hombre' : 'Mujer'} • {rec.age} a • {rec.emphasis}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className="font-black text-slate-800 text-sm block">
                        {rec.totalScore} <span className="text-[10px] font-normal text-slate-400">/ 140</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {rec.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${rec.level.badgeBg}`}
                      >
                        {rec.level.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-slate-600">
                      <div className="grid grid-cols-5 gap-1 text-center font-mono font-semibold max-w-[200px]">
                        <span title="Entorno Físico" className="p-1 rounded bg-slate-100">
                          {rec.dimensions.ambiente_entorno.score}
                        </span>
                        <span title="Carga y Ritmo" className="p-1 rounded bg-slate-100">
                          {rec.dimensions.carga_ritmo.score}
                        </span>
                        <span title="Autonomía" className="p-1 rounded bg-slate-100">
                          {rec.dimensions.control_autonomia.score}
                        </span>
                        <span title="Liderazgo y Relaciones" className="p-1 rounded bg-slate-100">
                          {rec.dimensions.liderazgo_relaciones.score}
                        </span>
                        <span title="Desgaste Psicoemocional" className="p-1 rounded bg-slate-100">
                          {rec.dimensions.balance_desgaste.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectRecord(rec)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                          title="Ver informe gráfico"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generatePsychosocialPdf(rec)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Eliminar la evaluación de ${rec.name}?`)) {
                              onDeleteRecord(rec.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                          title="Eliminar registro"
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
        )}
      </div>
    </div>
  );
};
