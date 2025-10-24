import jsPDF from 'jspdf';
import {Paragraph, SplitToken} from './Paragraph.js';
import { FontSpec } from '../FontSpec.js';
import {PageLayout} from '../layout/PageLayout.js';

export interface Token {
  splitToken(pdf: jsPDF, remainingMM: number): SplitToken;

  registerFonts(register: (f: FontSpec) => void): void;

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph): void;
}