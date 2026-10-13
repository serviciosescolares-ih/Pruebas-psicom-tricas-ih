import jsPDF from 'jspdf';
import { LearningStyleRecord, CHANNELS_DATA } from '../data/learningStylesData';

export async function generateLearningStylesPdf(record: LearningStyleRecord) {
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

  const visualColor = [37, 99, 235];
  const auditivoColor = [5, 150, 105];
  const kinestesicoColor = [217, 119, 6];

  // --- PAGE 1: PERFIL GRÁFICO VAK Y DIAGNÓSTICO ---
  doc.setFillColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('LICENCIATURA EN ENSEÑANZA DE LENGUAS EXTRANJERAS (ESPAÑOL E INGLÉS)', margin, 9);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('TEST DE ESTILOS DE APRENDIZAJE – MODELO PNL (VISUAL - AUDITIVO - KINESTÉSICO)', margin, 16);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`FOLIO: ${record.folio}`, pageWidth - margin, 16, { align: 'right' });

  // Candidate Data Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, 28, contentWidth, 22, 2, 2, 'FD');
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

  doc.setFont('helvetica', 'bold');
  doc.text('Canal Predominante:', margin + 4, 46);
  doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.text(`${record.predominantStyle.toUpperCase()}`, margin + 38, 46);

  // Section 1: Distribución VAK
  let yPos = 56;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DISTRIBUCIÓN DE CANALES PERCEPTUALES (MODELO PNL - 40 REACTIVOS)', margin, yPos);
  yPos += 5;

  const colW = (contentWidth - 6) / 3;
  const channels = [
    {
      name: 'Visual (V)',
      count: record.counts.visual,
      pct: record.percentages.visual,
      color: visualColor,
      desc: 'Procesamiento mediante imágenes, lectura, esquemas y memoria espacial.',
    },
    {
      name: 'Auditivo (A)',
      count: record.counts.auditivo,
      pct: record.percentages.auditivo,
      color: auditivoColor,
      desc: 'Procesamiento mediante sonidos, explicaciones orales, fonética y debates.',
    },
    {
      name: 'Kinestésico (K)',
      count: record.counts.kinestesico,
      pct: record.percentages.kinestesico,
      color: kinestesicoColor,
      desc: 'Procesamiento mediante el cuerpo, sensaciones, emociones y dinámicas prácticas.',
    },
  ];

  channels.forEach((ch, idx) => {
    const x = margin + idx * (colW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.roundedRect(x, yPos, colW, 36, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(ch.color[0], ch.color[1], ch.color[2]);
    doc.text(ch.name, x + colW / 2, yPos + 6, { align: 'center' });

    doc.setFontSize(16);
    doc.text(`${ch.pct}%`, x + colW / 2, yPos + 15, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setTextColor(slateText[0], slateText[1], slateText[2]);
    doc.text(`${ch.count} de 40 reactivos`, x + colW / 2, yPos + 21, { align: 'center' });

    const barW = colW - 8;
    doc.setFillColor(226, 232, 240);
    doc.rect(x + 4, yPos + 24, barW, 2.5, 'F');
    doc.setFillColor(ch.color[0], ch.color[1], ch.color[2]);
    doc.rect(x + 4, yPos + 24, (barW * ch.pct) / 100, 2.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text(ch.desc, x + 4, yPos + 29.5, { maxWidth: barW });
  });

  yPos += 44;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('2. ANÁLISIS PEDAGÓGICO PARA LA ENSEÑANZA DE LENGUAS EXTRANJERAS', margin, yPos);
  yPos += 4;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, yPos, contentWidth, 38, 2, 2, 'FD');

  const primaryKey =
    record.counts.visual >= record.counts.auditivo && record.counts.visual >= record.counts.kinestesico
      ? 'visual'
      : record.counts.auditivo >= record.counts.kinestesico
      ? 'auditivo'
      : 'kinestesico';
  const pData = CHANNELS_DATA[primaryKey];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.text(`Perfil Docente en Lenguas Extranjeras (${pData.name}):`, margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const splitTeach = doc.splitTextToSize(pData.languageTeachingProfile, contentWidth - 8);
  doc.text(splitTeach, margin + 4, yPos + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.text('Cómo asimila mejor el inglés y español como estudiante universitario:', margin + 4, yPos + 23);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  const splitLearn = doc.splitTextToSize(pData.languageLearningProfile, contentWidth - 8);
  doc.text(splitLearn, margin + 4, yPos + 28);

  yPos += 44;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('3. ESTRATEGIAS DIDÁCTICAS RECOMENDADAS PARA EL AULA BILINGÜE', margin, yPos);
  yPos += 4;

  pData.recommendedStrategies.forEach((strat, sIdx) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
    doc.roundedRect(margin, yPos, contentWidth, 8.5, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
    doc.text(`0${sIdx + 1}`, margin + 3.5, yPos + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(strat, margin + 11, yPos + 5.5, { maxWidth: contentWidth - 16 });
    yPos += 10.5;
  });

  doc.setFontSize(6.5);
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Página 1 de 2 – Test de Estilos de Aprendizaje PNL – Licenciatura en Enseñanza de Lenguas Extranjeras', margin, pageHeight - 6);
  doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, pageWidth - margin, pageHeight - 6, { align: 'right' });

  // --- PAGE 2: TABLA DETALLADA DE RESPUESTAS (40 REACTIVOS) Y FIRMAS ---
  doc.addPage();
  doc.setFillColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.rect(0, 0, pageWidth, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('HOJA DE REGISTRO DETALLADO DE RESPUESTAS (MODELO PNL)', margin, 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ASPIRANTE: ${record.name} – FOLIO: ${record.folio}`, pageWidth - margin, 10, { align: 'right' });

  yPos = 24;
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TABLA DE CONTEO Y REVISIÓN DE REACTIVOS 1 A 40:', margin, yPos);
  yPos += 4;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateText[0], slateText[1], slateText[2]);
  doc.text('Referencia: Eric de la Parra Paz (2004). Opción A = Auditivo | Opción B = Visual | Opción C = Kinestésico', margin, yPos);

  yPos += 5;
  const tableColWidth = (contentWidth - 6) / 2;
  const rowH = 6.2;

  for (let col = 0; col < 2; col++) {
    const startQ = col === 0 ? 1 : 21;
    const endQ = col === 0 ? 20 : 40;
    const startX = margin + col * (tableColWidth + 6);

    doc.setFillColor(cobalt[0], cobalt[1], cobalt[2]);
    doc.rect(startX, yPos, tableColWidth, rowH, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('N°', startX + 3, yPos + 4.2);
    doc.text('A (Auditivo)', startX + 16, yPos + 4.2, { align: 'center' });
    doc.text('B (Visual)', startX + 38, yPos + 4.2, { align: 'center' });
    doc.text('C (Kinestésico)', startX + 62, yPos + 4.2, { align: 'center' });
    doc.text('Marcada', startX + tableColWidth - 8, yPos + 4.2, { align: 'center' });

    for (let i = startQ; i <= endQ; i++) {
      const currentY = yPos + (i - startQ + 1) * rowH;
      const isEven = (i - startQ) % 2 === 0;
      const ans = record.answers[i];

      doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
      doc.rect(startX, currentY, tableColWidth, rowH, 'F');
      doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
      doc.rect(startX, currentY, tableColWidth, rowH, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text(String(i), startX + 3, currentY + 4.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);

      if (ans === 'a') {
        doc.setFillColor(auditivoColor[0], auditivoColor[1], auditivoColor[2]);
        doc.circle(startX + 16, currentY + 3.1, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('X', startX + 16, currentY + 4.2, { align: 'center' });
      }

      if (ans === 'b') {
        doc.setFillColor(visualColor[0], visualColor[1], visualColor[2]);
        doc.circle(startX + 38, currentY + 3.1, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('X', startX + 38, currentY + 4.2, { align: 'center' });
      }

      if (ans === 'c') {
        doc.setFillColor(kinestesicoColor[0], kinestesicoColor[1], kinestesicoColor[2]);
        doc.circle(startX + 62, currentY + 3.1, 1.8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('X', startX + 62, currentY + 4.2, { align: 'center' });
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
      doc.text(ans ? ans.toUpperCase() : '-', startX + tableColWidth - 8, currentY + 4.2, { align: 'center' });
    }
  }

  const summaryY = yPos + 21 * rowH + 6;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(borderLight[0], borderLight[1], borderLight[2]);
  doc.roundedRect(margin, summaryY, contentWidth, 14, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('TOTALES POR CANAL (40 REACTIVOS):', margin + 4, summaryY + 5.5);
  doc.setTextColor(auditivoColor[0], auditivoColor[1], auditivoColor[2]);
  doc.text(`AUDITIVO (A): ${record.counts.auditivo} (${record.percentages.auditivo}%)`, margin + 65, summaryY + 5.5);
  doc.setTextColor(visualColor[0], visualColor[1], visualColor[2]);
  doc.text(`VISUAL (B): ${record.counts.visual} (${record.percentages.visual}%)`, margin + 115, summaryY + 5.5);
  doc.setTextColor(kinestesicoColor[0], kinestesicoColor[1], kinestesicoColor[2]);
  doc.text(`KINESTÉSICO (C): ${record.counts.kinestesico} (${record.percentages.kinestesico}%)`, margin + 4, summaryY + 11);
  doc.setTextColor(cobalt[0], cobalt[1], cobalt[2]);
  doc.text(`DICTAMEN PREDOMINANTE: ${record.predominantStyle.toUpperCase()}`, margin + 65, summaryY + 11);

  // Signatures
  const sigY = summaryY + 28;
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
  doc.save(`Estilos_Aprendizaje_VAK_${cleanName}_${record.folio}.pdf`);
}
