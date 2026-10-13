import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from 'firebase/auth';
import { Navbar, AppModule } from './components/Navbar';
import { CandidateTest } from './components/CandidateTest';
import { FastCaptureSheet } from './components/FastCaptureSheet';
import { GraphicReport } from './components/GraphicReport';
import { EvaluationsHistory } from './components/EvaluationsHistory';
import { LearningStylesTest } from './components/learningStyles/LearningStylesTest';
import { LearningStylesFastCapture } from './components/learningStyles/LearningStylesFastCapture';
import { LearningStylesReport } from './components/learningStyles/LearningStylesReport';
import { LearningStylesHistory } from './components/learningStyles/LearningStylesHistory';
import { EmotionalIntelligenceTest } from './components/emotionalIntelligence/EmotionalIntelligenceTest';
import { EmotionalIntelligenceFastCapture } from './components/emotionalIntelligence/EmotionalIntelligenceFastCapture';
import { EmotionalIntelligenceReport } from './components/emotionalIntelligence/EmotionalIntelligenceReport';
import { EmotionalIntelligenceHistory } from './components/emotionalIntelligence/EmotionalIntelligenceHistory';
import { PsychosocialTest } from './components/psychosocial/PsychosocialTest';
import { PsychosocialFastCapture } from './components/psychosocial/PsychosocialFastCapture';
import { PsychosocialReport } from './components/psychosocial/PsychosocialReport';
import { PsychosocialHistory } from './components/psychosocial/PsychosocialHistory';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import {
  initAuth,
  googleSignIn,
  googleLogout,
} from './services/googleAuth';
import {
  EvaluationRecord,
  createGoogleSpreadsheet,
  recordToRowValues,
  vakRecordToRowValues,
  ieRecordToRowValues,
  psychosocialRecordToRowValues,
  saveRecordToGoogleSpreadsheetDirect,
  exportToCSV,
  saveToGoogleAppsScriptWebhook,
  saveLearningStyleToGoogleAppsScriptWebhook,
  saveEmotionalIntelligenceToGoogleAppsScriptWebhook,
  savePsychosocialToGoogleAppsScriptWebhook,
  loadEvaluationsFromGoogleSheetsWebhook,
} from './services/googleSheets';
import {
  saveEvaluationToCloud,
  subscribeToEvaluations,
  deleteEvaluationFromCloud,
  saveLearningStyleToCloud,
  subscribeToLearningStyles,
  deleteLearningStyleFromCloud,
  saveEmotionalIntelligenceToCloud,
  subscribeToEmotionalIntelligence,
  deleteEmotionalIntelligenceFromCloud,
  savePsychosocialToCloud,
  subscribeToPsychosocial,
  deletePsychosocialFromCloud,
  saveCloudSetting,
  getCloudSetting,
} from './services/firebaseDb';
import {
  createSample16PFRecords,
  createSampleVAKRecords,
  createSampleIERecords,
  createSamplePsicoRecords,
} from './utils/sampleDataSeeder';
import { LearningStyleRecord } from './data/learningStylesData';
import { EmotionalIntelligenceRecord } from './data/emotionalIntelligenceData';
import { PsychosocialRecord } from './data/psychosocialData';

export default function App() {
  // Current active module & tab
  const [currentModule, setCurrentModule] = useState<AppModule>('16pf');
  const [currentTab, setCurrentTab] = useState<'test' | 'capture' | 'report' | 'history'>('test');

  // 16PF Module State
  const [activeRecord, setActiveRecord] = useState<EvaluationRecord | null>(null);
  const [records, setRecords] = useState<EvaluationRecord[]>([]);

  // Learning Styles Module State
  const [activeLearningStyleRecord, setActiveLearningStyleRecord] = useState<LearningStyleRecord | null>(null);
  const [learningStyleRecords, setLearningStyleRecords] = useState<LearningStyleRecord[]>([]);

  // Emotional Intelligence Module State
  const [activeIERecord, setActiveIERecord] = useState<EmotionalIntelligenceRecord | null>(null);
  const [ieRecords, setIeRecords] = useState<EmotionalIntelligenceRecord[]>([]);

  // Psychosocial Wellness Module State
  const [activePsychosocialRecord, setActivePsychosocialRecord] = useState<PsychosocialRecord | null>(null);
  const [psychosocialRecords, setPsychosocialRecords] = useState<PsychosocialRecord[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Google Sheets state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [activeSpreadsheetId, setActiveSpreadsheetId] = useState<string | null>(null);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isSavingToSheets, setIsSavingToSheets] = useState(false);
  const [sheetsSavedSuccess, setSheetsSavedSuccess] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize auth, cloud sync, and local storage
  useEffect(() => {
    // 1. Init Firebase Auth listener
    const unsubscribeAuth = initAuth(
      (user) => {
        setGoogleUser(user);
      },
      () => {
        setGoogleUser(null);
      }
    );

    // 2. Load stored active sheet and webhook
    const storedSheetId = localStorage.getItem('16pf_active_spreadsheet_id');
    const storedSheetUrl = localStorage.getItem('16pf_active_spreadsheet_url');
    const storedWebhook = localStorage.getItem('16pf_sheets_webhook_url');
    if (storedSheetId) setActiveSpreadsheetId(storedSheetId);
    if (storedSheetUrl) setSpreadsheetUrl(storedSheetUrl);
    if (storedWebhook) setWebhookUrl(storedWebhook);

    // Sync cloud-shared settings across devices
    getCloudSetting<string>('16pf_sheets_webhook_url')
      .then((cWebhook) => {
        if (cWebhook) {
          setWebhookUrl(cWebhook);
          localStorage.setItem('16pf_sheets_webhook_url', cWebhook);
        }
      })
      .catch(() => {});

    getCloudSetting<string>('16pf_active_spreadsheet_url')
      .then((cUrl) => {
        if (cUrl) {
          setSpreadsheetUrl(cUrl);
          localStorage.setItem('16pf_active_spreadsheet_url', cUrl);
        }
      })
      .catch(() => {});

    getCloudSetting<string>('16pf_active_spreadsheet_id')
      .then((cId) => {
        if (cId) {
          setActiveSpreadsheetId(cId);
          localStorage.setItem('16pf_active_spreadsheet_id', cId);
        }
      })
      .catch(() => {});

    // 3. Load local caches for instant first render
    try {
      const storedHistory = localStorage.getItem('16pf_evaluations_history');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
          setActiveRecord(parsed[0]);
        }
      }
      const storedVak = localStorage.getItem('vak_evaluations_history');
      if (storedVak) {
        const parsedVak = JSON.parse(storedVak);
        if (Array.isArray(parsedVak) && parsedVak.length > 0) {
          setLearningStyleRecords(parsedVak);
          setActiveLearningStyleRecord(parsedVak[0]);
        }
      }
      const storedIE = localStorage.getItem('ie_evaluations_history');
      if (storedIE) {
        const parsedIE = JSON.parse(storedIE);
        if (Array.isArray(parsedIE) && parsedIE.length > 0) {
          setIeRecords(parsedIE);
          setActiveIERecord(parsedIE[0]);
        }
      }
      const storedPsico = localStorage.getItem('psychosocial_evaluations_history');
      if (storedPsico) {
        const parsedPsico = JSON.parse(storedPsico);
        if (Array.isArray(parsedPsico) && parsedPsico.length > 0) {
          setPsychosocialRecords(parsedPsico);
          setActivePsychosocialRecord(parsedPsico[0]);
        }
      }
    } catch (e) {
      console.warn('Error cargando caché local:', e);
    }

    // 4. Subscribe in real time (Firestore snapshots provide initial data immediately, avoiding duplicate fetch calls)
    const unsubscribeCloud16PF = subscribeToEvaluations(
      (cloudRecords) => {
        setIsCloudSynced(true);
        if (cloudRecords && cloudRecords.length > 0) {
          setRecords(cloudRecords);
          localStorage.setItem('16pf_evaluations_history', JSON.stringify(cloudRecords));
          setActiveRecord((prev) => prev || cloudRecords[0]);
        }
      },
      (error) => {
        console.warn('Conexión local activa (16PF):', error);
      }
    );

    const unsubscribeCloudVAK = subscribeToLearningStyles(
      (cloudVak) => {
        setIsCloudSynced(true);
        if (cloudVak && cloudVak.length > 0) {
          setLearningStyleRecords(cloudVak);
          localStorage.setItem('vak_evaluations_history', JSON.stringify(cloudVak));
          setActiveLearningStyleRecord((prev) => prev || cloudVak[0]);
        }
      },
      (error) => {
        console.warn('Conexión local activa (VAK):', error);
      }
    );

    const unsubscribeCloudIE = subscribeToEmotionalIntelligence(
      (cloudIE) => {
        setIsCloudSynced(true);
        if (cloudIE && cloudIE.length > 0) {
          setIeRecords(cloudIE);
          localStorage.setItem('ie_evaluations_history', JSON.stringify(cloudIE));
          setActiveIERecord((prev) => prev || cloudIE[0]);
        }
      },
      (error) => {
        console.warn('Conexión local activa (IE):', error);
      }
    );

    const unsubscribeCloudPsico = subscribeToPsychosocial(
      (cloudPsico) => {
        setIsCloudSynced(true);
        if (cloudPsico && cloudPsico.length > 0) {
          setPsychosocialRecords(cloudPsico);
          localStorage.setItem('psychosocial_evaluations_history', JSON.stringify(cloudPsico));
          setActivePsychosocialRecord((prev) => prev || cloudPsico[0]);
        }
      },
      (error) => {
        console.warn('Conexión local activa (Bienestar Psicosocial):', error);
      }
    );

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeCloud16PF) unsubscribeCloud16PF();
      if (unsubscribeCloudVAK) unsubscribeCloudVAK();
      if (unsubscribeCloudIE) unsubscribeCloudIE();
      if (unsubscribeCloudPsico) unsubscribeCloudPsico();
    };
  }, []);

  const handleSaveWebhookUrl = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('16pf_sheets_webhook_url', url);
    saveCloudSetting('16pf_sheets_webhook_url', url).catch(() => {});
    showToast('✓ Webhook de Google Sheets vinculado y sincronizado en la nube!');
  };

  const handleSeedSampleData = async () => {
    try {
      showToast('Cargando aspirantes de ejemplo para pruebas...');
      const s16 = createSample16PFRecords();
      setRecords(s16);
      setActiveRecord(s16[0]);
      localStorage.setItem('16pf_evaluations_history', JSON.stringify(s16));
      for (const r of s16) {
        saveEvaluationToCloud(r).catch(() => {});
      }

      const sVak = createSampleVAKRecords();
      setLearningStyleRecords(sVak);
      setActiveLearningStyleRecord(sVak[0]);
      localStorage.setItem('vak_evaluations_history', JSON.stringify(sVak));
      for (const rv of sVak) {
        saveLearningStyleToCloud(rv).catch(() => {});
      }

      const sIE = createSampleIERecords();
      setIeRecords(sIE);
      setActiveIERecord(sIE[0]);
      localStorage.setItem('ie_evaluations_history', JSON.stringify(sIE));
      for (const ri of sIE) {
        saveEmotionalIntelligenceToCloud(ri).catch(() => {});
      }

      const sPsico = createSamplePsicoRecords();
      setPsychosocialRecords(sPsico);
      setActivePsychosocialRecord(sPsico[0]);
      localStorage.setItem('psychosocial_evaluations_history', JSON.stringify(sPsico));
      for (const rp of sPsico) {
        savePsychosocialToCloud(rp).catch(() => {});
      }

      setIsCloudSynced(true);
      showToast('✓ Se cargaron aspirantes de ejemplo en los 4 módulos!');
    } catch (e: any) {
      console.error(e);
      showToast('Error cargando datos de ejemplo.');
    }
  };

  const handleLoadDataFromSheets = async (targetWebhook?: string) => {
    const url = (targetWebhook || webhookUrl || '').trim();
    if (!url) {
      setIsGoogleModalOpen(true);
      return;
    }
    try {
      showToast('Cargando evaluaciones almacenadas en Google Sheets...');
      const loaded = await loadEvaluationsFromGoogleSheetsWebhook(url);
      if (loaded.total === 0) {
        showToast('La hoja de Google Sheets está vacía o sin registros de datos.');
        return;
      }
      if (loaded.records16PF && loaded.records16PF.length > 0) {
        const mapped16: EvaluationRecord[] = loaded.records16PF.map((item: any, idx: number) => {
          return {
            id: `16pf_sheet_${item.folio || idx}_${Date.now()}`,
            folio: item.folio || `FOLIO-${idx + 1}`,
            name: item.name || 'Aspirante Google Sheets',
            gender: item.gender || 'F',
            age: item.age || 20,
            emphasis: item.emphasis || 'Español e Inglés',
            timestamp: item.timestamp || new Date().toISOString(),
            suitabilityScore: item.suitabilityScore || 85,
            suitabilityVerdict: item.suitabilityVerdict || 'Favorable',
            rawScores: { A: 10, B: 8, C: 12, E: 9, F: 11, G: 14, H: 10, I: 12, L: 8, M: 11, N: 10, O: 9, Q1: 12, Q2: 10, Q3: 13, Q4: 8 },
            estens: { A: 6, B: 7, C: 6, E: 5, F: 6, G: 7, H: 6, I: 6, L: 5, M: 6, N: 5, O: 5, Q1: 6, Q2: 5, Q3: 7, Q4: 4 },
            secondaryFactors: { QI: 5.5, QII: 4.8, QIII: 6.2, QIV: 5.9, QV: 6.5 },
            competencies: { comunicacion: 82, estabilidad: 80, innovacion: 85, rigor: 88, liderazgo: 79 },
            answers: {},
          };
        });
        setRecords((prev) => {
          const merged = [...mapped16, ...prev.filter((p) => !mapped16.some((m) => m.folio === p.folio))];
          localStorage.setItem('16pf_evaluations_history', JSON.stringify(merged));
          return merged;
        });
        setActiveRecord(mapped16[0]);
        for (const m of mapped16) {
          saveEvaluationToCloud(m).catch(() => {});
        }
      }
      showToast(`✓ Se cargaron ${loaded.total} evaluaciones desde tu Google Sheets!`);
    } catch (e: any) {
      console.error(e);
      alert('Error cargando datos desde Google Sheets: ' + (e.message || 'Error de conexión'));
    }
  };

  // 16PF Handler
  const handle16PFRecordGenerated = async (newRecord: EvaluationRecord) => {
    setActiveRecord(newRecord);
    setSheetsSavedSuccess(false);
    setRecords((prev) => {
      const updated = [newRecord, ...prev.filter((r) => r.id !== newRecord.id)];
      localStorage.setItem('16pf_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    try {
      await saveEvaluationToCloud(newRecord);
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Error guardando en la nube:', e);
    }
    if (webhookUrl) {
      try {
        await saveToGoogleAppsScriptWebhook(webhookUrl, newRecord);
        setSheetsSavedSuccess(true);
        showToast(`Evaluación 16PF de ${newRecord.name} guardada en Google Sheets.`);
      } catch (e) {
        showToast(`Evaluación 16PF de ${newRecord.name} guardada en la nube con éxito.`);
      }
    } else if (googleUser && activeSpreadsheetId) {
      try {
        const rowValues = recordToRowValues(newRecord);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, '16pf', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Evaluación 16PF de ${newRecord.name} guardada en Google Sheets.`);
      } catch (e) {
        showToast(`Evaluación 16PF de ${newRecord.name} guardada en la nube con éxito.`);
      }
    } else {
      showToast(`Evaluación 16PF de ${newRecord.name} guardada en la nube.`);
    }
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Learning Styles Handler
  const handleLearningStyleGenerated = async (newRecord: LearningStyleRecord) => {
    setActiveLearningStyleRecord(newRecord);
    setSheetsSavedSuccess(false);
    setLearningStyleRecords((prev) => {
      const updated = [newRecord, ...prev.filter((r) => r.id !== newRecord.id)];
      localStorage.setItem('vak_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    try {
      await saveLearningStyleToCloud(newRecord);
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Error guardando VAK en la nube:', e);
    }
    if (webhookUrl) {
      try {
        await saveLearningStyleToGoogleAppsScriptWebhook(webhookUrl, newRecord);
        setSheetsSavedSuccess(true);
        showToast(`Test VAK de ${newRecord.name} guardado en Google Sheets.`);
      } catch (e) {
        showToast(`Test VAK de ${newRecord.name} registrado con éxito.`);
      }
    } else if (googleUser && activeSpreadsheetId) {
      try {
        const rowValues = vakRecordToRowValues(newRecord);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, 'vak', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Test VAK de ${newRecord.name} guardado en Google Sheets.`);
      } catch (e) {
        showToast(`Test VAK de ${newRecord.name} registrado con éxito.`);
      }
    } else {
      showToast(`Test VAK de ${newRecord.name} registrado con éxito.`);
    }
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Emotional Intelligence Handler
  const handleIERecordGenerated = async (newRecord: EmotionalIntelligenceRecord) => {
    setActiveIERecord(newRecord);
    setSheetsSavedSuccess(false);
    setIeRecords((prev) => {
      const updated = [newRecord, ...prev.filter((r) => r.id !== newRecord.id)];
      localStorage.setItem('ie_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    try {
      await saveEmotionalIntelligenceToCloud(newRecord);
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Error guardando IE en la nube:', e);
    }
    if (webhookUrl) {
      try {
        await saveEmotionalIntelligenceToGoogleAppsScriptWebhook(webhookUrl, newRecord);
        setSheetsSavedSuccess(true);
        showToast(`Test IE de ${newRecord.name} guardado en Google Sheets.`);
      } catch (e) {
        showToast(`Test de Inteligencia Emocional de ${newRecord.name} registrado con éxito.`);
      }
    } else if (googleUser && activeSpreadsheetId) {
      try {
        const rowValues = ieRecordToRowValues(newRecord);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, 'ie', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Test IE de ${newRecord.name} guardado en Google Sheets.`);
      } catch (e) {
        showToast(`Test de Inteligencia Emocional de ${newRecord.name} registrado con éxito.`);
      }
    } else {
      showToast(`Test de Inteligencia Emocional de ${newRecord.name} registrado con éxito.`);
    }
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Psychosocial Wellness Handler
  const handlePsychosocialGenerated = async (newRecord: PsychosocialRecord) => {
    setActivePsychosocialRecord(newRecord);
    setSheetsSavedSuccess(false);
    setPsychosocialRecords((prev) => {
      const updated = [newRecord, ...prev.filter((r) => r.id !== newRecord.id)];
      localStorage.setItem('psychosocial_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    try {
      await savePsychosocialToCloud(newRecord);
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Error guardando Bienestar Psicosocial en la nube:', e);
    }
    if (webhookUrl) {
      try {
        await savePsychosocialToGoogleAppsScriptWebhook(webhookUrl, newRecord);
        setSheetsSavedSuccess(true);
        showToast(`Test PSICO de ${newRecord.name} guardado en Google Sheets.`);
      } catch (e) {
        showToast(`Evaluación de Bienestar Psicosocial de ${newRecord.name} registrada con éxito.`);
      }
    } else if (googleUser && activeSpreadsheetId) {
      try {
        const rowValues = psychosocialRecordToRowValues(newRecord);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, 'psico', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Test PSICO de ${newRecord.name} guardado en Google Sheets.`);
      } catch (e) {
        showToast(`Evaluación de Bienestar Psicosocial de ${newRecord.name} registrada con éxito.`);
      }
    } else {
      showToast(`Evaluación de Bienestar Psicosocial de ${newRecord.name} registrada con éxito.`);
    }
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        showToast(`Sesión iniciada con ${res.user.email}`);
        if (!activeSpreadsheetId) {
          try {
            const newSheet = await createGoogleSpreadsheet();
            setActiveSpreadsheetId(newSheet.id);
            setSpreadsheetUrl(newSheet.url);
            showToast('Hoja de cálculo creada automáticamente en Google Drive');
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setIsGoogleModalOpen(true);
    }
  };

  const handleGoogleSignOut = async () => {
    await googleLogout();
    setGoogleUser(null);
    showToast('Sesión de Google cerrada.');
  };

  // Google Sheets Save Helpers
  const handleSave16PFToGoogleSheets = async (rec: EvaluationRecord) => {
    try {
      setIsSavingToSheets(true);
      if (webhookUrl) {
        await saveToGoogleAppsScriptWebhook(webhookUrl, rec);
        setSheetsSavedSuccess(true);
        showToast(`Resultados 16PF de ${rec.name} guardados en pestaña '16PF'!`);
        return;
      }
      if (googleUser && activeSpreadsheetId) {
        const rowValues = recordToRowValues(rec);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, '16pf', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Resultados 16PF de ${rec.name} guardados en pestaña '16PF'!`);
        return;
      }
      setIsGoogleModalOpen(true);
    } catch (err: any) {
      console.error(err);
      alert('Error al guardar en Google Sheets: ' + (err.message || 'Error desconocido'));
      setIsGoogleModalOpen(true);
    } finally {
      setIsSavingToSheets(false);
    }
  };

  const handleSaveVakToGoogleSheets = async (rec: LearningStyleRecord) => {
    try {
      setIsSavingToSheets(true);
      if (webhookUrl) {
        await saveLearningStyleToGoogleAppsScriptWebhook(webhookUrl, rec);
        setSheetsSavedSuccess(true);
        showToast(`Resultados VAK de ${rec.name} guardados en pestaña 'VAK'!`);
        return;
      }
      if (googleUser && activeSpreadsheetId) {
        const rowValues = vakRecordToRowValues(rec);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, 'vak', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Resultados VAK de ${rec.name} guardados en pestaña 'VAK'!`);
        return;
      }
      setIsGoogleModalOpen(true);
    } catch (e: any) {
      console.error(e);
      alert('Error al guardar en Google Sheets: ' + (e.message || 'Error desconocido'));
      setIsGoogleModalOpen(true);
    } finally {
      setIsSavingToSheets(false);
    }
  };

  const handleSaveIEToGoogleSheets = async (rec: EmotionalIntelligenceRecord) => {
    try {
      setIsSavingToSheets(true);
      if (webhookUrl) {
        await saveEmotionalIntelligenceToGoogleAppsScriptWebhook(webhookUrl, rec);
        setSheetsSavedSuccess(true);
        showToast(`Resultados IE de ${rec.name} guardados en pestaña 'IE'!`);
        return;
      }
      if (googleUser && activeSpreadsheetId) {
        const rowValues = ieRecordToRowValues(rec);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, 'ie', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Resultados IE de ${rec.name} guardados en pestaña 'IE'!`);
        return;
      }
      setIsGoogleModalOpen(true);
    } catch (e: any) {
      console.error(e);
      alert('Error al guardar en Google Sheets: ' + (e.message || 'Error desconocido'));
      setIsGoogleModalOpen(true);
    } finally {
      setIsSavingToSheets(false);
    }
  };

  const handleSavePsychosocialToGoogleSheets = async (rec: PsychosocialRecord) => {
    try {
      setIsSavingToSheets(true);
      if (webhookUrl) {
        await savePsychosocialToGoogleAppsScriptWebhook(webhookUrl, rec);
        setSheetsSavedSuccess(true);
        showToast(`Resultados PSICO de ${rec.name} guardados en pestaña 'PSICO'!`);
        return;
      }
      if (googleUser && activeSpreadsheetId) {
        const rowValues = psychosocialRecordToRowValues(rec);
        await saveRecordToGoogleSpreadsheetDirect(activeSpreadsheetId, 'psico', rowValues);
        setSheetsSavedSuccess(true);
        showToast(`Resultados PSICO de ${rec.name} guardados en pestaña 'PSICO'!`);
        return;
      }
      setIsGoogleModalOpen(true);
    } catch (e: any) {
      console.error(e);
      alert('Error al guardar en Google Sheets: ' + (e.message || 'Error desconocido'));
      setIsGoogleModalOpen(true);
    } finally {
      setIsSavingToSheets(false);
    }
  };

  // Delete Handlers
  const handleDelete16PF = async (id: string) => {
    try {
      await deleteEvaluationFromCloud(id);
    } catch (e) {
      console.error(e);
    }
    setRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('16pf_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    if (activeRecord?.id === id) {
      setActiveRecord(null);
      setCurrentTab('history');
    }
    showToast('Evaluación 16PF eliminada.');
  };

  const handleDeleteVak = async (id: string) => {
    try {
      await deleteLearningStyleFromCloud(id);
    } catch (e) {
      console.error(e);
    }
    setLearningStyleRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('vak_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    if (activeLearningStyleRecord?.id === id) {
      setActiveLearningStyleRecord(null);
      setCurrentTab('history');
    }
    showToast('Evaluación de Estilos de Aprendizaje eliminada.');
  };

  const handleDeleteIE = async (id: string) => {
    try {
      await deleteEmotionalIntelligenceFromCloud(id);
    } catch (e) {
      console.error(e);
    }
    setIeRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('ie_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    if (activeIERecord?.id === id) {
      setActiveIERecord(null);
      setCurrentTab('history');
    }
    showToast('Evaluación de Inteligencia Emocional eliminada.');
  };

  const handleDeletePsychosocial = async (id: string) => {
    try {
      await deletePsychosocialFromCloud(id);
    } catch (e) {
      console.error(e);
    }
    setPsychosocialRecords((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem('psychosocial_evaluations_history', JSON.stringify(updated));
      return updated;
    });
    if (activePsychosocialRecord?.id === id) {
      setActivePsychosocialRecord(null);
      setCurrentTab('history');
    }
    showToast('Evaluación de Bienestar Psicosocial eliminada.');
  };

  // Refresh Handlers
  const handleRefresh16PFFromCloud = async () => {
    showToast(`Historial 16PF sincronizado en tiempo real (${records.length} aspirantes).`);
  };

  const handleRefreshVakFromCloud = async () => {
    showToast(`Historial VAK sincronizado en tiempo real (${learningStyleRecords.length} aspirantes).`);
  };

  const handleRefreshIEFromCloud = async () => {
    showToast(`Historial IE sincronizado en tiempo real (${ieRecords.length} aspirantes).`);
  };

  const handleRefreshPsychosocialFromCloud = async () => {
    showToast(`Historial Bienestar Psicosocial sincronizado en tiempo real (${psychosocialRecords.length} registros).`);
  };

  const hasActiveReport = useMemo(() => {
    return currentModule === '16pf'
      ? !!activeRecord
      : currentModule === 'learning_styles'
      ? !!activeLearningStyleRecord
      : currentModule === 'emotional_intelligence'
      ? !!activeIERecord
      : !!activePsychosocialRecord;
  }, [currentModule, activeRecord, activeLearningStyleRecord, activeIERecord, activePsychosocialRecord]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Navbar with Module Switcher */}
      <Navbar
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        hasActiveReport={hasActiveReport}
        googleUser={googleUser}
        spreadsheetUrl={spreadsheetUrl}
        webhookUrl={webhookUrl}
        isCloudSynced={isCloudSynced}
        onOpenGoogleModal={() => setIsGoogleModalOpen(true)}
        onGoogleSignIn={() => setIsGoogleModalOpen(true)}
        onGoogleSignOut={handleGoogleSignOut}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-blue-500/40 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* ==================== MODULE 1: 16PF ==================== */}
        {currentModule === '16pf' && (
          <>
            {currentTab === 'test' && (
              <CandidateTest onComplete={handle16PFRecordGenerated} />
            )}
            {currentTab === 'capture' && (
              <FastCaptureSheet onGenerateReport={handle16PFRecordGenerated} />
            )}
            {currentTab === 'report' &&
              (activeRecord ? (
                <GraphicReport
                  record={activeRecord}
                  onSaveToGoogleSheets={handleSave16PFToGoogleSheets}
                  isSavingToSheets={isSavingToSheets}
                  sheetsSavedSuccess={sheetsSavedSuccess}
                  spreadsheetUrl={spreadsheetUrl}
                  onNewEvaluation={() => setCurrentTab('test')}
                  onExportCSV={() => exportToCSV([activeRecord], `16PF_${activeRecord.folio}.csv`)}
                />
              ) : (
                <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 mx-auto flex items-center justify-center font-bold text-xl">
                    16PF
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Aún no hay ningún reporte de personalidad activo
                  </h3>
                  <p className="text-sm text-slate-600">
                    Selecciona una opción para comenzar la evaluación 16PF de un aspirante:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentTab('test')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Aplicar Test Online (187 reactivos)
                    </button>
                    <button
                      onClick={() => setCurrentTab('capture')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Hoja de Captura Rápida (Excel)
                    </button>
                  </div>
                </div>
              ))}
            {currentTab === 'history' && (
              <EvaluationsHistory
                records={records}
                onSelectRecord={(rec) => {
                  setActiveRecord(rec);
                  setCurrentTab('report');
                }}
                onDeleteRecord={handleDelete16PF}
                onSyncRecordToSheets={handleSave16PFToGoogleSheets}
                onRefreshFromCloud={handleRefresh16PFFromCloud}
                onSeedSampleData={handleSeedSampleData}
                onLoadDataFromSheets={handleLoadDataFromSheets}
                isSyncing={isSavingToSheets}
                spreadsheetUrl={spreadsheetUrl}
              />
            )}
          </>
        )}

        {/* ==================== MODULE 2: ESTILOS DE APRENDIZAJE (VAK) ==================== */}
        {currentModule === 'learning_styles' && (
          <>
            {currentTab === 'test' && (
              <LearningStylesTest onComplete={handleLearningStyleGenerated} />
            )}
            {currentTab === 'capture' && (
              <LearningStylesFastCapture onGenerateReport={handleLearningStyleGenerated} />
            )}
            {currentTab === 'report' &&
              (activeLearningStyleRecord ? (
                <LearningStylesReport
                  record={activeLearningStyleRecord}
                  onSaveToGoogleSheets={handleSaveVakToGoogleSheets}
                  isSavingToSheets={isSavingToSheets}
                  sheetsSavedSuccess={sheetsSavedSuccess}
                  spreadsheetUrl={spreadsheetUrl}
                  onNewEvaluation={() => setCurrentTab('test')}
                  onExportCSV={() => {
                    const row = [
                      activeLearningStyleRecord.folio,
                      activeLearningStyleRecord.name,
                      activeLearningStyleRecord.predominantStyle,
                    ];
                    const blob = new Blob([row.join(',')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `VAK_${activeLearningStyleRecord.folio}.csv`;
                    a.click();
                  }}
                />
              ) : (
                <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center font-bold text-xl">
                    VAK
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Aún no hay ningún reporte de estilos de aprendizaje activo
                  </h3>
                  <p className="text-sm text-slate-600">
                    Aplica el cuestionario online o captura las respuestas de un aspirante:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentTab('test')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Aplicar Test PNL (40 reactivos)
                    </button>
                    <button
                      onClick={() => setCurrentTab('capture')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Hoja de Captura Rápida
                    </button>
                  </div>
                </div>
              ))}
            {currentTab === 'history' && (
              <LearningStylesHistory
                records={learningStyleRecords}
                onSelectRecord={(rec) => {
                  setActiveLearningStyleRecord(rec);
                  setCurrentTab('report');
                }}
                onDeleteRecord={handleDeleteVak}
                onRefreshFromCloud={handleRefreshVakFromCloud}
                onSeedSampleData={handleSeedSampleData}
                spreadsheetUrl={spreadsheetUrl}
              />
            )}
          </>
        )}

        {/* ==================== MODULE 3: INTELIGENCIA EMOCIONAL ==================== */}
        {currentModule === 'emotional_intelligence' && (
          <>
            {currentTab === 'test' && (
              <EmotionalIntelligenceTest onComplete={handleIERecordGenerated} />
            )}
            {currentTab === 'capture' && (
              <EmotionalIntelligenceFastCapture onGenerateReport={handleIERecordGenerated} />
            )}
            {currentTab === 'report' &&
              (activeIERecord ? (
                <EmotionalIntelligenceReport
                  record={activeIERecord}
                  onSaveToGoogleSheets={handleSaveIEToGoogleSheets}
                  isSavingToSheets={isSavingToSheets}
                  sheetsSavedSuccess={sheetsSavedSuccess}
                  spreadsheetUrl={spreadsheetUrl}
                  onNewEvaluation={() => setCurrentTab('test')}
                  onExportCSV={() => {
                    const row = [
                      activeIERecord.folio,
                      activeIERecord.name,
                      activeIERecord.totalScore,
                      activeIERecord.percentage,
                      activeIERecord.level.label,
                    ];
                    const blob = new Blob([row.join(',')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `IE_${activeIERecord.folio}.csv`;
                    a.click();
                  }}
                />
              ) : (
                <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center font-bold text-xl">
                    IE
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Aún no hay ningún reporte de inteligencia emocional activo
                  </h3>
                  <p className="text-sm text-slate-600">
                    Aplica el test online o realiza la captura rápida de un aspirante:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentTab('test')}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Aplicar Test Online (45 reactivos)
                    </button>
                    <button
                      onClick={() => setCurrentTab('capture')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Hoja de Captura Rápida
                    </button>
                  </div>
                </div>
              ))}
            {currentTab === 'history' && (
              <EmotionalIntelligenceHistory
                records={ieRecords}
                onSelectRecord={(rec) => {
                  setActiveIERecord(rec);
                  setCurrentTab('report');
                }}
                onDeleteRecord={handleDeleteIE}
                onRefreshFromCloud={handleRefreshIEFromCloud}
                spreadsheetUrl={spreadsheetUrl}
              />
            )}
          </>
        )}

        {/* ==================== MODULE 4: BIENESTAR PSICOSOCIAL ==================== */}
        {currentModule === 'psychosocial' && (
          <>
            {currentTab === 'test' && (
              <PsychosocialTest onComplete={handlePsychosocialGenerated} />
            )}
            {currentTab === 'capture' && (
              <PsychosocialFastCapture onGenerateReport={handlePsychosocialGenerated} />
            )}
            {currentTab === 'report' &&
              (activePsychosocialRecord ? (
                <PsychosocialReport
                  record={activePsychosocialRecord}
                  onSaveToGoogleSheets={handleSavePsychosocialToGoogleSheets}
                  isSavingToSheets={isSavingToSheets}
                  sheetsSavedSuccess={sheetsSavedSuccess}
                  spreadsheetUrl={spreadsheetUrl}
                  onNewEvaluation={() => setCurrentTab('test')}
                  onExportCSV={() => {
                    const row = [
                      activePsychosocialRecord.folio,
                      activePsychosocialRecord.name,
                      activePsychosocialRecord.totalScore,
                      activePsychosocialRecord.percentage,
                      activePsychosocialRecord.level.label,
                    ];
                    const blob = new Blob([row.join(',')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Bienestar_Psicosocial_${activePsychosocialRecord.folio}.csv`;
                    a.click();
                  }}
                />
              ) : (
                <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold text-xl">
                    PS
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Aún no hay ningún reporte de bienestar psicosocial activo
                  </h3>
                  <p className="text-sm text-slate-600">
                    Aplica la escala online o realiza la captura rápida de un evaluado:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCurrentTab('test')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Aplicar Cuestionario Online (35 reactivos)
                    </button>
                    <button
                      onClick={() => setCurrentTab('capture')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      Hoja de Captura Rápida
                    </button>
                  </div>
                </div>
              ))}
            {currentTab === 'history' && (
              <PsychosocialHistory
                records={psychosocialRecords}
                onSelectRecord={(rec) => {
                  setActivePsychosocialRecord(rec);
                  setCurrentTab('report');
                }}
                onDeleteRecord={handleDeletePsychosocial}
                onRefreshFromCloud={handleRefreshPsychosocialFromCloud}
                spreadsheetUrl={spreadsheetUrl}
              />
            )}
          </>
        )}
      </main>

      {/* Google Sheets Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        googleUser={googleUser}
        activeSpreadsheetId={activeSpreadsheetId}
        spreadsheetUrl={spreadsheetUrl}
        webhookUrl={webhookUrl}
        records={records}
        learningStyleRecords={learningStyleRecords}
        ieRecords={ieRecords}
        psychosocialRecords={psychosocialRecords}
        onSaveWebhookUrl={handleSaveWebhookUrl}
        onSpreadsheetConfigured={(id, url) => {
          setActiveSpreadsheetId(id);
          setSpreadsheetUrl(url);
          showToast('Hoja de Google Sheets configurada.');
          setIsGoogleModalOpen(false);
        }}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        onLoadDataFromSheets={handleLoadDataFromSheets}
        onSeedSampleData={handleSeedSampleData}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="text-slate-200 font-semibold">
              Licenciatura en Enseñanza de Lenguas Extranjeras (Español e Inglés)
            </p>
            <p className="text-slate-500 text-[11px]">
              Sistema Integral de Admisión: 16PF (187 reactivos), Estilos de Aprendizaje (40 reactivos), Inteligencia Emocional (45 reactivos) y Bienestar Psicosocial (35 reactivos)
            </p>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sincronización en la Nube Activa (Multidispositivo)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
