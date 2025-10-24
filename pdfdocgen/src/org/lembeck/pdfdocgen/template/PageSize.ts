export class PageSize {

  static A4: PageSize = new PageSize(210, 297);

  private _widthMM: number;

  private _heightMM: number;

  constructor(widthMM: number, heightMM: number) {
    this._widthMM = widthMM;
    this._heightMM = heightMM;
  }

  get widthMM(): number {
    return this._widthMM;
  }

  get heightMM(): number {
    return this._heightMM;
  }
}