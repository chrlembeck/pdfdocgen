import {Content} from './Content.js';
import {jsPDF} from 'jspdf';
import {Token} from './Token.js';
import {PageLayout} from '../layout/PageLayout.js';
import {NewLineToken} from './NewLineToken.js';

export class Paragraph implements Content {

  private _tokens: Token[] = [];

  private _color?: string;

  private _spaceBelow: number = 0;

  private _lineSpacing: number = 1.15;

  private _alignment: 'left' | 'center' | 'right' | 'justify' = 'left';

  constructor(alignment: 'left' | 'center' | 'right' | 'justify' = 'left', ...tokens: Token[]) {
    this._alignment = alignment;
    if (tokens) {
      for (const token of tokens) {
        this._tokens.push(token);
      }
    }
  }

  public static left(...tokens: Token[]): Paragraph {
    return new Paragraph('left', ...tokens);
  }

  public static right(...tokens: Token[]): Paragraph {
    return new Paragraph('right', ...tokens);
  }

  public static center(...tokens: Token[]): Paragraph {
    return new Paragraph('center', ...tokens);
  }

  addToken(token: Token): void {
    this._tokens.push(token);
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  get lineSpacing(): number {
    return this._lineSpacing;
  }

  set lineSpacing(value: number) {
    this._lineSpacing = value;
  }

  get alignment(): 'left' | 'center' | 'right' | 'justify' {
    return this._alignment;
  }

  set alignment(alignment: 'left' | 'center' | 'right' | 'justify') {
    this._alignment = alignment;
  }

  set color(color: string | undefined) {
    this._color = color;
  }

  get color(): string | undefined {
    return this._color;
  }

  get spaceBelow(): number {
    return this._spaceBelow;
  }

  set spaceBelow(value: number) {
    this._spaceBelow = value;
  }

  splitToLines(pdf: jsPDF, areaWidthMM: number): ParagraphLine[] {
    if (this._tokens.length === 0) {
      return [];
    }
    this.normalizeTokens();
    const result: ParagraphLine[] = [];
    let remainingMM = areaWidthMM;
    let currentLine = new ParagraphLine();
    result.push(currentLine);
    let currentToken: Token | undefined = this._tokens[0];
    let tokenIndex = 0;
    while (currentToken) {
      if (currentToken instanceof NewLineToken) {
        console.log('NEW LINE TOKEN');
        tokenIndex++;
        currentLine.endedByManualLineBreak = true;
        if (tokenIndex < this._tokens.length) {
          remainingMM = areaWidthMM;
          currentLine = new ParagraphLine();
          result.push(currentLine);
        }
        currentToken = tokenIndex < this._tokens.length ? this._tokens[tokenIndex] : undefined;
      } else {
        const splitToken: SplitToken = currentToken.splitToken(pdf, remainingMM);
        if (splitToken.first.widthWithoutTrailingWhitespaceMM <= remainingMM) {
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
    }
    return result;
  }

  asThis(): Paragraph {
    const p = new Paragraph(this._alignment);
    p.color = this._color;
    p._spaceBelow = this._spaceBelow;
    return p;
  }

  /**
   * Sorgt dafür, dass alle Text-Token, in denen besondere Steuerzeichen, wie z.B. Zeilenumbrüche vorkommen,
   * in einzelne Token mit reinem Text und Token für die Steuerzeichen augeteilt werden.
   * @private
   */
  private normalizeTokens() {
    for (let idx = 0; idx < this._tokens.length; idx++) {
      const token = this._tokens[idx];
      const normalized: Token[] = token.normalize();
      if (normalized && normalized.length > 1) {
        this._tokens.splice(idx, 1, ...normalized);
        idx += normalized.length - 1;
      }
    }
  }
}

export interface SplitToken {
  first: LineToken,
  remaining?: Token
}

export class ParagraphLine {

  tokens: LineToken[] = [];

  endedByManualLineBreak: boolean = false;

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

  baselineOfsetMM() {
    let offset = 0;
    for (const token of this.tokens) {
      if (token.baselineOffsetMM > offset) {
        offset = token.baselineOffsetMM;
      }
    }
    return offset;
  }

  addToPageLayout(pageLayout: PageLayout, startXMM: number, cursorY: number, areaWidthMM: number, paragraph: Paragraph, lineIndex: number, totalNumberOfLines: number) {
    let cursorX = startXMM;
    const baselineOffset = this.baselineOfsetMM();
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const lineToken = this.tokens[tokenIndex];
      let dx = 0;
      if (paragraph.alignment === 'center') {
        dx = Math.max(0, (areaWidthMM - this.widthWithoutTrailingWhitespaceMM()) / 2);
      } else if (paragraph.alignment === 'right') {
        dx = Math.max(0, areaWidthMM - this.widthWithoutTrailingWhitespaceMM());
      } else if (paragraph.alignment === 'justify') {

        dx = (tokenIndex === 0 || this.endedByManualLineBreak || lineIndex == totalNumberOfLines - 1) ? 0 : tokenIndex * (areaWidthMM - this.widthWithoutTrailingWhitespaceMM()) / (this.tokens.length - 1);
        console.log('DX = ' + dx)
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