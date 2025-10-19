import {Content} from './Content';
import {Token} from './Token';
import {jsPDF} from 'jspdf';
import {FontSpec} from '../FontSpec';
import {PageLayout} from '../layout/PageLayout';

export class Paragraph implements Content {

  private _tokens: Token[] = [];

  private _color?: string;

  private _alignment: 'left' | 'center' | 'right' = 'left';

  constructor(alignment: 'left' | 'center' | 'right' = 'left', ...tokens: Token[]) {
    this.alignment = alignment;
    if (tokens) {
      for (let t of tokens) {
        this._tokens.push(t);
      }
    }
  }

  public static left(...tokens: Token[]):Paragraph {
    return new Paragraph('left', ...tokens);
  }

  public static right(...tokens: Token[]):Paragraph {
    return new Paragraph('right', ...tokens);
  }

  public static center(...tokens: Token[]):Paragraph {
    return new Paragraph('center', ...tokens);
  }

  addToken(token: Token): void {
    this._tokens.push(token);
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  get color(): string | undefined {
    return this._color;
  }

  get alignment(): 'left' | 'center' | 'right' {
    return this._alignment;
  }

  set alignment(alignment: 'left' | 'center' | 'right') {
    this._alignment = alignment;
  }

  set color(color: string | undefined) {
    this._color = color;
  }

  splitToLines(pdf: jsPDF, areaWidthMM: number): ParagraphLine[] {
    if (this._tokens.length === 0) {
      return [];
    }
    let result: ParagraphLine[] = [];
    let remainingMM = areaWidthMM;
    let currentLine = new ParagraphLine();
    result.push(currentLine);
    let currentToken: Token | undefined = this._tokens[0];
    let tokenIndex = 0;
    while (currentToken) {
      let splitToken: SplitToken = currentToken.splitToken(pdf, remainingMM);
      if (splitToken.first.widthMM <= remainingMM) {
        // Token oder ein Teil davon passt in die Zeile
        currentLine.tokens.push(splitToken.first);
        if (splitToken.remaining) {
          // Token wurde geteilt, der Rest kommt in die nächste Zeile
          currentToken = splitToken.remaining;
          currentLine = new ParagraphLine();
          result.push(currentLine);
          remainingMM = areaWidthMM;
          continue;
        } else {
          // Ganzes Token wurde verarbeitet, nächstes Token holen
          tokenIndex++;
          currentToken = tokenIndex < this._tokens.length ? this._tokens[tokenIndex] : undefined;
          remainingMM -= splitToken.first.widthMM;
          continue;
        }
      } else {
        // das erste Token passt nicht in die Zeile
        if (currentLine.widthMM() > 0) {
          // Zeile war schon angefangen, also neue Zeile anfangen
          currentLine = new ParagraphLine();
          result.push(currentLine);
          remainingMM = areaWidthMM;
          continue;
        } else {
          // Token passt nicht in die Zeile, die Zeile war aber leer. - Es gibt einen Überhang.
          console.warn('Token passt nicht in die Zeile: ' + JSON.stringify(splitToken.first) + ' remaining: ' + JSON.stringify(splitToken.remaining));
          currentLine.tokens.push(splitToken.first);
          // Zeile ist jetzt voll.
          currentLine = new ParagraphLine();
          result.push(currentLine);
          remainingMM = areaWidthMM;
          if (splitToken.remaining) {
            currentToken = splitToken.remaining;
          } else {
            tokenIndex++;
            currentToken = tokenIndex < this._tokens.length ? this._tokens[tokenIndex] : undefined;
          }
          continue;
        }
      }
    }
    return result;
  }

  registerFonts(register: (f: FontSpec) => void): void {
    for (let t of this._tokens) {
      t.registerFonts(register)
    }
  }
}

export interface SplitToken {
  first: LineToken,
  remaining?: Token
}

export class ParagraphLine {

  tokens: LineToken[] = [];

  widthMM(): number {
    let width = 0;
    for (let t of this.tokens) {
      width += t.widthMM;
    }
    return width;
  }

  widthWithoutTrailingWhitespaceMM(): number {
    let width: number = 0;
    for (let i: number = 0; i < this.tokens.length-1; i++) {
      width += this.tokens[i].widthMM;
    }
    if (this.tokens.length > 0) {
      width += this.tokens[this.tokens.length -1].widthWithoutTrailingWhitespaceMM;
    }
    return width;
  }

  height() {
    let height = 0;
    for (let t of this.tokens) {
      if (t.heightMM > height) {
        height = t.heightMM;
      }
    }
    return height;
  }

  baselineOfsetMM() {
    let offset = 0;
    for (let t of this.tokens) {
      if (t.baselineOffsetMM > offset) {
        offset = t.baselineOffsetMM;
      }
    }
    return offset;
  }

  addToPageLayout(pageLayout: PageLayout, startXMM: number, cursorY: number, areaWidthMM: number, paragraph: Paragraph) {
    let cursorX = startXMM;
    const baselineOffset = this.baselineOfsetMM();
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const lineToken: LineToken = this.tokens[tokenIndex];
      let dx = 0;
      if (paragraph.alignment === 'center') {
        console.log('centering line, areaWidthMM=' + areaWidthMM + ', lineWidthMM=' + this.widthMM);
        dx = Math.max(0, (areaWidthMM - this.widthWithoutTrailingWhitespaceMM()) / 2);
      } else if (paragraph.alignment === 'right') {
        dx = Math.max(0, areaWidthMM - this.widthWithoutTrailingWhitespaceMM());
      }
      lineToken.token.addToPageLayout(pageLayout, cursorX + dx, cursorY - baselineOffset, lineToken.widthMM, paragraph);
      cursorX += lineToken.widthMM;
    }
  }
}

export interface LineToken {
  token: Token;
  widthMM: number;
  widthWithoutTrailingWhitespaceMM: number;
  heightMM: number;
  baselineOffsetMM: number;
}