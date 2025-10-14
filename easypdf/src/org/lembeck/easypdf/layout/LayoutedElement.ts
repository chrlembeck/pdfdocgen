import jsPDF from 'jspdf';

export interface LayoutedElement {

  render(pdf: jsPDF, debugOutput?: boolean): void;
}