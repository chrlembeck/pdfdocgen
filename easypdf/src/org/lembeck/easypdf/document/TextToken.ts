import {Token} from './Token';
import {FontSpec} from '../FontSpec';
import {Paragraph, SplitToken} from './Paragraph';
import {jsPDF} from 'jspdf';
import {PageLayout} from '../layout/PageLayout';
import {LayoutedText} from '../layout/LayoutedText';

export class TextToken implements Token {

  private _text: string;

  private _font: FontSpec;

  private _fontSize: number;

  private _color?: string;

  constructor(text: string, font: FontSpec, fontSize: number, color?: string) {
    this._text = text;
    this._font = font;
    this._fontSize = fontSize;
    this._color = color;
  }

  // Teilt das Token so, dass es in die verbleibende Breite passt.
  // Falls das Token komplett passt, wird remaining auf undefined gesetzt.
  splitToken(pdf: jsPDF, remainingMM: number): SplitToken {
    console.log('Splitting text token "' + this._text + '" for remaining width ' + remainingMM + 'mm');
    this._font.setFont(pdf, this._fontSize);
    const height = this._font.getHeight(pdf, this._fontSize);
    const descent = this._font.getDescent(pdf, this._fontSize);
    let widthWithoutWhitespace: number = 0;
    let splitPos = -1;
    let index = 0;
    while (index < this._text.length && widthWithoutWhitespace <= remainingMM) {
      if (this._text.charAt(index) !== ' ') {
        widthWithoutWhitespace = pdf.getTextWidth(this._text.substring(0, index+1));
      }
      if (widthWithoutWhitespace <= remainingMM && [' ', '-'].includes(this._text.charAt(index))) {
        splitPos = index + 1;
        console.log('bis split pos ' + splitPos + ' passt width ' + this._text.substring(0, index+1) + ' breite ' + widthWithoutWhitespace);
      }
      index++;
    }
    console.log('Determined split position at ' + splitPos);

    if (widthWithoutWhitespace <= remainingMM || splitPos === -1 || splitPos === this._text.length) {
      // nicht trennen
      const width = pdf.getTextWidth(this._text);
      console.log('No split, full width is ' + width);
      return {
        first: {
          token: this,
          widthMM: width,
          widthWithoutTrailingWhitespaceMM: pdf.getTextWidth(this._text.trimEnd()),
          heightMM: height,
          baselineOffsetMM: -descent
        },
        remaining: undefined
      };
    } else {
      // trennen
      const left = this._text.substring(0, splitPos);
      const right = this._text.substring(splitPos);
      const leftWidth = pdf.getTextWidth(left);
      console.log('Left is ' + left + ' width is ' + leftWidth);
      return {
        first: {
          token: this.withText(left),
          widthMM: leftWidth,
          widthWithoutTrailingWhitespaceMM: pdf.getTextWidth(this._text.substring(0, splitPos).trimEnd()),
          heightMM: height,
          baselineOffsetMM: -descent
        },
        remaining: this.withText(right),
      };
    }
  }

  withText(text: string): TextToken {
    return new TextToken(text, this._font, this._fontSize, this._color);
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

  get color(): string | undefined {
    return this._color;
  }

  registerFonts(register: (f: FontSpec) => void): void {
    register(this._font);
  }

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph): void {
    const layoutedText = new LayoutedText(cursorX, cursorY, this._text, 'left', widthMM, this._font, this._fontSize, this.color || paragraph.color);
    pageLayout.addLayoutedElement(layoutedText)
  }
}