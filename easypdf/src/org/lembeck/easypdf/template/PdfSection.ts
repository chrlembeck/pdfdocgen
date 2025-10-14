import {PageOrientation} from './PageOrientation';
import {PageSize} from './PageSize';
import {ContentArea} from './ContentArea';

export class PdfSection {

  private _id: string;

  private _numberOfPages: number | undefined;

  private _size: PageSize = PageSize.A4;

  private _orientation: PageOrientation = PageOrientation.PORTRAIT;

  private _mainContentArea: ContentArea;

  private _fixedContentAreas: Map<string, ContentArea> = new Map();

  constructor(id: string, size: PageSize, orientation: PageOrientation, mainContentArea: ContentArea, numberOfPages: number | undefined) {
    this._id = id;
    this._size = size;
    this._orientation = orientation;
    this._mainContentArea = mainContentArea;
    this._numberOfPages = numberOfPages;
  }

  get id(): string {
    return this._id;
  }

  get numberOfPages(): number | undefined {
    return this._numberOfPages;
  }

  addFixedContentArea(id: string, contentArea: ContentArea): ContentArea {
    if (!id || id.length === 0) {
      throw new Error('id must not be empty.');
    }
    this._fixedContentAreas.set(id, contentArea);
    return contentArea;
  }

  get mainContentArea(): ContentArea {
    return this._mainContentArea;
  }

  get fixedContentAreas(): Map<string, ContentArea> {
    return this._fixedContentAreas;
  }

  get size() {
    return this._size;
  }

  get orientation() {
    return this._orientation;
  }

  setSize(size: PageSize): void {
    this._size = size;
  }

  setOrientation(orientation: PageOrientation): void {
    this._orientation = orientation;
  }
}