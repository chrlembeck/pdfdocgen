import {Content} from './Content.js';

export class PageInfo {

  private readonly _pageNumber: number;

  private readonly _pageNumberInSection: number;

  private readonly _sectionId: string;

  constructor(pageNumber: number, pageNumberInSection: number, sectionId: string) {
    this._pageNumber = pageNumber;
    this._pageNumberInSection = pageNumberInSection;
    this._sectionId = sectionId;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get pageNumberInSection():number {
    return this._pageNumberInSection;
  }

  get sectionId(): string {
    return this._sectionId;
  }
}

export interface PdfContentSupplier {

  content(a: PageInfo): Content[];
}

