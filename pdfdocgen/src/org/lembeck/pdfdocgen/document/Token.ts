import jsPDF from 'jspdf';
import {Paragraph} from './Paragraph.js';
import {PageLayout} from '../layout/PageLayout.js';
import {SplitToken} from '../layout/SplitToken.js';

export interface Token {
  splitToken(pdf: jsPDF, remainingMM: number): SplitToken;

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph): void;

  normalize(): Token[];
}