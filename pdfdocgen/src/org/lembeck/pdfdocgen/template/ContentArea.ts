import {LineStyle} from '../graphics/LineStyle.js';

export class ContentArea {

  private  _startXMM: number;

  private _startYMM: number;

  private _widthMM: number;

  private _heightMM: number;

  private _borderStyle?: LineStyle;

  constructor(startXMM: number, startYMM: number, widthMM: number, heightMM: number, borderStyle?: LineStyle) {
    this._startXMM = startXMM;
    this._startYMM = startYMM;
    this._widthMM = widthMM;
    this._heightMM = heightMM;
    this._borderStyle = borderStyle;
  }

  get startXMM(): number {
    return this._startXMM;
  }

  get startYMM(): number {
    return this._startYMM;
  }

  get widthMM(): number {
    return this._widthMM;
  }

  get heightMM(): number {
    return this._heightMM;
  }

  get borderStyle(): LineStyle | undefined {
    return this._borderStyle;
  }
}