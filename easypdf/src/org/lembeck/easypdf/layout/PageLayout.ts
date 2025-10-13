import {SectionLayout} from './SectionLayout';
import {LayoutedElement} from './LayoutedElement';
import {FontSpec} from '../FontSpec';

export class PageLayout{

  private _pageNumber: number;

  private _pageNumberSection: number;

  private _sectionLayout: SectionLayout;

  private _layoutedElements: LayoutedElement[] = [];

  constructor(sectionLayout: SectionLayout, pageNumberInSection: number, pageNumber: number) {
    this._pageNumber = pageNumber;
    this._pageNumberSection = pageNumberInSection;
    this._sectionLayout = sectionLayout;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get pageNumberSection(): number {
    return this._pageNumberSection;
  }

  get sectionLayout(): SectionLayout {
    return this._sectionLayout;
  }

  addLayoutedElement(layoutedElement: LayoutedElement) {
    this._layoutedElements.push(layoutedElement);
  }

  get layoutedElements(): LayoutedElement[] {
    return this._layoutedElements;
  }

  registerFont(fontSpec: FontSpec) {
    this._sectionLayout.registerFont(fontSpec);
  }
}