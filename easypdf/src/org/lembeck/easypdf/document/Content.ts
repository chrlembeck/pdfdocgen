import { FontSpec } from '../FontSpec';

export interface Content {

  registerFonts(register: (f: FontSpec) => void): void;
}