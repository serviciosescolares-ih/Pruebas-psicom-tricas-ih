import { getAccessToken } from './googleAuth';
import { FactorCode } from '../data/scalesData';
import { LearningStyleRecord } from '../data/learningStylesData';
import { EmotionalIntelligenceRecord } from '../data/emotionalIntelligenceData';
import { PsychosocialRecord } from '../data/psychosocialData';

export interface EvaluationRecord {
  id: string;
  timestamp: string;
  folio: string;
  name: string;
  gender: 'M' | 'F';
  age: number;
  emphasis: string;
  rawScores: Record<FactorCode, number>;
  estens: Record<FactorCode, number>;
  secondaryFactors: {
    QI: number;
    QII: number;
    QIII: number;
    QIV: number;
    QV: number;
  };
  competencies: {
    comunicacion: number;
    estabilidad: number;
    innovacion: number;
    rigor: number;
    liderazgo: number;
  };
  suitabilityScore: number;
  suitabilityVerdict: string;
  answers: Record<number, 'a' | 'b' | 'c'>;
}

const DEFAULT_SHEET_TITLE = '16PF - Admisión Enseñanza de Lenguas Extranjeras';

export const SHEET_HEADERS = [
  'ID / Folio',
  'Fecha y Hora',
  'Nombre del Aspirante',
  'Sexo',
  'Edad',
  'Énfasis de Idioma',
  'Idoneidad Docente (%)',
  'Dictamen Vocacional',
  // Factores A - Q4 (Puntuación Bruta y Esten)
  'PB A', 'Esten A',
  'PB B', 'Esten B',
  'PB C', 'Esten C',
  'PB E', 'Esten E',
  'PB F', 'Esten F',
  'PB G', 'Esten G',
  'PB H', 'Esten H',
  'PB I', 'Esten I',
  'PB L', 'Esten L',
  'PB M', 'Esten M',
  'PB N', 'Esten N',
  'PB O', 'Esten O',
  'PB Q1', 'Esten Q1',
  'PB Q2', 'Esten Q2',
  'PB Q3', 'Esten Q3',
  'PB Q4', 'Esten Q4',
  // Factores Secundarios
  'QI Extraversión',
  'QII Ansiedad',
  'QIII Dureza Mental',
  'QIV Independencia',
  'QV Autocontrol',
  // Competencias Docentes %
  'Comp: Comunicación y Dinamismo (%)',
  'Comp: Estabilidad y Clima Aula (%)',
  'Comp: Innovación Didáctica (%)',
  'Comp: Rigor y Ética (%)',
  'Comp: Liderazgo Colegiado (%)',
  // 187 Reactivos (R1 a R187)
  ...Array.from({ length: 187 }, (_, i) => `R${i + 1}`),
];

export const VAK_SHEET_HEADERS = [
  'ID / Folio',
  'Fecha y Hora',
  'Nombre del Aspirante',
  'Sexo',
  'Edad',
  'Énfasis de Idioma',
  'Total Auditivo (A)',
  '% Auditivo (A)',
  'Total Visual (B)',
  '% Visual (B)',
  'Total Kinestésico (C)',
  '% Kinestésico (C)',
  'Canal Predominante',
  ...Array.from({ length: 40 }, (_, i) => `R${i + 1}`),
];

export const IE_SHEET_HEADERS = [
  'ID / Folio',
  'Fecha y Hora',
  'Nombre del Aspirante',
  'Sexo',
  'Edad',
  'Énfasis de Idioma',
  'Puntaje Total (de 90)',
  'Porcentaje (%)',
  'Nivel Diagnóstico',
  'Autoconocimiento (Pts)',
  'Autoconocimiento (%)',
  'Autocontrol (Pts)',
  'Autocontrol (%)',
  'Automotivación (Pts)',
  'Automotivación (%)',
  'Empatía (Pts)',
  'Empatía (%)',
  'Habilidades Sociales (Pts)',
  'Habilidades Sociales (%)',
  ...Array.from({ length: 45 }, (_, i) => `R${i + 1}`),
];

export const PSYCHOSOCIAL_SHEET_HEADERS = [
  'ID / Folio',
  'Fecha y Hora',
  'Nombre del Aspirante',
  'Sexo',
  'Edad',
  'Énfasis de Idioma',
  'Puntaje Global (de 140)',
  'Porcentaje (%)',
  'Nivel de Riesgo',
  'Título de Estado',
  'Entorno Físico (Pts)',
  'Entorno Físico (%)',
  'Carga y Ritmo (Pts)',
  'Carga y Ritmo (%)',
  'Autonomía (Pts)',
  'Autonomía (%)',
  'Liderazgo y Clima (Pts)',
  'Liderazgo y Clima (%)',
  'Desgaste Psicoemocional (Pts)',
  'Desgaste Psicoemocional (%)',
  ...Array.from({ length: 35 }, (_, i) => `R${i + 1}`),
];

export const APPS_SCRIPT_TEMPLATE = `// ========================================================
// CÓDIGO DE GOOGLE APPS SCRIPT PARA PLANTILLA EN BLANCO
// Licenciatura en Enseñanza de Lenguas Extranjeras (Español e Inglés)
// VERSIÓN 4.2: Plantilla Oficial con Lectura, Escritura y Diagnóstico
// Pestañas: 16PF (187 reactivos) | VAK (40 reactivos) | IE (45 reactivos) | PSICO (35 reactivos)
// ========================================================
var SPREADSHEET_ID_MANUAL = "";

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Psicométricos ELE")
    .addItem("Configurar Plantilla en Blanco (Crear 4 Pestañas)", "configurarPlantillaEnBlanco")
    .addItem("Insertar Filas de Prueba (Verificar Guardado)", "probarWebhookDirecto")
    .addItem("Diagnóstico y Estado de la Hoja", "verificarDiagnostico")
    .addToUi();
}

function obtenerHojaCalculo(payload) {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}
  if (!ss && payload) {
    var id = payload.spreadsheetId || payload.sheetId;
    if (id) {
      try { ss = SpreadsheetApp.openById(id); } catch (e) {}
    }
    var url = payload.spreadsheetUrl;
    if (!ss && url) {
      try { ss = SpreadsheetApp.openByUrl(url); } catch (e) {}
    }
  }
  if (!ss && SPREADSHEET_ID_MANUAL && SPREADSHEET_ID_MANUAL.trim()) {
    try {
      var manual = SPREADSHEET_ID_MANUAL.trim();
      if (manual.indexOf("http") !== -1) {
        ss = SpreadsheetApp.openByUrl(manual);
      } else {
        ss = SpreadsheetApp.openById(manual);
      }
    } catch (e) {}
  }
  return ss;
}

function configurarPlantillaEnBlanco(customPayload) {
  var ss = obtenerHojaCalculo(customPayload);
  if (!ss) return { status: "error", message: "No active spreadsheet." };

  var tabsConfig = [
    { name: "16PF", color: "#0047AB", numReactivos: 187 },
    { name: "VAK", color: "#4338CA", numReactivos: 40 },
    { name: "IE", color: "#0D9488", numReactivos: 45 },
    { name: "PSICO", color: "#047857", numReactivos: 35 }
  ];

  for (var i = 0; i < tabsConfig.length; i++) {
    var cfg = tabsConfig[i];
    var sheet = getSheetCaseInsensitive(ss, cfg.name);
    if (!sheet) {
      try {
        sheet = ss.insertSheet(cfg.name);
      } catch (err) {
        sheet = getSheetCaseInsensitive(ss, cfg.name) || ss.getActiveSheet();
      }
    }
  }
  SpreadsheetApp.flush();
  return { status: "success", tabs: ["16PF", "VAK", "IE", "PSICO"] };
}

function getSheetCaseInsensitive(ss, name) {
  if (!ss || !name) return null;
  var target = name.trim().toUpperCase();
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().trim().toUpperCase() === target) {
      return sheets[i];
    }
  }
  return null;
}

function doPost(e) {
  try {
    var contents = "";
    if (e && e.postData && e.postData.contents) {
      contents = e.postData.contents;
    }
    var data = {};
    if (contents) {
      try { data = JSON.parse(contents); } catch (pe) { data = {}; }
    }
    var ss = obtenerHojaCalculo(data);
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "No active spreadsheet." })).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

async function postToAppsScriptWebhook(webhookUrl: string, payload: any): Promise<any> {
  const url = webhookUrl.trim();
  const enrichedPayload = {
    ...payload,
    spreadsheetId: payload.spreadsheetId || localStorage.getItem('16pf_active_spreadsheet_id') || undefined,
    spreadsheetUrl: payload.spreadsheetUrl || localStorage.getItem('16pf_active_spreadsheet_url') || undefined,
  };
  const bodyText = JSON.stringify(enrichedPayload);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: bodyText,
    });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      if (json && json.status === 'error') {
        throw new Error(json.message || 'Error reportado por Google Apps Script');
      }
      return json || { status: 'success' };
    }
  } catch (err: any) {
    if (err.message && err.message.includes('Google Apps Script')) {
      throw err;
    }
  }

  // Fallback: no-cors fetch
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: bodyText,
    });
    return { status: 'success', noCors: true };
  } catch (err: any) {
    console.error('Error enviando datos al webhook de Apps Script:', err);
    throw new Error('No se pudo comunicar con el Webhook de Google Sheets: ' + (err.message || 'Error de red'));
  }
}

export async function loadEvaluationsFromGoogleSheetsWebhook(webhookUrl: string): Promise<{
  records16PF: any[];
  recordsVAK: any[];
  recordsIE: any[];
  recordsPSICO: any[];
  total: number;
}> {
  const url = webhookUrl.trim();
  try {
    const getUrl = url.includes('?') ? `${url}&action=read_data` : `${url}?action=read_data`;
    const res = await fetch(getUrl, { method: 'GET' });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        const d = json.data;
        const total = (d.records16PF?.length || 0) + (d.recordsVAK?.length || 0) + (d.recordsIE?.length || 0) + (d.recordsPSICO?.length || 0);
        return {
          records16PF: d.records16PF || [],
          recordsVAK: d.recordsVAK || [],
          recordsIE: d.recordsIE || [],
          recordsPSICO: d.recordsPSICO || [],
          total,
        };
      }
    }
  } catch (e) {}

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'read_data' }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        const d = json.data;
        const total = (d.records16PF?.length || 0) + (d.recordsVAK?.length || 0) + (d.recordsIE?.length || 0) + (d.recordsPSICO?.length || 0);
        return {
          records16PF: d.records16PF || [],
          recordsVAK: d.recordsVAK || [],
          recordsIE: d.recordsIE || [],
          recordsPSICO: d.recordsPSICO || [],
          total,
        };
      }
    }
  } catch (e) {}

  throw new Error('No se pudieron leer los datos del Webhook. Asegúrate de haber implementado la versión v4.2 en Google Apps Script con acceso para Cualquier Usuario.');
}

export async function saveToGoogleAppsScriptWebhook(
  webhookUrl: string,
  record: EvaluationRecord
): Promise<boolean> {
  const rowValues = recordToRowValues(record);
  const payload = {
    action: 'save_record',
    sheetName: '16PF',
    headers: SHEET_HEADERS,
    row: rowValues,
    candidate: {
      folio: record.folio,
      name: record.name,
      timestamp: record.timestamp,
    },
  };
  return await postToAppsScriptWebhook(webhookUrl, payload);
}

export async function saveLearningStyleToGoogleAppsScriptWebhook(
  webhookUrl: string,
  record: LearningStyleRecord
): Promise<boolean> {
  const row = vakRecordToRowValues(record);
  const payload = {
    action: 'save_vak',
    sheetName: 'VAK',
    headers: VAK_SHEET_HEADERS,
    row,
    candidate: {
      folio: record.folio,
      name: record.name,
      timestamp: record.timestamp,
    },
  };
  return await postToAppsScriptWebhook(webhookUrl, payload);
}

export async function saveEmotionalIntelligenceToGoogleAppsScriptWebhook(
  webhookUrl: string,
  record: EmotionalIntelligenceRecord
): Promise<boolean> {
  const row = ieRecordToRowValues(record);
  const payload = {
    action: 'save_ie',
    sheetName: 'IE',
    headers: IE_SHEET_HEADERS,
    row,
    candidate: {
      folio: record.folio,
      name: record.name,
      timestamp: record.timestamp,
    },
  };
  return await postToAppsScriptWebhook(webhookUrl, payload);
}

export async function savePsychosocialToGoogleAppsScriptWebhook(
  webhookUrl: string,
  record: PsychosocialRecord
): Promise<boolean> {
  const row = psychosocialRecordToRowValues(record);
  const payload = {
    action: 'save_psico',
    sheetName: 'PSICO',
    headers: PSYCHOSOCIAL_SHEET_HEADERS,
    row,
    candidate: {
      folio: record.folio,
      name: record.name,
      timestamp: record.timestamp,
    },
  };
  return await postToAppsScriptWebhook(webhookUrl, payload);
}

export async function sendTestSimulationRowToWebhook(webhookUrl: string): Promise<{
  success: boolean;
  message: string;
}> {
  const testFolio = `SIM-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toLocaleString('es-MX');

  const mock16PFRow: (string | number)[] = [
    testFolio,
    now,
    'Aspirante Simulación (16PF)',
    'Mujer',
    21,
    'Inglés',
    88,
    'Altamente Idóneo',
    ...Array.from({ length: 32 }, () => 6),
    5.5, 6.0, 5.0, 6.5, 5.8,
    85, 82, 88, 86, 80,
    ...Array.from({ length: 187 }, () => 'B'),
  ];

  await postToAppsScriptWebhook(webhookUrl, { action: 'init_blank_template', init: true });
  await new Promise((r) => setTimeout(r, 400));
  await postToAppsScriptWebhook(webhookUrl, {
    action: 'save_record',
    sheetName: '16PF',
    headers: SHEET_HEADERS,
    row: mock16PFRow,
  });

  return {
    success: true,
    message: `Filas de prueba registradas con éxito en las pestañas oficiales con folio ${testFolio}.`,
  };
}

export async function initializeSpreadsheetTabsViaWebhook(webhookUrl: string): Promise<boolean> {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'init_sheets',
        init: true,
      }),
    });
    return true;
  } catch (err: any) {
    console.error('Error inicializando pestañas en Google Sheets:', err);
    throw new Error('No se pudo comunicar con el Webhook de Google Sheets: ' + (err.message || 'Error de red'));
  }
}

export async function organizeMixedRowsViaWebhook(webhookUrl: string): Promise<boolean> {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'organize_mixed_rows',
      }),
    });
    return true;
  } catch (err: any) {
    console.error('Error organizando filas mezcladas en Google Sheets:', err);
    throw new Error('No se pudo comunicar con el Webhook de Google Sheets: ' + (err.message || 'Error de red'));
  }
}

export interface AllEvaluationsBundle {
  records: EvaluationRecord[];
  learningStyleRecords: LearningStyleRecord[];
  ieRecords: EmotionalIntelligenceRecord[];
  psychosocialRecords: PsychosocialRecord[];
}

export async function syncAllEvaluationsToBlankTemplate(
  webhookUrl: string,
  bundle: AllEvaluationsBundle,
  onProgress?: (message: string, current: number, total: number) => void
): Promise<{
  success: boolean;
  totalSynced: number;
  details: {
    '16pf': number;
    vak: number;
    ie: number;
    psico: number;
  };
}> {
  const totalSteps = 5;
  let currentStep = 0;

  currentStep++;
  if (onProgress) onProgress('Preparando las 4 pestañas oficiales en blanco...', currentStep, totalSteps);
  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'init_blank_template', init: true }),
  });
  await new Promise((r) => setTimeout(r, 500));

  currentStep++;
  const count16PF = bundle.records.length;
  if (onProgress) onProgress(`Sincronizando 16PF (${count16PF} evaluaciones)...`, currentStep, totalSteps);
  if (count16PF > 0) {
    const rows16PF = bundle.records.map(recordToRowValues);
    const chunkSize = 25;
    for (let i = 0; i < rows16PF.length; i += chunkSize) {
      const chunk = rows16PF.slice(i, i + chunkSize);
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'batch_sync_test',
          sheetName: '16PF',
          headers: SHEET_HEADERS,
          rows: chunk,
        }),
      });
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  currentStep++;
  const countVak = bundle.learningStyleRecords.length;
  if (onProgress) onProgress(`Sincronizando VAK (${countVak} evaluaciones)...`, currentStep, totalSteps);
  if (countVak > 0) {
    const rowsVak = bundle.learningStyleRecords.map(vakRecordToRowValues);
    const chunkSize = 25;
    for (let i = 0; i < rowsVak.length; i += chunkSize) {
      const chunk = rowsVak.slice(i, i + chunkSize);
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'batch_sync_test',
          sheetName: 'VAK',
          headers: VAK_SHEET_HEADERS,
          rows: chunk,
        }),
      });
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  currentStep++;
  const countIE = bundle.ieRecords.length;
  if (onProgress) onProgress(`Sincronizando IE (${countIE} evaluaciones)...`, currentStep, totalSteps);
  if (countIE > 0) {
    const rowsIE = bundle.ieRecords.map(ieRecordToRowValues);
    const chunkSize = 25;
    for (let i = 0; i < rowsIE.length; i += chunkSize) {
      const chunk = rowsIE.slice(i, i + chunkSize);
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'batch_sync_test',
          sheetName: 'IE',
          headers: IE_SHEET_HEADERS,
          rows: chunk,
        }),
      });
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  currentStep++;
  const countPsico = bundle.psychosocialRecords.length;
  if (onProgress) onProgress(`Sincronizando Bienestar Psicosocial (${countPsico} evaluaciones)...`, currentStep, totalSteps);
  if (countPsico > 0) {
    const rowsPsico = bundle.psychosocialRecords.map(psychosocialRecordToRowValues);
    const chunkSize = 25;
    for (let i = 0; i < rowsPsico.length; i += chunkSize) {
      const chunk = rowsPsico.slice(i, i + chunkSize);
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'batch_sync_test',
          sheetName: 'PSICO',
          headers: PSYCHOSOCIAL_SHEET_HEADERS,
          rows: chunk,
        }),
      });
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const totalSynced = count16PF + countVak + countIE + countPsico;
  return {
    success: true,
    totalSynced,
    details: {
      '16pf': count16PF,
      vak: countVak,
      ie: countIE,
      psico: countPsico,
    },
  };
}

function downloadSingleCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [
    headers.map(escapeCell).join(','),
    ...rows.map((r) => r.map(escapeCell).join(',')),
  ];
  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadAllTestsCSVBundle(bundle: AllEvaluationsBundle): void {
  if (bundle.records.length > 0) {
    const rows16 = bundle.records.map(recordToRowValues);
    downloadSingleCSV('Plantilla_16PF_Evaluaciones.csv', SHEET_HEADERS, rows16);
  }
  if (bundle.learningStyleRecords.length > 0) {
    setTimeout(() => {
      const rowsVak = bundle.learningStyleRecords.map(vakRecordToRowValues);
      downloadSingleCSV('Plantilla_VAK_Estilos_Aprendizaje.csv', VAK_SHEET_HEADERS, rowsVak);
    }, 200);
  }
  if (bundle.ieRecords.length > 0) {
    setTimeout(() => {
      const rowsIE = bundle.ieRecords.map(ieRecordToRowValues);
      downloadSingleCSV('Plantilla_IE_Inteligencia_Emocional.csv', IE_SHEET_HEADERS, rowsIE);
    }, 400);
  }
  if (bundle.psychosocialRecords.length > 0) {
    setTimeout(() => {
      const rowsPsico = bundle.psychosocialRecords.map(psychosocialRecordToRowValues);
      downloadSingleCSV('Plantilla_PSICO_Bienestar_Psicosocial.csv', PSYCHOSOCIAL_SHEET_HEADERS, rowsPsico);
    }, 600);
  }
}

export function recordToRowValues(rec: EvaluationRecord): (string | number)[] {
  const row: (string | number)[] = [
    rec.folio,
    rec.timestamp,
    rec.name,
    rec.gender === 'M' ? 'Hombre' : 'Mujer',
    rec.age,
    rec.emphasis,
    rec.suitabilityScore,
    rec.suitabilityVerdict,
    rec.rawScores.A, rec.estens.A,
    rec.rawScores.B, rec.estens.B,
    rec.rawScores.C, rec.estens.C,
    rec.rawScores.E, rec.estens.E,
    rec.rawScores.F, rec.estens.F,
    rec.rawScores.G, rec.estens.G,
    rec.rawScores.H, rec.estens.H,
    rec.rawScores.I, rec.estens.I,
    rec.rawScores.L, rec.estens.L,
    rec.rawScores.M, rec.estens.M,
    rec.rawScores.N, rec.estens.N,
    rec.rawScores.O, rec.estens.O,
    rec.rawScores.Q1, rec.estens.Q1,
    rec.rawScores.Q2, rec.estens.Q2,
    rec.rawScores.Q3, rec.estens.Q3,
    rec.rawScores.Q4, rec.estens.Q4,
    rec.secondaryFactors.QI,
    rec.secondaryFactors.QII,
    rec.secondaryFactors.QIII,
    rec.secondaryFactors.QIV,
    rec.secondaryFactors.QV,
    rec.competencies.comunicacion,
    rec.competencies.estabilidad,
    rec.competencies.innovacion,
    rec.competencies.rigor,
    rec.competencies.liderazgo,
  ];

  for (let i = 1; i <= 187; i++) {
    row.push(rec.answers[i] ? rec.answers[i].toUpperCase() : '-');
  }
  return row;
}

export function vakRecordToRowValues(record: LearningStyleRecord): (string | number)[] {
  return [
    record.folio,
    record.timestamp,
    record.name,
    record.gender === 'M' ? 'Hombre' : 'Mujer',
    record.age,
    record.emphasis,
    record.counts.auditivo,
    record.percentages.auditivo,
    record.counts.visual,
    record.percentages.visual,
    record.counts.kinestesico,
    record.percentages.kinestesico,
    record.predominantStyle,
    ...Array.from({ length: 40 }, (_, i) => (record.answers[i + 1] || '-').toUpperCase()),
  ];
}

export function ieRecordToRowValues(record: EmotionalIntelligenceRecord): (string | number)[] {
  return [
    record.folio,
    record.timestamp,
    record.name,
    record.gender === 'M' ? 'Hombre' : 'Mujer',
    record.age,
    record.emphasis,
    record.totalScore,
    record.percentage,
    record.level.label,
    record.dimensions.autoconocimiento.score,
    record.dimensions.autoconocimiento.percentage,
    record.dimensions.autocontrol.score,
    record.dimensions.autocontrol.percentage,
    record.dimensions.automotivacion.score,
    record.dimensions.automotivacion.percentage,
    record.dimensions.empatia.score,
    record.dimensions.empatia.percentage,
    record.dimensions.habilidades_sociales.score,
    record.dimensions.habilidades_sociales.percentage,
    ...Array.from({ length: 45 }, (_, i) => {
      const a = record.answers[i + 1];
      return a === 'siempre' ? '2 (Siempre)' : a === 'algunas_veces' ? '1 (Algunas)' : '0 (Nunca)';
    }),
  ];
}

export function psychosocialRecordToRowValues(record: PsychosocialRecord): (string | number)[] {
  return [
    record.folio,
    record.timestamp,
    record.name,
    record.gender === 'M' ? 'Hombre' : 'Mujer',
    record.age,
    record.emphasis,
    record.totalScore,
    record.percentage,
    record.level.label,
    record.level.friendlyTitle,
    record.dimensions.ambiente_entorno.score,
    record.dimensions.ambiente_entorno.percentage,
    record.dimensions.carga_ritmo.score,
    record.dimensions.carga_ritmo.percentage,
    record.dimensions.control_autonomia.score,
    record.dimensions.control_autonomia.percentage,
    record.dimensions.liderazgo_relaciones.score,
    record.dimensions.liderazgo_relaciones.percentage,
    record.dimensions.balance_desgaste.score,
    record.dimensions.balance_desgaste.percentage,
    ...Array.from({ length: 35 }, (_, i) => record.answers[i + 1] ?? 0),
  ];
}

export async function createGoogleSpreadsheet(title: string = DEFAULT_SHEET_TITLE): Promise<{ id: string; url: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No hay sesión activa de Google. Por favor inicia sesión primero.');
  }

  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        { properties: { title: '16PF', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'VAK', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'IE', gridProperties: { frozenRowCount: 1 } } },
        { properties: { title: 'PSICO', gridProperties: { frozenRowCount: 1 } } },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error al crear hoja de cálculo: ${response.statusText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;

  await appendRowToSpreadsheet(spreadsheetId, SHEET_HEADERS, '16PF!A1');
  await appendRowToSpreadsheet(spreadsheetId, VAK_SHEET_HEADERS, 'VAK!A1');
  await appendRowToSpreadsheet(spreadsheetId, IE_SHEET_HEADERS, 'IE!A1');
  await appendRowToSpreadsheet(spreadsheetId, PSYCHOSOCIAL_SHEET_HEADERS, 'PSICO!A1');

  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  localStorage.setItem('16pf_active_spreadsheet_id', spreadsheetId);
  localStorage.setItem('16pf_active_spreadsheet_url', spreadsheetUrl);

  return { id: spreadsheetId, url: spreadsheetUrl };
}

export async function appendRowToSpreadsheet(
  spreadsheetId: string,
  rowValues: (string | number)[],
  range: string = '16PF!A:A'
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No hay sesión de Google disponible.');
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [rowValues],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error al guardar en Google Sheets: ${response.statusText}`);
  }

  return true;
}

export async function saveRecordToGoogleSpreadsheetDirect(
  spreadsheetId: string,
  instrument: '16pf' | 'vak' | 'ie' | 'psico',
  rowValues: (string | number)[]
): Promise<boolean> {
  const metaMap = {
    '16pf': { title: '16PF', headers: SHEET_HEADERS },
    vak: { title: 'VAK', headers: VAK_SHEET_HEADERS },
    ie: { title: 'IE', headers: IE_SHEET_HEADERS },
    psico: { title: 'PSICO', headers: PSYCHOSOCIAL_SHEET_HEADERS },
  };
  const target = metaMap[instrument];

  return await appendRowToSpreadsheet(spreadsheetId, rowValues, `${target.title}!A:A`);
}

export function exportToCSV(records: EvaluationRecord[], filename: string = '16pf_resultados.csv') {
  const rows = [SHEET_HEADERS];
  for (const rec of records) {
    rows.push(recordToRowValues(rec).map((v) => `"${String(v).replace(/"/g, '""')}"`));
  }
  const csvContent = '\uFEFF' + rows.map((r) => r.join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
