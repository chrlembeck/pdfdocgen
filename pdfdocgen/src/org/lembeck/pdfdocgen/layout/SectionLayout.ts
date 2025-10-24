import {PdfSection} from '../template/PdfSection.js';
import {RenderedLayout} from './RenderedLayout.js';
import {PageLayout} from './PageLayout.js';

export class SectionLayout {

  private _section: PdfSection;

  private _renderedLayout: RenderedLayout;

  private _pageLayouts: PageLayout[] = [];

  constructor(renderedLayout: RenderedLayout, section: PdfSection) {
    this._section = section;
    this._renderedLayout = renderedLayout;
  }

  get section(): PdfSection {
    return this._section;
  }

  get renderedLayout(): RenderedLayout {
    return this._renderedLayout;
  }

  addPageLayout(pageLayout: PageLayout) {
    this._pageLayouts.push(pageLayout);
  }

  get pageLayouts(): PageLayout[] {
    return this._pageLayouts;
  }
}