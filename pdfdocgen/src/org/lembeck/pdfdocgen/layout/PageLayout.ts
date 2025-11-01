import {LayoutedElement} from './LayoutedElement.js';
import {RenderedLayout} from './RenderedLayout.js';
import {PdfSection} from '../template/PdfSection.js';
import {FontSpec} from '../FontSpec.js';

export class PageLayout {

  private _pageNumber: number;

  private _pageNumberInSection: number;

  private _layout: RenderedLayout;

  private _layoutedElements: LayoutedElement[] = [];

  private _section: PdfSection;

  /**
   * Gesamtzahl der Seiten in dem Dokument. Steht erst zur Verfügung, wenn der main-Content-Bereich des Dokuments generiert wurde.
   * Die Zahl kann daher nur bei der Erstellung der fixen-Sektionen des Dokuments (wie z.B. in Kopf- und Fusszeilen) verwendet werden.
   */
  private _totalNumberOfPages?: number;

  /**
   * Gesamtzahl der Seiten innerhalb des aktuellen Abschnitts. Steht erst zur Verfügung, wenn der main-Content-Bereich des Dokuments generiert wurde.
   * Die Zahl kann daher nur bei der Erstellung der fixen-Sektionen des Dokuments (wie z.B. in Kopf- und Fusszeilen) verwendet werden.
   */
  private _totalNumberOfPagesInSection?: number;

  constructor(layout: RenderedLayout, section: PdfSection, pageNumberInSection: number, pageNumber: number) {
    this._pageNumber = pageNumber;
    this._pageNumberInSection = pageNumberInSection;
    this._section = section;
    this._layout = layout;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get section(): PdfSection {
    return this._section;
  }

  get pageNumberInSection(): number {
    return this._pageNumberInSection;
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

  get totalNumberOfPagesInSection(): number | undefined {
    return this._totalNumberOfPagesInSection;
  }

  set totalNumberOfPagesInSection(totalNumberOfPagesInSection: number) {
    this._totalNumberOfPagesInSection = totalNumberOfPagesInSection;
  }

  get totalNumberOfPages(): number | undefined {
    return this._totalNumberOfPages;
  }

  set totalNumberOfPages(totalNumberOfPages: number) {
    this._totalNumberOfPages = totalNumberOfPages;
  }
}