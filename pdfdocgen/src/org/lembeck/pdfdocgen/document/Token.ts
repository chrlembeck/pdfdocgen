import jsPDF from 'jspdf';
import {Paragraph} from './Paragraph.js';
import {PageLayout} from '../layout/PageLayout.js';
import {SplitToken} from '../layout/SplitToken.js';
import {LayoutState} from '../layout/LayoutState.js';

export interface Token {
  splitToken(pdf: jsPDF, remainingMM: number, state: LayoutState, layout: PageLayout): SplitToken;

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph, state: LayoutState): void;

  normalize(): Token[];
}