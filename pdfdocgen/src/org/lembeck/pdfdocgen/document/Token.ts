import jsPDF from 'jspdf';
import {Paragraph, SplitToken} from './Paragraph.js';
import {PageLayout} from '../layout/PageLayout.js';

export interface Token {
  splitToken(pdf: jsPDF, remainingMM: number): SplitToken;

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph): void;

  normalize(): Token[];
}