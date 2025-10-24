import {PdfSection} from './PdfSection.js';

export class PdfTemplate {

  private _sections: PdfSection[] = [];

  addSection(section: PdfSection): PdfSection {
    this._sections.push(section);
    return section
  }

  get sections(): PdfSection[] {
    return this._sections;
  }
}