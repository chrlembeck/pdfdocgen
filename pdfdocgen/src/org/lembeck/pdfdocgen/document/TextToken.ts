import {Token} from './Token.js';
import {FontSpec} from '../FontSpec.js';
import {Paragraph} from './Paragraph.js';
import {jsPDF} from 'jspdf';
import {PageLayout} from '../layout/PageLayout.js';
import {LayoutedText} from '../layout/LayoutedText.js';
import {NewLineToken} from './NewLineToken.js';
import {SplitToken} from '../layout/SplitToken.js';
import {LayoutState} from '../layout/LayoutState.js';

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
    this._font.setFont(pdf, this._fontSize);
    const height = this._font.getHeight(pdf, this._fontSize);
    const descent = this._font.getDescent(pdf, this._fontSize);
    let widthWithoutWhitespace: number = 0;
    let splitPos = -1;
    let index = 0;
    while (index < this._text.length && widthWithoutWhitespace <= remainingMM) {
      if (this._text.charAt(index) !== ' ') {
        widthWithoutWhitespace = pdf.getTextWidth(this._text.substring(0, index + 1));
      }
      if (widthWithoutWhitespace <= remainingMM && [' ', '-'].includes(this._text.charAt(index))) {
        splitPos = index + 1;
      }
      index++;
    }

    if (widthWithoutWhitespace <= remainingMM || splitPos === -1 || splitPos === this._text.length) {
      // nicht trennen
      const width = pdf.getTextWidth(this._text);
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

  addToPageLayout(pageLayout: PageLayout, cursorX: number, cursorY: number, widthMM: number, paragraph: Paragraph, state: LayoutState): void {
    const layoutedText = new LayoutedText(cursorX, cursorY, this._text, 'left', widthMM, this._font, this._fontSize, this.color || paragraph.color);
    pageLayout.addLayoutedElement(layoutedText);
  }

  normalize(): Token[] {
    const result: Token[] = [];
    const str = this._text.replace(/\r/g, '');
    let left: string = '';
    let idx = 0;
    while (idx < str.length) {
      if (str.charAt(idx) === '\n') {
        if (left && left.length > 0) {
          result.push(this.withText(left));
          left = '';
        }
        result.push(new NewLineToken());
      } else if (str.charAt(idx) === ' ') {
        left += str.charAt(idx);
      } else {
        if (left && left.length > 0 && left.charAt(left.length - 1) === ' ') {
          result.push(this.withText(left));
          left = str.charAt(idx);
        } else {
          left += str.charAt(idx);
        }
      }
      idx++;
    }
    if (left.length > 0) {
      result.push(this.withText(left));
    }
    return result.length > 1 ? result : [this];
  }
}