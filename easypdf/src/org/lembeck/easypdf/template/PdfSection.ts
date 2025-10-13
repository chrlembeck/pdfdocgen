import {PageOrientation} from './PageOrientation';
import {PageSize} from './PageSize';
import {PageBlock} from '../document/PageBlock';
import {ContentArea} from './ContentArea';

export class PdfSection {

  private _id: string;

  private _size: PageSize = PageSize.A4;

  private _orientation: PageOrientation = PageOrientation.PORTRAIT;

  private _mainContentArea: ContentArea;

  private _fixedContentAreas: ContentArea[] = [];

  constructor(id: string, size: PageSize, orientation: PageOrientation, mainContentArea: ContentArea) {
    this._id = id;
    this._size = size;
    this._orientation = orientation;
    this._mainContentArea = mainContentArea;
  }

  get id(): string {
    return this._id;
  }

  addFixedContentArea(contentArea: ContentArea): ContentArea {
    this._fixedContentAreas.push(contentArea);
    return contentArea;
  }

  get mainContentArea(): ContentArea {
    return this._mainContentArea;
  }

  get fixedContentAreas(): ContentArea[] {
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