import {Content} from './Content';
import {FontSpec} from '../FontSpec';

export class SpecialContent implements Content {

  type: 'next_page' | 'next_section' | 'jump_section' = 'next_page';

  sectionId?: string;

  constructor(type: 'next_page' | 'next_section' | 'jump_section', sectionId?: string) {
    this.type = type;
    this.sectionId = sectionId;
  }

  registerFonts(register: (f: FontSpec) => void): void {
    // no fonts to register
  }
}