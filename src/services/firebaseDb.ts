import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { EvaluationRecord } from './googleSheets';
import { LearningStyleRecord } from '../data/learningStylesData';
import { EmotionalIntelligenceRecord } from '../data/emotionalIntelligenceData';
import { PsychosocialRecord } from '../data/psychosocialData';

// Initialize Firebase App & Firestore
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const EVALUATIONS_COLLECTION = 'evaluations';
const LEARNING_STYLES_COLLECTION = 'learning_styles_evaluations';
const EMOTIONAL_INTELLIGENCE_COLLECTION = 'emotional_intelligence_evaluations';
const PSYCHOSOCIAL_COLLECTION = 'psychosocial_wellness_evaluations';

/**
 * Test connection to Firestore
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firestore offline o configurando conexión...');
      return false;
    }
    return true;
  }
}

/**
 * Save evaluation record to Firestore cloud database
 */
export async function saveEvaluationToCloud(record: EvaluationRecord): Promise<void> {
  try {
    const docRef = doc(db, EVALUATIONS_COLLECTION, record.id);
    await setDoc(docRef, {
      ...record,
      cloudSavedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error guardando en Firestore en la nube:', error);
    throw error;
  }
}

/**
 * Save Learning Style evaluation to Firestore cloud database
 */
export async function saveLearningStyleToCloud(record: LearningStyleRecord): Promise<void> {
  try {
    const docRef = doc(db, LEARNING_STYLES_COLLECTION, record.id);
    await setDoc(docRef, {
      ...record,
      cloudSavedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error guardando Estilos de Aprendizaje en Firestore:', error);
    throw error;
  }
}

/**
 * Save Emotional Intelligence evaluation to Firestore
 */
export async function saveEmotionalIntelligenceToCloud(
  record: EmotionalIntelligenceRecord
): Promise<void> {
  try {
    const docRef = doc(db, EMOTIONAL_INTELLIGENCE_COLLECTION, record.id);
    await setDoc(docRef, {
      ...record,
      cloudSavedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error guardando Inteligencia Emocional en Firestore:', error);
    throw error;
  }
}

/**
 * Save Psychosocial Wellness evaluation to Firestore
 */
export async function savePsychosocialToCloud(
  record: PsychosocialRecord
): Promise<void> {
  try {
    const docRef = doc(db, PSYCHOSOCIAL_COLLECTION, record.id);
    await setDoc(docRef, {
      ...record,
      cloudSavedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error guardando Bienestar Psicosocial en Firestore:', error);
    throw error;
  }
}

/**
 * Real-time listener for 16PF
 */
export function subscribeToEvaluations(
  onUpdate: (records: EvaluationRecord[]) => void,
  onError?: (error: any) => void
) {
  try {
    const colRef = collection(db, EVALUATIONS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const cloudRecords: EvaluationRecord[] = [];
        snapshot.forEach((docSnap) => {
          cloudRecords.push(docSnap.data() as EvaluationRecord);
        });
        cloudRecords.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        onUpdate(cloudRecords);
      },
      (error) => {
        console.warn('Firestore snapshot error (16PF):', error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn('Error suscribiendo a evaluaciones 16PF:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Real-time listener for Learning Styles
 */
export function subscribeToLearningStyles(
  onUpdate: (records: LearningStyleRecord[]) => void,
  onError?: (error: any) => void
) {
  try {
    const colRef = collection(db, LEARNING_STYLES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const cloudRecords: LearningStyleRecord[] = [];
        snapshot.forEach((docSnap) => {
          cloudRecords.push(docSnap.data() as LearningStyleRecord);
        });
        cloudRecords.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        onUpdate(cloudRecords);
      },
      (error) => {
        console.warn('Firestore snapshot error (VAK):', error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn('Error suscribiendo a VAK:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Real-time listener for Emotional Intelligence
 */
export function subscribeToEmotionalIntelligence(
  onUpdate: (records: EmotionalIntelligenceRecord[]) => void,
  onError?: (error: any) => void
) {
  try {
    const colRef = collection(db, EMOTIONAL_INTELLIGENCE_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const cloudRecords: EmotionalIntelligenceRecord[] = [];
        snapshot.forEach((docSnap) => {
          cloudRecords.push(docSnap.data() as EmotionalIntelligenceRecord);
        });
        cloudRecords.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        onUpdate(cloudRecords);
      },
      (error) => {
        console.warn('Firestore snapshot error (IE):', error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn('Error suscribiendo a IE:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Real-time listener for Psychosocial Wellness
 */
export function subscribeToPsychosocial(
  onUpdate: (records: PsychosocialRecord[]) => void,
  onError?: (error: any) => void
) {
  try {
    const colRef = collection(db, PSYCHOSOCIAL_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const cloudRecords: PsychosocialRecord[] = [];
        snapshot.forEach((docSnap) => {
          cloudRecords.push(docSnap.data() as PsychosocialRecord);
        });
        cloudRecords.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        onUpdate(cloudRecords);
      },
      (error) => {
        console.warn('Firestore snapshot error (PSICO):', error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn('Error suscribiendo a PSICO:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetch all evaluations from cloud once
 */
export async function fetchEvaluationsFromCloud(): Promise<EvaluationRecord[]> {
  try {
    const colRef = collection(db, EVALUATIONS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list: EvaluationRecord[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as EvaluationRecord);
    });
    list.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return list;
  } catch (err) {
    console.warn('Error al consultar evaluaciones de Firestore:', err);
    return [];
  }
}

export async function fetchLearningStylesFromCloud(): Promise<LearningStyleRecord[]> {
  try {
    const colRef = collection(db, LEARNING_STYLES_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list: LearningStyleRecord[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as LearningStyleRecord);
    });
    list.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return list;
  } catch (err) {
    console.warn('Error al consultar Estilos de Aprendizaje de Firestore:', err);
    return [];
  }
}

export async function fetchEmotionalIntelligenceFromCloud(): Promise<EmotionalIntelligenceRecord[]> {
  try {
    const colRef = collection(db, EMOTIONAL_INTELLIGENCE_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list: EmotionalIntelligenceRecord[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as EmotionalIntelligenceRecord);
    });
    list.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return list;
  } catch (err) {
    console.warn('Error al consultar Inteligencia Emocional de Firestore:', err);
    return [];
  }
}

export async function fetchPsychosocialFromCloud(): Promise<PsychosocialRecord[]> {
  try {
    const colRef = collection(db, PSYCHOSOCIAL_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list: PsychosocialRecord[] = [];
    snapshot.forEach((d) => {
      list.push(d.data() as PsychosocialRecord);
    });
    list.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return list;
  } catch (err) {
    console.warn('Error al consultar Bienestar Psicosocial de Firestore:', err);
    return [];
  }
}

export async function deleteEvaluationFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, EVALUATIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error eliminando de Firestore:', err);
    throw err;
  }
}

export async function deleteLearningStyleFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, LEARNING_STYLES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error eliminando Estilo de Aprendizaje de Firestore:', err);
    throw err;
  }
}

export async function deleteEmotionalIntelligenceFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, EMOTIONAL_INTELLIGENCE_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error eliminando Inteligencia Emocional de Firestore:', err);
    throw err;
  }
}

export async function deletePsychosocialFromCloud(id: string): Promise<void> {
  try {
    const docRef = doc(db, PSYCHOSOCIAL_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error eliminando Bienestar Psicosocial de Firestore:', err);
    throw err;
  }
}

export async function saveCloudSetting(key: string, value: any): Promise<void> {
  try {
    const docRef = doc(db, 'app_settings', key);
    await setDoc(docRef, { value, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Error guardando configuración en nube:', err);
  }
}

export async function getCloudSetting<T>(key: string): Promise<T | null> {
  try {
    const docRef = doc(db, 'app_settings', key);
    const snap = await getDocFromServer(docRef).catch(() => null);
    if (snap && snap.exists()) {
      return (snap.data()?.value as T) ?? null;
    }
    return null;
  } catch (err) {
    return null;
  }
}
