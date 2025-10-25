import {LayoutedElement} from './LayoutedElement.js';
import {jsPDF} from 'jspdf';
import {FloatingGraphic} from '../document/FloatingGraphic.js';

export class GraphicElement implements LayoutedElement{

  private readonly _xMM: number;

  private readonly _yMM: number;

  private readonly _graphic: FloatingGraphic;

  constructor(xMM: number, yMM: number, graphic: FloatingGraphic) {
    this._xMM = xMM;
    this._yMM = yMM;
    this._graphic = graphic;
  }


  render(pdf: jsPDF, debugOutput?: boolean): void {
    pdf.context2d.save();
    pdf.context2d.beginPath();
    pdf.context2d.rect(this._xMM, this._yMM, this._graphic.widthMM, this._graphic.heightMM);
    pdf.context2d.clip();
    pdf.context2d.beginPath();
    pdf.context2d.translate(this._xMM, this._yMM);
    this._graphic.paint(pdf.context2d);
    pdf.context2d.restore();
  }

}