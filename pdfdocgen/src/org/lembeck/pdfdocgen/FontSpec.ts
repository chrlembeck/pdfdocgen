import * as fontkit from 'fontkit';
import {jsPDF} from 'jspdf';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { embedFont } from './PdfDocGen.js'
import {Buffer} from 'buffer';
import fs from 'node:fs';

export class FontSpec {

  public static readonly ARIMO = FontSpec.fromFile("Arimo", "normal", FontSpec.getFontFilename("../../../../fonts/Arimo/Arimo-Regular.ttf"));
  public static readonly ARIMO_BOLD = FontSpec.fromFile("Arimo-bold", "bold", FontSpec.getFontFilename("../../../../fonts/Arimo/Arimo-Bold.ttf"));
  public static readonly ARIMO_ITALIC = FontSpec.fromFile("Arimo-italic", "italic", FontSpec.getFontFilename("../../../../fonts/Arimo/Arimo-Italic.ttf"));
  public static readonly ARIMO_BOLD_ITALIC = FontSpec.fromFile("Arimo-bold-italic", "bolditalic", FontSpec.getFontFilename("../../../../fonts/Arimo/Arimo-BoldItalic.ttf"));

  public static readonly CARLITO = FontSpec.fromFile("Carlito", "normal", FontSpec.getFontFilename("../../../../fonts/Carlito/Carlito-Regular.ttf"));
  public static readonly CARLITO_BOLD = FontSpec.fromFile("Carlito-bold", "bold", FontSpec.getFontFilename("../../../../fonts/Carlito/Carlito-Bold.ttf"));
  public static readonly CARLITO_ITALIC = FontSpec.fromFile("Carlito-italic", "italic", FontSpec.getFontFilename("../../../../fonts/Carlito/Carlito-Italic.ttf"));
  public static readonly CARLITO_BOLD_ITALIC = FontSpec.fromFile("Carlito-bold-italic", "bolditalic", FontSpec.getFontFilename("../../../../fonts/Carlito/Carlito-BoldItalic.ttf"));

  public static readonly ROBOTO = FontSpec.fromFile("Roboto", "normal", FontSpec.getFontFilename("../../../../fonts/Roboto/Roboto-Regular.ttf"));
  public static readonly ROBOTO_BOLD = FontSpec.fromFile("Roboto-bold", "bold", FontSpec.getFontFilename("../../../../fonts/Roboto/Roboto-Bold.ttf"));
  public static readonly ROBOTO_ITALIC = FontSpec.fromFile("Roboto-italic", "italic", FontSpec.getFontFilename("../../../../fonts/Roboto/Roboto-Italic.ttf"));
  public static readonly ROBOTO_BOLD_ITALIC = FontSpec.fromFile("Roboto-bold-italic", "bolditalic", FontSpec.getFontFilename("../../../../fonts/Roboto/Roboto-BoldItalic.ttf"));

  public static readonly TINOS = FontSpec.fromFile("Tinos", "normal", FontSpec.getFontFilename("../../../../fonts/Tinos/Tinos-Regular.ttf"));
  public static readonly TINOS_BOLD = FontSpec.fromFile("Tinos-bold", "bold", FontSpec.getFontFilename("../../../../fonts/Tinos/Tinos-Bold.ttf"));
  public static readonly TINOS_ITALIC = FontSpec.fromFile("Tinos-italic", "italic", FontSpec.getFontFilename("../../../../fonts/Tinos/Tinos-Italic.ttf"));
  public static readonly TINOS_BOLD_ITALIC = FontSpec.fromFile("Tinos-bold-italic", "bolditalic", FontSpec.getFontFilename("../../../../fonts/Tinos/Tinos-BoldItalic.ttf"));

  public static readonly JETBRAINS_MONO = FontSpec.fromFile("JetBrainsMono", "normal", FontSpec.getFontFilename("../../../../fonts/JetBrainsMono/JetBrainsMono-Regular.ttf"));
  public static readonly JETBRAINS_MONO_BOLD = FontSpec.fromFile("JetBrainsMono-bold", "bold", FontSpec.getFontFilename("../../../../fonts/JetBrainsMono/JetBrainsMono-Bold.ttf"));
  public static readonly JETBRAINS_MONO_ITALIC = FontSpec.fromFile("JetBrainsMono-italic", "italic", FontSpec.getFontFilename("../../../../fonts/JetBrainsMono/JetBrainsMono-Italic.ttf"));
  public static readonly JETBRAINS_MONO_BOLD_ITALIC = FontSpec.fromFile("JetBrainsMono-bold-italic", "bolditalic", FontSpec.getFontFilename("../../../../fonts/JetBrainsMono/JetBrainsMono-BoldItalic.ttf"));

  public static readonly LIBRE_BASKERVILLE = FontSpec.fromFile("Libre Baskerville", 'normal', FontSpec.getFontFilename("../../../../fonts/libre-baskerville/LibreBaskerville-Regular.ttf"));
  public static readonly LIBRE_BASKERVILLE_BOLD = FontSpec.fromFile("Libre Baskerville-bold", 'bold', FontSpec.getFontFilename("../../../../fonts/libre-baskerville/LibreBaskerville-Bold.ttf"));
  public static readonly LIBRE_BASKERVILLE_ITALIC = FontSpec.fromFile("Libre Baskerville-italic", 'italic', FontSpec.getFontFilename("../../../../fonts/libre-baskerville/LibreBaskerville-Italic.ttf"));
  public static readonly LIBRE_BASKERVILLE_BOLD_ITALIC = FontSpec.fromFile("Libre Baskerville-bolditalic", 'bolditalic', FontSpec.getFontFilename("../../../../fonts/libre-baskerville/LibreBaskerville-BoldItalic.ttf"));

  private _fontData: Buffer<ArrayBuffer>;

  private _name: string;

  private _style: 'normal' | 'bold' | 'italic' | 'bolditalic';

  private constructor(name: string, style: 'normal' | 'bold' | 'italic' | 'bolditalic', fontData: Buffer<ArrayBuffer>) {
    this._name = name;
    this._fontData = fontData;
    this._style = style;
  }

  static fromFile(name: string, style: 'normal' | 'bold' | 'italic' | 'bolditalic', filename: string): FontSpec {
    const data = fs.readFileSync(filename);
    return new FontSpec(name, style, data);
  }

  static fromBuffer(name: string, style: 'normal' | 'bold' | 'italic' | 'bolditalic', fontData: Buffer<ArrayBuffer>): FontSpec {
    return new FontSpec(name, style, fontData);
  }

  private static getFontFilename(filename: string): string {
    return path.join(dirname(fileURLToPath(import.meta.url)), filename);
  }

  embedFont(doc: jsPDF) {
    embedFont(doc, this._fontData, this._name + '-' + this._style, this._name, this._style);
  }

  getFontkitFont() {
    const font = fontkit.create(this._fontData);
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
