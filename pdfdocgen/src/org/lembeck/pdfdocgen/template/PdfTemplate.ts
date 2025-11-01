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

  findSectionById(sectionId: string):PdfSection  {
    return this._sections[this.findSectionIndexById(sectionId)];
  }

  findSectionIndexById(sectionId: string) {
    for (let i = 0; i < this._sections.length; i++) {
      if (this._sections[i].id === sectionId) {
        return i;
      }
    }
    throw new Error(`Unable to find section ${sectionId}`);
  }
}