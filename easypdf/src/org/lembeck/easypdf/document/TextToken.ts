import {Token} from './Token';
import {FontSpec} from '../FontSpec';
import {SplitToken} from './Paragraph';
import {jsPDF} from 'jspdf';
import {PageLayout} from '../layout/PageLayout';
import {LayoutedText} from '../layout/LayoutedText';

export class TextToken implements Token {

  private _text: string;

  private _font: FontSpec;

  private _fontSize: number;

  constructor(text: string, font: FontSpec, fontSize: number) {
    this._text = text;
    this._font = font;
    this._fontSize = fontSize;
  }

  splitToken(pdf: jsPDF, remainingMM: number): SplitToken {
    this._font.setFont(pdf, this._fontSize);
    const height = this._font.getHeight(pdf, this._fontSize);
    const descent = this._font.getDescent(pdf, this._fontSize);
    const width = pdf.getTextWidth(this._text);
    return {
      first: {
        token: this,
        widthMM: width,
        heightMM: height,
        baselineOffsetMM: -descent
      },
      remaining: undefined
    };
  }

  get text(): string {
    return this._text;
  }

  get font(): FontSpec {
    return this._font;
  }

  get fontSize(): number {
    return this._fontSize;
  }

  registerFonts(register: (f: FontSpec) => void): void {
    register(this._font);
  }

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number): void {
    const layoutedText = new LayoutedText(cursorX, cursorY, this._text, 'left', widthMM, this._font, this._fontSize);
    pageLayout.addLayoutedElement(layoutedText)
  }
}