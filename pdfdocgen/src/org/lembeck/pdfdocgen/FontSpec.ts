import * as fontkit from 'fontkit';
import {jsPDF} from 'jspdf';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { embedFont } from './PdfDocGen.js'

export class FontSpec {

  public static readonly ARIMO = new FontSpec("Arimo", "normal", "../../../../fonts/Arimo/Arimo-Regular.ttf");
  public static readonly ARIMO_BOLD = new FontSpec("Arimo-bold", "bold", "../../../../fonts/Arimo/Arimo-Bold.ttf");
  public static readonly ARIMO_ITALIC = new FontSpec("Arimo-italic", "italic", "../../../../fonts/Arimo/Arimo-Italic.ttf");
  public static readonly ARIMO_BOLD_ITALIC = new FontSpec("Arimo-bold-italic", "bolditalic", "../../../../fonts/Arimo/Arimo-BoldItalic.ttf");

  public static readonly CARLITO = new FontSpec("Carlito", "normal", "../../../../fonts/Carlito/Carlito-Regular.ttf");
  public static readonly CARLITO_BOLD = new FontSpec("Carlito-bold", "bold", "../../../../fonts/Carlito/Carlito-Bold.ttf");
  public static readonly CARLITO_ITALIC = new FontSpec("Carlito-italic", "italic", "../../../../fonts/Carlito/Carlito-Italic.ttf");
  public static readonly CARLITO_BOLD_ITALIC = new FontSpec("Carlito-bold-italic", "bolditalic", "../../../../fonts/Carlito/Carlito-BoldItalic.ttf");

  public static readonly ROBOTO = new FontSpec("Roboto", "normal", "../../../../fonts/Roboto/Roboto-Regular.ttf");
  public static readonly ROBOTO_BOLD = new FontSpec("Roboto-bold", "bold", "../../../../fonts/Roboto/Roboto-Bold.ttf");
  public static readonly ROBOTO_ITALIC = new FontSpec("Roboto-italic", "italic", "../../../../fonts/Roboto/Roboto-Italic.ttf");
  public static readonly ROBOTO_BOLD_ITALIC = new FontSpec("Roboto-bold-italic", "bolditalic", "../../../../fonts/Roboto/Roboto-BoldItalic.ttf");

  public static readonly TINOS = new FontSpec("Tinos", "normal", "../../../../fonts/Tinos/Tinos-Regular.ttf");
  public static readonly TINOS_BOLD = new FontSpec("Tinos-bold", "bold", "../../../../fonts/Tinos/Tinos-Bold.ttf");
  public static readonly TINOS_ITALIC = new FontSpec("Tinos-italic", "italic", "../../../../fonts/Tinos/Tinos-Italic.ttf");
  public static readonly TINOS_BOLD_ITALIC = new FontSpec("Tinos-bold-italic", "bolditalic", "../../../../fonts/Tinos/Tinos-BoldItalic.ttf");

  public static readonly JETBRAINS_MONO = new FontSpec("JetBrainsMono", "normal", "../../../../fonts/JetBrainsMono/JetBrainsMono-Regular.ttf");
  public static readonly JETBRAINS_MONO_BOLD = new FontSpec("JetBrainsMono-bold", "bold", "../../../../fonts/JetBrainsMono/JetBrainsMono-Bold.ttf");
  public static readonly JETBRAINS_MONO_ITALIC = new FontSpec("JetBrainsMono-italic", "italic", "../../../../fonts/JetBrainsMono/JetBrainsMono-Italic.ttf");
  public static readonly JETBRAINS_MONO_BOLD_ITALIC = new FontSpec("JetBrainsMono-bold-italic", "bolditalic", "../../../../fonts/JetBrainsMono/JetBrainsMono-BoldItalic.ttf");

  public static readonly LIBRE_BASKERVILLE = new FontSpec("Libre Baskerville", 'normal', "../../../../fonts/libre-baskerville/LibreBaskerville-Regular.ttf");
  public static readonly LIBRE_BASKERVILLE_BOLD = new FontSpec("Libre Baskerville-bold", 'bold', "../../../../fonts/libre-baskerville/LibreBaskerville-Bold.ttf");
  public static readonly LIBRE_BASKERVILLE_ITALIC = new FontSpec("Libre Baskerville-italic", 'italic', "../../../../fonts/libre-baskerville/LibreBaskerville-Italic.ttf");
  public static readonly LIBRE_BASKERVILLE_BOLD_ITALIC = new FontSpec("Libre Baskerville-bolditalic", 'bolditalic', "../../../../fonts/libre-baskerville/LibreBaskerville-BoldItalic.ttf");

  private _filename: string;

  private _name: string;

  private _style: 'normal' | 'bold' | 'italic' | 'bolditalic';

  private readonly __filename = fileURLToPath(import.meta.url);

  private readonly __dirname = dirname(this.__filename);

  constructor(name: string, style: 'normal' | 'bold' | 'italic' | 'bolditalic', filename: string) {
    this._name = name;
    this._filename = filename;
    this._style = style;
  }

  embedFont(doc: jsPDF) {
    embedFont(doc, this.getFontFilename(this._filename), this._name + '-' + this._style, this._name, this._style);
  }

  private getFontFilename(filename: string): string {
    return path.join(this.__dirname, filename);
  }

  getFontkitFont() {
    const font = fontkit.openSync(this.getFontFilename(this._filename));
    if (font.type === "TTF" || font.type === "WOFF" || font.type === "WOFF2") {
      return font
    }
    throw new Error('Invalid font type: ' + font.type + ' (only TTF, WOFF and WOFF2 are supported).');
  }

  get name(): string {
    return this._name;
  }

  get style(): 'normal' | 'bold' | 'italic' | 'bolditalic' {
    return this._style;
  }

  setFont(pdf: jsPDF, fontSize?: number) {
    if (!pdf.getFontList() || !pdf.getFontList()[this._name] || !pdf.getFontList()[this._name].includes(this.style)) {
      this.embedFont(pdf);
    }
    pdf.setFont(this._name, this._style);
    if (fontSize) {
      pdf.setFontSize(fontSize);
    }
  }

  getAscent(pdf: jsPDF, fontSize: number) {
    const font = this.getFontkitFont()
    return font.ascent * fontSize / font.unitsPerEm / pdf.internal.scaleFactor;
  }

  getDescent(pdf: jsPDF, fontSize: number) {
    const font = this.getFontkitFont();
    return font.descent * fontSize / font.unitsPerEm / pdf.internal.scaleFactor;
  }

  getHeight(pdf: jsPDF, fontSize: number) {
    return this.getAscent(pdf, fontSize) - this.getDescent(pdf, fontSize);
  }
}
