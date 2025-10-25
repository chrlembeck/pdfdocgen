import {LayoutedElement} from '../layout/LayoutedElement.js';
import {jsPDF} from 'jspdf';
import {LineStyle} from './LineStyle.js';

export class Rectangle implements LayoutedElement {

  private readonly xMM: number;

  private readonly yMM: number;

  private readonly widthMM: number;

  private readonly heightMM: number;

  private readonly fillColor?: string;

  private readonly borderStyle?: LineStyle;

  constructor(xMM: number, yMM: number, widthMM: number, heightMM: number, borderStyle?: LineStyle, fillColor?: string) {
    if (!borderStyle && !fillColor) {
      throw new Error('At least one of borderStyle and fillColor has to be set.')
    }
    this.xMM = xMM;
    this.yMM = yMM;
    this.widthMM = widthMM;
    this.heightMM = heightMM;
    this.fillColor = fillColor;
    this.borderStyle = borderStyle;
  }

  render(pdf: jsPDF): void {
    if (this.fillColor) {
      pdf.setFillColor(this.fillColor);
    }
    if (this.borderStyle) {
      this.borderStyle.setStyle(pdf);
    }
    const line = this.borderStyle && this.borderStyle.lineWidth > 0;
    const style = line && this.fillColor ? 'FD' : (line ? 'S' : 'F');

    pdf.rect(this.xMM, this.yMM, this.widthMM, this.heightMM, style);
  }
}