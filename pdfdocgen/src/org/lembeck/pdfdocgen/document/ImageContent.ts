import {Content} from './Content.js';

export class ImageContent implements Content {

  private readonly _widthMM: number;

  private readonly _heightMM: number;

  private readonly _imageData: Uint8Array;

  constructor(widthMM: number, heightMM: number, imageData: Uint8Array) {
    this._widthMM = widthMM;
    this._heightMM = heightMM;
    this._imageData = imageData;
  }

  get widthMM(): number {
    return this._widthMM;
  }

  get heightMM(): number {
    return this._heightMM;
  }

  get imageData(): Uint8Array {
    return this._imageData;
  }
}