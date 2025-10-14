
export class ContentArea {

  private  _startXMM: number;

  private _startYMM: number;

  private _widthMM: number;

  private _heightMM: number;

  constructor(startXMM: number, startYMM: number, widthMM: number, heightMM: number) {
    this._startXMM = startXMM;
    this._startYMM = startYMM;
    this._widthMM = widthMM;
    this._heightMM = heightMM;
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
}