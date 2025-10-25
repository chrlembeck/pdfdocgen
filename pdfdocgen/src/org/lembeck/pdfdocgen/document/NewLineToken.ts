import {Token} from './Token.js';
import {jsPDF} from 'jspdf';
import {Paragraph} from './Paragraph.js';
import {PageLayout} from '../layout/PageLayout.js';
import {LineToken} from '../layout/LineToken.js';
import {SplitToken} from '../layout/SplitToken.js';

export class NewLineToken implements Token {

  splitToken(pdf: jsPDF, remainingMM: number): SplitToken {
    return  {
      first: {
        token: this,
        widthMM: 0,
        widthWithoutTrailingWhitespaceMM: 0,
        heightMM: 0,
        baselineOffsetMM: 0
      },
      remaining: undefined
    };
  }

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph): void {
  }

  normalize(): Token[] {
    return [];
  }


}