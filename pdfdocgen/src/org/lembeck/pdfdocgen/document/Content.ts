import { FontSpec } from '../FontSpec.js';

export interface Content {

  registerFonts(register: (f: FontSpec) => void): void;
}