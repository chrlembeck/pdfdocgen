import {Content} from './Content';
import {Token} from './Token';
import {jsPDF} from 'jspdf';
import {FontSpec} from '../FontSpec';
import {PageLayout} from '../layout/PageLayout';

export class Paragraph implements Content {

  private _tokens: Token[] = [];

  constructor(...tokens: Token[]) {
    if (tokens) {
      for (let t of tokens) {
        this._tokens.push(t);
      }
    }
  }

  addToken(token: Token): void {
    this._tokens.push(token);
  }

  get tokens(): Token[] {
    return this._tokens;
  }

  splitToLines(pdf: jsPDF, areaWidthMM: number): ParagraphLine[] {
    if (this._tokens.length === 0) {
      return [];
    }
    let result: ParagraphLine[] = [];
    let remainingMM = areaWidthMM;
    let position = 0;
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
          position = 0;
          continue;
        } else {
          // Ganzes Token wurde verarbeitet, nächstes Token holen
          tokenIndex++;
          currentToken = tokenIndex < this._tokens.length ? this._tokens[tokenIndex] : undefined;
          position += splitToken.first.widthMM;
          remainingMM -= splitToken.first.widthMM;
          continue;
        }
      } else {
        // das erste Token passt nicht in die Zeile
        if (position > 0) {
          // Zeile war schon angefangen, also neue Zeile anfangen
          currentLine = new ParagraphLine();
          result.push(currentLine);
          remainingMM = areaWidthMM;
          position = 0;
          continue;
        } else {
          // Token passt nicht in die Zeile, die Zeile war aber leer. - Es gibt einen Überhang.
          console.warn('Token passt nicht in die Zeile: ' + JSON.stringify(splitToken.first) + ' remaining: ' + JSON.stringify(splitToken.remaining));
          currentLine.tokens.push(splitToken.first);
          // Zeile ist jetzt voll.
          currentLine = new ParagraphLine();
          result.push(currentLine);
          remainingMM = areaWidthMM;
          position = 0;
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

  addToPageLayout(pageLayout: PageLayout, startXMM: number, cursorY: number, areaWidthMM: number) {
    let cursorX = startXMM;
    const baselineOffset = this.baselineOfsetMM();
    for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
      const lineToken = this.tokens[tokenIndex];

      lineToken.token.addToPageLayout(pageLayout, cursorX, cursorY - baselineOffset, lineToken.widthMM);
      cursorX += lineToken.widthMM;
    }
  }
}

export interface LineToken {
  token: Token;
  widthMM: number;
  heightMM: number;
  baselineOffsetMM: number;
}