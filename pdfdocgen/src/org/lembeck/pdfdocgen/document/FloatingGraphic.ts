import {Content} from './Content.js';
import {Context2d} from 'jspdf';

export class FloatingGraphic implements Content {

  private readonly _widthMM: number;

  private readonly _heightMM: number;

  constructor(widthMM: number, heightMM: number) {
    this._widthMM = widthMM;
    this._heightMM = heightMM;
  }

  get widthMM() {
    return this._widthMM;
  }

  get heightMM() {
    return this._heightMM;
  }

  paint(context2d: Context2d) {
    context2d.fillStyle = '#ff0000';
    context2d.strokeStyle = '#000000';
    context2d.lineWidth = 0.1;
    context2d.arc(this.widthMM/2, this.heightMM/2, Math.max(this.widthMM, this.heightMM)*4/7, 0, Math.PI * 2, false);
    context2d.fill();
    context2d.stroke();
    context2d.beginPath();
    context2d.lineWidth = 1;
    context2d.rect(0.5, 0.5, this.widthMM-1, this.heightMM-1);
    context2d.stroke();
  }
}