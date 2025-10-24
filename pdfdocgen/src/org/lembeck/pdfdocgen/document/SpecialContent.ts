import {Content} from './Content.js';

export class SpecialContent implements Content {

  type: 'next_page' | 'next_section' | 'jump_section' = 'next_page';

  sectionId?: string;

  constructor(type: 'next_page' | 'next_section' | 'jump_section', sectionId?: string) {
    this.type = type;
    this.sectionId = sectionId;
  }

  registerFonts(): void {
    // no fonts to register
  }
}