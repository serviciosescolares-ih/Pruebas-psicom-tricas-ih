import jsPDF from 'jspdf';
import {
  PsychosocialRecord,
  PSYCHOSOCIAL_DIMENSIONS,
  PSYCHOSOCIAL_QUESTIONS,
  PsychosocialDimensionKey,
} from '../data/psychosocialData';

export async function generatePsychosocialPdf(record: PsychosocialRecord) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const emeraldTheme = [16, 120, 90];
  const darkNavy = [15, 23, 42];
  const slateText = [71, 85, 105];
  const borderLight = [226, 232, 240];

  let riskColor = [16, 185, 129];
  if (record.level.code === 'NULO') riskColor = [16, 185, 129];
  else if (record.level.code === 'BAJO') riskColor = [20, 184, 166];
  else if (record.level.code === 'MEDIO') riskColor = [245, 158, 11];
  else if (record.level.code === 'ALTO') riskColor = [249, 115, 22];
  else riskColor = [239, 68, 68];

  // Top Banner
  doc.setFillColor(emeraldTheme[0], emeraldTheme[1], emeraldTheme[2]);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('LICENCIATURA EN ENSEÑANZA DE LENGUAS EXTRANJERAS (ESPAÑOL E INGLÉS)', margin, 9);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('EVALUACIÓN DE CLIMA Y BIENESTAR PSICOSOCIAL – ESCALA LIKERT (0 - 4)', margin, 16);
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
  doc.roundedRect(margin, yPos, contentWidth, 42, 2, 2, 'FD');

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.roundedRect(margin + 4, yPos + 4, 46, 34, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('ÍNDICE GLOBAL DE RIESGO', margin + 27, yPos + 9, { align: 'center' });
  doc.setFontSize(20);
  doc.text(`${record.totalScore}`, margin + 27, yPos + 20, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`de ${record.maxPossibleScore} pts (${record.percentage}%)`, margin + 27, yPos + 26, { align: 'center' });
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.text(record.level.label.toUpperCase(), margin + 27, yPos + 32, { align: 'center' });

  const textStartX = margin + 54;
  const textWidth = contentWidth - 58;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`ESTADO: ${record.level.friendlyTitle.toUpperCase()}`, textStartX, yPos + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  const splitDesc = doc.splitTextToSize(record.level.officialDescription, textWidth);
  doc.text(splitDesc, textStartX, yPos + 15);

  const barY = yPos + 36;
  doc.setFillColor(226, 232, 240);
  doc.rect(textStartX, barY, textWidth, 2.5, 'F');
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(textStartX, barY, (textWidth * record.percentage) / 100, 2.5, 'F');

  // Section 2: 5 Dimensions Breakdown
  yPos += 48;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('1. EVALUACIÓN POR DIMENSIONES DEL ENTORNO PSICOSOCIAL', margin, yPos);
  yPos += 5;

  const dimKeys: PsychosocialDimensionKey[] = [
    'ambiente_entorno',
    'carga_ritmo',
    'control_autonomia',
    'liderazgo_relaciones',
    'balance_desgaste',
  ];

  dimKeys.forEach((key) => {
    const dimData = record.dimensions[key];
    const dimMeta = PSYCHOSOCIAL_DIMENSIONS[key];
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.roundedRect(margin, yPos, contentWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(emeraldTheme[0], emeraldTheme[1], emeraldTheme[2]);
    doc.text(dimMeta.name, margin + 4, yPos + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(dimMeta.description, margin + 4, yPos + 9.5, { maxWidth: contentWidth - 52 });

    const rightBoxX = margin + contentWidth - 46;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(`${dimData.score}/${dimData.maxScore} pts (${dimData.percentage}%)`, rightBoxX + 22, yPos + 5, { align: 'center' });

    doc.setFillColor(226, 232, 240);
    doc.rect(rightBoxX, yPos + 7.5, 44, 2.5, 'F');

    let dimBarColor = [16, 185, 129];
    if (dimData.percentage > 60) dimBarColor = [239, 68, 68];
    else if (dimData.percentage > 40) dimBarColor = [245, 158, 11];
    else if (dimData.percentage > 20) dimBarColor = [20, 184, 166];

    doc.setFillColor(dimBarColor[0], dimBarColor[1], dimBarColor[2]);
    doc.rect(rightBoxX, yPos + 7.5, (44 * dimData.percentage) / 100, 2.5, 'F');
    doc.setFontSize(6.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(dimBarColor[0], dimBarColor[1], dimBarColor[2]);
    doc.text(dimData.riskLevel, rightBoxX + 22, yPos + 12.5, { align: 'center' });
    yPos += 16;
  });

  // Section 3: Implications for Foreign Language Teachers
  yPos += 2;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2. IMPLICACIONES PEDAGÓGICAS PARA DOCENTES DE LENGUAS EXTRANJERAS', margin, yPos);
  yPos += 4;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, yPos, contentWidth, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(emeraldTheme[0], emeraldTheme[1], emeraldTheme[2]);
  doc.text('Salud Ocupacional y Dinámica Comunicativa en el Aula:', margin + 4, yPos + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const splitTeach = doc.splitTextToSize(record.level.teachingImplication, contentWidth - 8);
  doc.text(splitTeach, margin + 4, yPos + 10.5);

  // Recommendations
  yPos += 24;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('3. RECOMENDACIONES PREVENTIVAS Y DE AUTOCUIDADO', margin, yPos);
  yPos += 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, yPos, contentWidth, 23, 2, 2, 'FD');
  record.level.recommendations.forEach((rec, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(emeraldTheme[0], emeraldTheme[1], emeraldTheme[2]);
    doc.text(`•`, margin + 4, yPos + 5.5 + idx * 5.8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(rec, margin + 8, yPos + 5.5 + idx * 5.8, { maxWidth: contentWidth - 14 });
  });

  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Página 1 de 2 – Escala de Bienestar Psicosocial – Licenciatura en Enseñanza de Lenguas Extranjeras', margin, pageHeight - 6);
  doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, pageWidth - margin, pageHeight - 6, { align: 'right' });

  // --- PAGE 2: TABLA DE RESPUESTAS (35 REACTIVOS, ESCALA 0 A 4) Y VALIDACIÓN ---
  doc.addPage();
  doc.setFillColor(emeraldTheme[0], emeraldTheme[1], emeraldTheme[2]);
  doc.rect(0, 0, pageWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('MATRIZ DETALLADA DE RESPUESTAS (ESCALA LIKERT 0 AL 4)', margin, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ASPIRANTE: ${record.name} – FOLIO: ${record.folio}`, pageWidth - margin, 10, { align: 'right' });

  yPos = 22;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('REGISTRO DE RESPUESTAS A LOS 35 REACTIVOS PSICOSOCIALES:', margin, yPos);
  yPos += 4;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Escala Likert: 0 = Nunca | 1 = Casi nunca | 2 = Algunas veces | 3 = Casi siempre | 4 = Siempre', margin, yPos);

  yPos += 5;
  const tableColWidth = (contentWidth - 6) / 2;
  const rowH = 7.5;

  for (let col = 0; col < 2; col++) {
    const startQ = col === 0 ? 1 : 19;
    const endQ = col === 0 ? 18 : 35;
    const startX = margin + col * (tableColWidth + 6);

    doc.setFillColor(emeraldTheme[0], emeraldTheme[1], emeraldTheme[2]);
    doc.rect(startX, yPos, tableColWidth, rowH, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('N°', startX + 2.5, yPos + 4.8);
    doc.text('Reactivo Psicosocial', startX + 8, yPos + 4.8);
    doc.text('0', startX + tableColWidth - 32, yPos + 4.8, { align: 'center' });
    doc.text('1', startX + tableColWidth - 24, yPos + 4.8, { align: 'center' });
    doc.text('2', startX + tableColWidth - 16, yPos + 4.8, { align: 'center' });
    doc.text('3', startX + tableColWidth - 9, yPos + 4.8, { align: 'center' });
    doc.text('4', startX + tableColWidth - 2.5, yPos + 4.8, { align: 'center' });

    for (let i = startQ; i <= endQ; i++) {
      const currentY = yPos + (i - startQ + 1) * rowH;
      const isEven = (i - startQ) % 2 === 0;
      const ans = record.answers[i] ?? 0;
      const q = PSYCHOSOCIAL_QUESTIONS.find((item) => item.id === i);
      const textTrunc = (q?.text || `Reactivo ${i}`).substring(0, 36);

      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(startX, currentY, tableColWidth, rowH, 'F');
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.rect(startX, currentY, tableColWidth, rowH, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text(String(i), startX + 2.5, currentY + 4.8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.2);
      doc.text(textTrunc + (q && q.text.length > 36 ? '...' : ''), startX + 8, currentY + 4.8);

      const optOffsets = [
        tableColWidth - 32,
        tableColWidth - 24,
        tableColWidth - 16,
        tableColWidth - 9,
        tableColWidth - 2.5,
      ];

      for (let optVal = 0; optVal <= 4; optVal++) {
        const posX = startX + optOffsets[optVal];
        if (ans === optVal) {
          let optColor = [16, 185, 129];
          if (optVal >= 3) optColor = [239, 68, 68];
          else if (optVal === 2) optColor = [245, 158, 11];

          doc.setFillColor(optColor[0], optColor[1], optColor[2]);
          doc.circle(posX, currentY + 3.8, 1.8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(5.2);
          doc.text(String(optVal), posX, currentY + 4.8, { align: 'center' });
        }
      }
    }
  }

  const tableBottomY = yPos + 19 * rowH + 6;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('RESUMEN CUANTITATIVO POR FACTORES PSICOSOCIALES:', margin, tableBottomY);

  const dimBoxW = contentWidth / 5;
  dimKeys.forEach((key, idx) => {
    const boxX = margin + idx * dimBoxW;
    const dim = record.dimensions[key];
    const meta = PSYCHOSOCIAL_DIMENSIONS[key];

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.roundedRect(boxX, tableBottomY + 3, dimBoxW - 2, 18, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(emeraldTheme[0], emeraldTheme[1], emeraldTheme[2]);
    doc.text(meta.shortName, boxX + (dimBoxW - 2) / 2, tableBottomY + 7, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(`${dim.score}/28`, boxX + (dimBoxW - 2) / 2, tableBottomY + 12.5, { align: 'center' });
    doc.setFontSize(5.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`${dim.percentage}% – ${dim.riskLevel.split('/')[0]}`, boxX + (dimBoxW - 2) / 2, tableBottomY + 17, { align: 'center' });
  });

  // Signatures
  const sigY = tableBottomY + 26;
  const sigWidth = 72;
  doc.setDrawColor(slateText[0], slateText[1], slateText[2]);
  doc.line(margin + 12, sigY + 12, margin + 12 + sigWidth, sigY + 12);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('COORDINACIÓN DE ADMISIÓN Y TUTORÍA', margin + 12 + sigWidth / 2, sigY + 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Licenciatura en Enseñanza de Lenguas Extranjeras', margin + 12 + sigWidth / 2, sigY + 20, { align: 'center' });

  const candSigX = pageWidth - margin - sigWidth - 12;
  doc.line(candSigX, sigY + 12, candSigX + sigWidth, sigY + 12);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('FIRMA DEL ASPIRANTE / EVALUADO', candSigX + sigWidth / 2, sigY + 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text(`${record.name} – Folio: ${record.folio}`, candSigX + sigWidth / 2, sigY + 20, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Página 2 de 2 – Matriz de Calificación – Documento Confidencial de Diagnóstico Psicoeducativo', margin, pageHeight - 6);
  doc.text(`ID Registro: ${record.id}`, pageWidth - margin, pageHeight - 6, { align: 'right' });

  const safeName = record.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Bienestar_Psicosocial_${record.folio}_${safeName}.pdf`);
}
