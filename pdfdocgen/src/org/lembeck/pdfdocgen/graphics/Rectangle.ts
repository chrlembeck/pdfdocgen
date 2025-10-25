import {LayoutedElement} from '../layout/LayoutedElement.js';
import {jsPDF} from 'jspdf';

export class Rectangle implements LayoutedElement {

  private readonly xMM: number;

  private readonly yMM: number;

  private readonly widthMM: number;

  private readonly heightMM: number;

  private readonly color: string;

  constructor(xMM: number, yMM: number, widthMM: number, heightMM: number, color: string) {
    this.xMM = xMM;
    this.yMM = yMM;
    this.widthMM = widthMM;
    this.heightMM = heightMM;
    this.color = color;
  }

  render(pdf: jsPDF): void {
    pdf.setFillColor(this.color);
    pdf.rect(this.xMM, this.yMM, this.widthMM, this.heightMM, 'F');
  }
}