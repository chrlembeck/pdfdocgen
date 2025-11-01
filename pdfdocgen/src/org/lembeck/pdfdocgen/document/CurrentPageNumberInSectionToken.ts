import {Content} from './Content.js';
import {FontSpec} from '../FontSpec.js';
import {Token} from './Token.js';
import {PageLayout} from '../layout/PageLayout.js';
import {Paragraph} from './Paragraph.js';
import {jsPDF} from 'jspdf';
import {SplitToken} from '../layout/SplitToken.js';
import {LayoutState} from '../layout/LayoutState.js';
import {LayoutedText} from '../layout/LayoutedText.js';

export class CurrentPageNumberInSectionToken implements Token {

  private _font: FontSpec;

  private _fontSize: number;

  private _fontColor: string | undefined;

  constructor(font: FontSpec, fontSize: number, fontColor: string | undefined) {
    this._font = font;
    this._fontSize = fontSize;
    this._fontColor = fontColor;
  }

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph, state: LayoutState): void {
    const layoutedText = new LayoutedText(cursorX, cursorY, String(pageLayout.pageNumberInSection), 'left', widthMM, this._font, this._fontSize, this._fontColor || paragraph.color);
    pageLayout.addLayoutedElement(layoutedText);
  }

  normalize(): Token[] {
    return [this];
  }

  splitToken(pdf: jsPDF, remainingMM: number, state: LayoutState, pageLayout: PageLayout): SplitToken {
    this._font.setFont(pdf, this._fontSize);
    const width = pdf.getTextWidth(String(pageLayout.pageNumberInSection));

    const height = this._font.getHeight(pdf, this._fontSize);
    const descent = this._font.getDescent(pdf, this._fontSize);
    return {
      first: {
        token: this,
        widthMM: width,
        heightMM: height,
        widthWithoutTrailingWhitespaceMM: width,
        baselineOffsetMM: -descent
      },
      remaining: undefined
    };
  }

}
