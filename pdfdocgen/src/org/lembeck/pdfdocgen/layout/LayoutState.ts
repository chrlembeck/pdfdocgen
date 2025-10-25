import {PdfContent} from '../document/PdfContent.js';
import {ContentStream} from '../rendering/ContentStream.js';
import {PageInfo} from '../document/PdfContentSupplier.js';

export class LayoutState {

  private _content: PdfContent;

  private readonly _mainContentStream: ContentStream;

  currentPageNumber: number = 1;

  currentPageInSectionNumber: number = 1;

  currentSectionIndex: number = 0;

  constructor(content: PdfContent) {
    this._content = content;
    this._mainContentStream = new ContentStream(content.getMainContent().content(new PageInfo(1, 1, 'main')));
  }

  getContentStream(contentId: string, pageInfo: PageInfo): ContentStream {
    return new ContentStream(this._content.getContent(contentId).content(pageInfo));
  }

  getMainContentStream(): ContentStream {
    return this._mainContentStream;
  }
}