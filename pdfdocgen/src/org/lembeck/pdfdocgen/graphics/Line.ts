import {LineStyle} from './LineStyle.js';
import {LayoutedElement} from '../layout/LayoutedElement.js';
import {jsPDF} from 'jspdf';

export class Line implements LayoutedElement {

  private readonly _x1: number;
  private readonly _y1: number;
  private readonly _x2: number;
  private readonly _y2: number;

  private readonly _lineStyle: LineStyle;

  constructor(x1: number, y1: number, x2: number, y2: number, lineStyle: LineStyle) {
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    this._lineStyle = lineStyle;
  }

  render(pdf: jsPDF, debugOutput?: boolean): void {
    this._lineStyle.setStyle(pdf);
    pdf.line(this._x1, this._y1, this._x2, this._y2, 'S');
  }



}