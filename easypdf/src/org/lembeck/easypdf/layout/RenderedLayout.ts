import {PdfTemplate} from '../template/PdfTemplate';
import {SectionLayout} from './SectionLayout';
import {FontSpec} from '../FontSpec';

export class RenderedLayout {

  private _template: PdfTemplate;

  private _sectionLayouts: Map<string, SectionLayout> = new Map();

  private _fontRegistry: Map<string, Map<string, FontSpec>> = new Map();

  constructor(template: PdfTemplate) {
    this._template = template;
  }

  get template(): PdfTemplate {
    return this._template;
  }

  get sectionLayouts(): Map<string, SectionLayout> {
    return this._sectionLayouts;
  }

  addSectionLayout(sectionLayout: SectionLayout) {
    this._sectionLayouts.set(sectionLayout.section.id, sectionLayout);
  }

  get pageCount(): number {
    let pageCount = 0;
    for (let sectionLayout of this._sectionLayouts.values()) {
      pageCount += sectionLayout.pageLayouts.length;
    }
    return pageCount;
  }

  registerFont(fontSpec: FontSpec) {
    if (!this._fontRegistry.has(fontSpec.name)) {
      this._fontRegistry.set(fontSpec.name, new Map());
    }
    const styleMap = this._fontRegistry.get(fontSpec.name)!;
    if (!styleMap.has(fontSpec.style)) {
      styleMap.set(fontSpec.style, fontSpec);
    }
  }

  get registeredFonts(): FontSpec[] {
    const fonts: FontSpec[] = [];
    for (let styleMap of this._fontRegistry.values()) {
      for (let fontSpec of styleMap.values()) {
        fonts.push(fontSpec);
      }
    }
    return fonts;
  }
}