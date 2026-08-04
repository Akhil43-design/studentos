import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function exportCanvasAsPNG(canvasElement, fileName = 'smartslate_drawing.png') {
  if (!canvasElement) return;
  const image = canvasElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = fileName;
  link.href = image;
  link.click();
}

export function exportCanvasAsPDF(canvasElement, fileName = 'smartslate_drawing.pdf') {
  if (!canvasElement) return;
  const image = canvasElement.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvasElement.width, canvasElement.height]
  });
  pdf.addImage(image, 'PNG', 0, 0, canvasElement.width, canvasElement.height);
  pdf.save(fileName);
}

export async function exportHTMLAsPDF(elementId, fileName = 'smartslate_document.pdf') {
  const element = document.getElementById(elementId);
  if (!element) return;
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
}
