import jsPDF from 'jspdf';
import {Paragraph, SplitToken} from './Paragraph';
import { FontSpec } from '../FontSpec';
import {PageLayout} from '../layout/PageLayout';

export interface Token {
  splitToken(pdf: jsPDF, remainingMM: number): SplitToken;

  registerFonts(register: (f: FontSpec) => void): void;

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph): void;
}