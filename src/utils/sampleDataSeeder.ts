import { calculate16PFScores, generateSampleAnswers } from './scoreCalculator';
import {
  calculateLearningStyleScores,
  generateSampleLearningStyleAnswers,
  LearningStyleRecord,
} from '../data/learningStylesData';
import {
  calculateEmotionalIntelligenceScores,
  generateSampleIEAnswers,
  EmotionalIntelligenceRecord,
} from '../data/emotionalIntelligenceData';
import {
  calculatePsychosocialScores,
  generateSamplePsychosocialAnswers,
  PsychosocialRecord,
} from '../data/psychosocialData';
import { EvaluationRecord } from '../services/googleSheets';

export function createSample16PFRecords(): EvaluationRecord[] {
  const ans1 = generateSampleAnswers('ideal');
  const rec1 = calculate16PFScores(ans1, {
    name: 'Mariana Lizárraga Gómez',
    folio: 'LELE-ADM-2026-001',
    gender: 'F',
    age: 20,
    emphasis: 'Bilingüe: Español e Inglés',
  });

  const ans2 = generateSampleAnswers('equilibrado');
  const rec2 = calculate16PFScores(ans2, {
    name: 'Rodrigo Silva Valenzuela',
    folio: 'LELE-ADM-2026-002',
    gender: 'M',
    age: 22,
    emphasis: 'Énfasis en Lengua Inglesa',
  });

  const ans3 = generateSampleAnswers('reservado');
  const rec3 = calculate16PFScores(ans3, {
    name: 'Sofía Mendoza Alvarado',
    folio: 'LELE-ADM-2026-003',
    gender: 'F',
    age: 21,
    emphasis: 'Énfasis en Lengua Española',
  });

  return [rec1, rec2, rec3];
}

export function createSampleVAKRecords(): LearningStyleRecord[] {
  const ansVak1 = generateSampleLearningStyleAnswers('visual');
  const recVak1 = calculateLearningStyleScores(ansVak1, {
    name: 'Mariana Lizárraga Gómez',
    folio: 'LELE-VAK-2026-001',
    gender: 'F',
    age: 20,
    emphasis: 'Bilingüe: Español e Inglés',
  });

  const ansVak2 = generateSampleLearningStyleAnswers('auditivo');
  const recVak2 = calculateLearningStyleScores(ansVak2, {
    name: 'Rodrigo Silva Valenzuela',
    folio: 'LELE-VAK-2026-002',
    gender: 'M',
    age: 22,
    emphasis: 'Énfasis en Lengua Inglesa',
  });

  return [recVak1, recVak2];
}

export function createSampleIERecords(): EmotionalIntelligenceRecord[] {
  const ansIE1 = generateSampleIEAnswers('medio_alto');
  const recIE1 = calculateEmotionalIntelligenceScores(ansIE1, {
    name: 'Mariana Lizárraga Gómez',
    folio: 'LELE-IE-2026-001',
    gender: 'F',
    age: 20,
    emphasis: 'Bilingüe: Español e Inglés',
  });

  const ansIE2 = generateSampleIEAnswers('medio_bajo');
  const recIE2 = calculateEmotionalIntelligenceScores(ansIE2, {
    name: 'Rodrigo Silva Valenzuela',
    folio: 'LELE-IE-2026-002',
    gender: 'M',
    age: 22,
    emphasis: 'Énfasis en Lengua Inglesa',
  });

  return [recIE1, recIE2];
}

export function createSamplePsicoRecords(): PsychosocialRecord[] {
  const ansP1 = generateSamplePsychosocialAnswers();
  const recP1 = calculatePsychosocialScores(ansP1, {
    name: 'Mariana Lizárraga Gómez',
    folio: 'LELE-PSICO-2026-001',
    gender: 'F',
    age: 20,
    emphasis: 'Bilingüe: Español e Inglés',
  });

  const ansP2 = generateSamplePsychosocialAnswers();
  const recP2 = calculatePsychosocialScores(ansP2, {
    name: 'Rodrigo Silva Valenzuela',
    folio: 'LELE-PSICO-2026-002',
    gender: 'M',
    age: 22,
    emphasis: 'Énfasis en Lengua Inglesa',
  });

  return [recP1, recP2];
}
