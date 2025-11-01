import {PdfContentMap} from '../document/PdfContentMap.js';
import {ContentStream} from '../rendering/ContentStream.js';
import {PageInfo} from '../document/PdfContentSupplier.js';

export class LayoutState {

  private _content: PdfContentMap;

  private readonly _mainContentStream: ContentStream;

  currentPageNumber: number = 1;

  currentPageInSectionNumber: number = 1;

  currentSectionId: string;

  currentSectionIndex: number;

  constructor(content: PdfContentMap, sectionIndex: number, sectionId: string) {
    this._content = content;
    this._mainContentStream = new ContentStream(content.getMainContent().content(new PageInfo(1, 1, 'main')));
    this.currentSectionIndex = sectionIndex;
    this.currentSectionId = sectionId;
  }

  getContentStream(contentId: string, pageInfo: PageInfo): ContentStream {
    return new ContentStream(this._content.getContent(contentId).content(pageInfo));
  }

  getMainContentStream(): ContentStream {
    return this._mainContentStream;
  }
}