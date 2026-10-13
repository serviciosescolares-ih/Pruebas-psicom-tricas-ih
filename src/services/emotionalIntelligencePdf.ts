import jsPDF from 'jspdf';
import {
  EmotionalIntelligenceRecord,
  IE_DIMENSIONS,
  IE_QUESTIONS,
} from '../data/emotionalIntelligenceData';

export async function generateEmotionalIntelligencePdf(record: EmotionalIntelligenceRecord) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const cobalt = [0, 71, 171];
  const darkNavy = [15, 23, 42];
  const slateText = [71, 85, 105];
  const borderLight = [226, 232, 240];

  let levelColor = [37, 99, 235];
  if (record.level.code === 'MUY_ALTO') levelColor = [5, 150, 105];
  else if (record.level.code === 'MEDIO_ALTO') levelColor = [37, 99, 235];
  else if (record.level.code === 'MEDIO_BAJO') levelColor = [217, 119, 6];
  else levelColor = [225, 29, 72];

  // Top Banner
  doc.setFillColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('LICENCIATURA EN ENSEÑANZA DE LENGUAS EXTRANJERAS (ESPAÑOL E INGLÉS)', margin, 9);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('EVALUACIÓN PSICOEDUCATIVA – TEST DE INTELIGENCIA EMOCIONAL (45 REACTIVOS)', margin, 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`FOLIO: ${record.folio}`, pageWidth - margin, 16, { align: 'right' });

  // Candidate Data Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, 28, contentWidth, 20, 2, 2, 'FD');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Aspirante:', margin + 4, 34);
  doc.setFont('helvetica', 'normal');
  doc.text(record.name, margin + 22, 34);
  doc.setFont('helvetica', 'bold');
  doc.text('Sexo:', margin + 4, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(record.gender === 'M' ? 'Hombre' : 'Mujer', margin + 22, 40);
  doc.setFont('helvetica', 'bold');
  doc.text('Edad:', margin + 50, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.age} años`, margin + 61, 40);
  doc.setFont('helvetica', 'bold');
  doc.text('Énfasis:', margin + 85, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(record.emphasis || 'Español e Inglés', margin + 100, 40);
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha:', margin + 135, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(record.timestamp).toLocaleDateString('es-MX'), margin + 147, 40);

  // Section 1: Global Score & Verdict Card
  let yPos = 52;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, yPos, contentWidth, 44, 2, 2, 'FD');

  doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
  doc.roundedRect(margin + 4, yPos + 4, 46, 36, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PUNTUACIÓN GLOBAL', margin + 27, yPos + 10, { align: 'center' });
  doc.setFontSize(22);
  doc.text(`${record.totalScore}`, margin + 27, yPos + 22, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('de 90 puntos (' + record.percentage + '%)', margin + 27, yPos + 29, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(record.level.label.toUpperCase(), margin + 27, yPos + 36, { align: 'center' });

  const textStartX = margin + 54;
  const textWidth = contentWidth - 58;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`DIAGNÓSTICO OFICIAL: NIVEL ${record.level.label.toUpperCase()}`, textStartX, yPos + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  const splitDesc = doc.splitTextToSize(record.level.officialDescription, textWidth);
  doc.text(splitDesc, textStartX, yPos + 15);

  const barY = yPos + 38;
  doc.setFillColor(226, 232, 240);
  doc.rect(textStartX, barY, textWidth, 2.5, 'F');
  doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
  doc.rect(textStartX, barY, (textWidth * record.percentage) / 100, 2.5, 'F');

  // Section 2: 5 Dimensions Breakdown
  yPos += 50;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DESGLOSE DE COMPETENCIAS DE INTELIGENCIA EMOCIONAL', margin, yPos);
  yPos += 5;

  const dimsList = [
    { key: 'autoconocimiento', data: record.dimensions.autoconocimiento, meta: IE_DIMENSIONS.autoconocimiento },
    { key: 'autocontrol', data: record.dimensions.autocontrol, meta: IE_DIMENSIONS.autocontrol },
    { key: 'automotivacion', data: record.dimensions.automotivacion, meta: IE_DIMENSIONS.automotivacion },
    { key: 'empatia', data: record.dimensions.empatia, meta: IE_DIMENSIONS.empatia },
    { key: 'habilidades_sociales', data: record.dimensions.habilidades_sociales, meta: IE_DIMENSIONS.habilidades_sociales },
  ];

  dimsList.forEach((dim) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.roundedRect(margin, yPos, contentWidth, 13.5, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
    doc.text(dim.meta.name, margin + 4, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(dim.meta.description, margin + 4, yPos + 9.5, { maxWidth: contentWidth - 48 });

    const rightBoxX = margin + contentWidth - 42;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(`${dim.data.score}/${dim.data.maxScore} pts (${dim.data.percentage}%)`, rightBoxX + 20, yPos + 5, { align: 'center' });

    doc.setFillColor(226, 232, 240);
    doc.rect(rightBoxX, yPos + 7.5, 40, 2.5, 'F');
    doc.setFillColor(cobalt[0], cobalt[1], cobalt[2]);
    doc.rect(rightBoxX, yPos + 7.5, (40 * dim.data.percentage) / 100, 2.5, 'F');
    yPos += 15.5;
  });

  // Section 3: Implications for Language Teaching
  yPos += 3;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('2. ANÁLISIS VOCACIONAL PARA LA ENSEÑANZA DE LENGUAS EXTRANJERAS', margin, yPos);
  yPos += 4;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.text('Implicación Pedagógica en el Aula de Inglés y Español:', margin + 4, yPos + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const splitTeach = doc.splitTextToSize(record.level.languageTeacherImplication, contentWidth - 8);
  doc.text(splitTeach, margin + 4, yPos + 11);

  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Página 1 de 2 – Test de Inteligencia Emocional – Licenciatura en Enseñanza de Lenguas Extranjeras', margin, pageHeight - 6);
  doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, pageWidth - margin, pageHeight - 6, { align: 'right' });

  // --- PAGE 2: TABLA DETALLADA DE RESPUESTAS (45 REACTIVOS) Y FIRMAS ---
  doc.addPage();
  doc.setFillColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.rect(0, 0, pageWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('HOJA DE REGISTRO DETALLADO DE RESPUESTAS (TEST DE INTELIGENCIA EMOCIONAL)', margin, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ASPIRANTE: ${record.name} – FOLIO: ${record.folio}`, pageWidth - margin, 10, { align: 'right' });

  yPos = 23;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('RESPUESTAS A LOS 45 REACTIVOS DEL COMPORTAMIENTO HABITUAL:', margin, yPos);
  yPos += 4;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Escala de valoración: NUNCA = 0 puntos | ALGUNAS VECES = 1 punto | SIEMPRE = 2 puntos', margin, yPos);

  yPos += 5;
  const tableColWidth = (contentWidth - 6) / 2;
  const rowH = 6.8;

  for (let col = 0; col < 2; col++) {
    const startQ = col === 0 ? 1 : 24;
    const endQ = col === 0 ? 23 : 45;
    const startX = margin + col * (tableColWidth + 6);

    doc.setFillColor(cobalt[0], cobalt[1], cobalt[2]);
    doc.rect(startX, yPos, tableColWidth, rowH, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('N°', startX + 2.5, yPos + 4.5);
    doc.text('Comportamiento', startX + 9, yPos + 4.5);
    doc.text('N (0)', startX + tableColWidth - 27, yPos + 4.5, { align: 'center' });
    doc.text('A (1)', startX + tableColWidth - 17, yPos + 4.5, { align: 'center' });
    doc.text('S (2)', startX + tableColWidth - 7, yPos + 4.5, { align: 'center' });

    for (let i = startQ; i <= endQ; i++) {
      const currentY = yPos + (i - startQ + 1) * rowH;
      const isEven = (i - startQ) % 2 === 0;
      const ans = record.answers[i];
      const q = IE_QUESTIONS.find((item) => item.id === i);
      const textTrunc = (q?.text || `Reactivo ${i}`).substring(0, 42);

      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(startX, currentY, tableColWidth, rowH, 'F');
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.rect(startX, currentY, tableColWidth, rowH, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text(String(i), startX + 2.5, currentY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.text(textTrunc + (q && q.text.length > 42 ? '...' : ''), startX + 9, currentY + 4.5);

      if (ans === 'nunca') {
        doc.setFillColor(225, 29, 72);
        doc.circle(startX + tableColWidth - 27, currentY + 3.4, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.text('0', startX + tableColWidth - 27, currentY + 4.5, { align: 'center' });
      }

      if (ans === 'algunas_veces') {
        doc.setFillColor(217, 119, 6);
        doc.circle(startX + tableColWidth - 17, currentY + 3.4, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.text('1', startX + tableColWidth - 17, currentY + 4.5, { align: 'center' });
      }

      if (ans === 'siempre') {
        doc.setFillColor(5, 150, 105);
        doc.circle(startX + tableColWidth - 7, currentY + 3.4, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.5);
        doc.text('2', startX + tableColWidth - 7, currentY + 4.5, { align: 'center' });
      }
    }
  }

  const summaryY = yPos + 24 * rowH + 4;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, summaryY, contentWidth, 13, 2, 2, 'FD');

  let countNunca = 0;
  let countAlgunas = 0;
  let countSiempre = 0;
  for (let i = 1; i <= 45; i++) {
    if (record.answers[i] === 'nunca') countNunca++;
    else if (record.answers[i] === 'algunas_veces') countAlgunas++;
    else if (record.answers[i] === 'siempre') countSiempre++;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('TOTALES DE RESPUESTAS:', margin + 4, summaryY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`NUNCA (0): ${countNunca} reactivos`, margin + 48, summaryY + 5);
  doc.text(`ALGUNAS VECES (1): ${countAlgunas} reactivos`, margin + 90, summaryY + 5);
  doc.text(`SIEMPRE (2): ${countSiempre} reactivos`, margin + 142, summaryY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.text(`PUNTUACIÓN TOTAL: ${record.totalScore} DE 90 PUNTOS (${record.percentage}%)`, margin + 4, summaryY + 10);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`DICTAMEN: ${record.level.label.toUpperCase()}`, margin + 90, summaryY + 10);

  // Signatures
  const sigY = summaryY + 24;
  const sigW = 60;
  doc.setDrawColor(150, 150, 150);
  doc.line(margin + 10, sigY, margin + 10 + sigW, sigY);
  doc.line(pageWidth - margin - 10 - sigW, sigY, pageWidth - margin - 10, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('ORIENTADOR(A) PSICOPEDAGÓGICO(A)', margin + 10 + sigW / 2, sigY + 4, { align: 'center' });
  doc.text('COORDINACIÓN ACADÉMICA DE LENGUAS', pageWidth - margin - 10 - sigW / 2, sigY + 4, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Firma y Cédula Profesional', margin + 10 + sigW / 2, sigY + 7.5, { align: 'center' });
  doc.text('Licenciatura en Enseñanza de Lenguas Extranjeras', pageWidth - margin - 10 - sigW / 2, sigY + 7.5, { align: 'center' });

  doc.setFontSize(6.5);
  doc.text('Página 2 de 2 – Documento Oficial de Admisión y Diagnóstico Psicopedagógico', margin, pageHeight - 6);
  doc.text(`ID Registro: ${record.id}`, pageWidth - margin, pageHeight - 6, { align: 'right' });

  const cleanName = (record.name || 'Aspirante').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Inteligencia_Emocional_${cleanName}_${record.folio}.pdf`);
}
