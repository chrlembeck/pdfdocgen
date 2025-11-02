import {PageLayout} from './PageLayout.js';
import {TextToken} from '../document/TextToken.js';
import {Paragraph} from '../document/Paragraph.js';
import {LineToken} from './LineToken.js';
import {LayoutState} from './LayoutState.js';

export class ParagraphLine {

  tokens: LineToken[] = [];

  endedByManualLineBreak: boolean = false;

  leftMarginMM: number = 0;

  rightMarginMM: number = 0;

  constructor(leftMarginMM: number, rightMarginMM: number, endedByManualLineBreak: boolean = false, ...tokens: LineToken[]) {
    this.tokens = tokens || [];
    this.endedByManualLineBreak = endedByManualLineBreak;
    this.leftMarginMM = leftMarginMM;
    this.rightMarginMM = rightMarginMM;
  }

  widthMM(): number {
    let width = 0;
    for (const token of this.tokens) {
      width += token.widthMM;
    }
    return width;
  }

  widthWithoutTrailingWhitespaceMM(): number {
    let width: number = 0;
    for (let tokenIndex: number = 0; tokenIndex < this.tokens.length - 1; tokenIndex++) {
      width += this.tokens[tokenIndex].widthMM;
    }
    if (this.tokens.length > 0) {
      width += this.tokens[this.tokens.length - 1].widthWithoutTrailingWhitespaceMM;
    }
    return width;
  }

  height() {
    let height = 0;
    for (const token of this.tokens) {
      if (token.heightMM > height) {
        height = token.heightMM;
      }
    }
    return height;
  }

  baselineOffsetMM() {
    let offset = 0;
    for (const token of this.tokens) {
      if (token.baselineOffsetMM > offset) {
        offset = token.baselineOffsetMM;
      }
    }
    return offset;
  }

  addToPageLayout(pageLayout: PageLayout, startXMM: number, cursorY: number, areaWidthMM: number, paragraph: Paragraph, lineIndex: number, totalNumberOfLines: number, state: LayoutState) {
    let cursorX = startXMM + this.leftMarginMM;
    const baselineOffset = this.baselineOffsetMM();
    const availableWidthMM = areaWidthMM - this.leftMarginMM - this.rightMarginMM;

    let adjustableSpaceCount = 0;
    const adjustableSpacesBefore = [0];
    if (paragraph.alignment == 'justify') {
      for (let tokenIndex = 1; tokenIndex < this.tokens.length; tokenIndex++) {
        const left = this.tokens[tokenIndex - 1];
        const right = this.tokens[tokenIndex];
        if ((left.token instanceof TextToken && left.token.text.endsWith(' '))
            || (right.token instanceof TextToken && right.token.text.startsWith(' '))) {
          adjustableSpaceCount++;
        }
        adjustableSpacesBefore[tokenIndex] = adjustableSpaceCount;
      }
    }

    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const lineToken = this.tokens[tokenIndex];
      let dx = 0;
      if (paragraph.alignment === 'center') {
        dx = Math.max(0, (availableWidthMM - this.widthWithoutTrailingWhitespaceMM()) / 2);
      } else if (paragraph.alignment === 'right') {
        dx = Math.max(0, availableWidthMM - this.widthWithoutTrailingWhitespaceMM());
      } else if (paragraph.alignment === 'justify') {
        dx = (adjustableSpaceCount === 0 || tokenIndex === 0 || this.endedByManualLineBreak || lineIndex == totalNumberOfLines - 1) ? 0 :
            adjustableSpacesBefore[tokenIndex] * (availableWidthMM - this.widthWithoutTrailingWhitespaceMM()) / (adjustableSpaceCount);
      }
      lineToken.token.addToPageLayout(pageLayout, cursorX + dx, cursorY - baselineOffset, lineToken.widthMM, paragraph, state);
      cursorX += lineToken.widthMM;
    }
  }
}