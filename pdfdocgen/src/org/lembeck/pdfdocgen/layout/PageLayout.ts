import {LayoutedElement} from './LayoutedElement.js';
import {RenderedLayout} from './RenderedLayout.js';
import {PdfSection} from '../template/PdfSection.js';
import {FontSpec} from '../FontSpec.js';

export class PageLayout {

  private _pageNumber: number;

  private _pageNumberSection: number;

  private _layout: RenderedLayout;

  private _layoutedElements: LayoutedElement[] = [];

  private _section: PdfSection;

  constructor(layout: RenderedLayout, section: PdfSection, pageNumberInSection: number, pageNumber: number) {
    this._pageNumber = pageNumber;
    this._pageNumberSection = pageNumberInSection;
    this._section = section;
    this._layout = layout;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get section(): PdfSection {
    return this._section;
  }

  get pageNumberSection(): number {
    return this._pageNumberSection;
  }

  get layout(): RenderedLayout {
    return this._layout;
  }

  addLayoutedElement(layoutedElement: LayoutedElement) {
    this._layoutedElements.push(layoutedElement);
  }

  get layoutedElements(): LayoutedElement[] {
    return this._layoutedElements;
  }
}