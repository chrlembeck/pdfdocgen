import {ContentAreaType} from './ContentAreaType';

export class ContentArea {

  private _id: string;

  private _startXMM: number;

  private _startyMM: number;

  private _widthMM: number;

  private _heightMM: number;

  constructor(id: string, startXMM: number, startyMM: number, widthMM: number, heightMM: number) {
    if (!id || id.length === 0) {
      throw new Error('id must not be empty.');
    }
    this._id = id;
    this._startXMM = startXMM;
    this._startyMM = startyMM;
    this._widthMM = widthMM;
    this._heightMM = heightMM;
  }

  get id(): string {
    return this._id;
  }

  get startXMM(): number {
    return this._startXMM;
  }

  get startyMM(): number {
    return this._startyMM;
  }

  get widthMM(): number {
    return this._widthMM;
  }

  get heightMM(): number {
    return this._heightMM;
  }
}