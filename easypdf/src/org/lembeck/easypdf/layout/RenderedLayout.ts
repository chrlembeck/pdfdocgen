import {PdfTemplate} from '../template/PdfTemplate';
import {PageLayout} from './PageLayout';

export class RenderedLayout {

  private _template: PdfTemplate;

  private _pageLayouts: PageLayout[] = [];

  constructor(template: PdfTemplate) {
    this._template = template;
  }

  get template(): PdfTemplate {
    return this._template;
  }

  get pageLayouts(): PageLayout[] {
    return this._pageLayouts;
  }

  addPageLayout(pageLayout: PageLayout) {
    this._pageLayouts.push(pageLayout);
  }

  get pageCount(): number {
    return this._pageLayouts.length;
  }
}