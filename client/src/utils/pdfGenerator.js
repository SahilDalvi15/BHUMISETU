import { jsPDF } from 'jspdf';

export const generateSyntheticPDF = (title, reportType, metaData) => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = pdf.internal.pageSize.getWidth();

  // Header band
  pdf.setFillColor(22, 101, 52); // Emerald/Gov Green
  pdf.rect(0, 0, W, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GOVERNMENT OF INDIA', W / 2, 10, { align: 'center' });
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Ministry of Rural Development — Department of Land Resources', W / 2, 17, { align: 'center' });
  pdf.text('BHUMISETU — National Land Acquisition & Management System', W / 2, 23, { align: 'center' });

  // Doc title
  pdf.setTextColor(22, 101, 52);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title.toUpperCase(), W / 2, 42, { align: 'center' });

  // Subtitle
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Official ${reportType} Generated via BHUMISETU`, W / 2, 48, { align: 'center' });

  // Divider
  pdf.setDrawColor(22, 101, 52);
  pdf.setLineWidth(0.5);
  pdf.line(15, 52, W - 15, 52);

  // Meta table
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 60, 60);
  
  let y = 60;
  metaData.forEach(([k1, v1, k2, v2]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${k1}:`, 15, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(v1), 45, y);

    if (k2) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${k2}:`, 105, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(String(v2), 140, y);
    }
    y += 7;
  });

  // Content Divider
  pdf.setDrawColor(200, 200, 200);
  pdf.line(15, y + 2, W - 15, y + 2);
  y += 12;

  // Body content (mock)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(30, 30, 30);
  
  const text = `This is a synthetically generated official ${reportType}. 
All data contained within this document is verified by the BHUMISETU digital ledger and synchronized with the national PFMS database. 

This document serves as proof of authorization for the associated land acquisition lifecycle events, including but not limited to Social Impact Assessment, Gram Sabha resolutions, Compensation awards, and R&R entitlement disbursements.`;
  
  const splitText = pdf.splitTextToSize(text, W - 30);
  pdf.text(splitText, 15, y);

  y += 40;

  // Seal & Signature
  pdf.setDrawColor(200, 20, 20);
  pdf.setLineWidth(1);
  pdf.circle(40, y + 15, 12, 'S');
  pdf.setTextColor(200, 20, 20);
  pdf.setFontSize(8);
  pdf.text('BHUMISETU', 40, y + 14, { align: 'center' });
  pdf.text('VERIFIED', 40, y + 17, { align: 'center' });

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Digitally Signed', 140, y + 20);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Date: ${new Date().toLocaleString()}`, 140, y + 25);
  pdf.text('System Authorization Level 4', 140, y + 29);

  // Download
  pdf.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
