import fontkit from 'fontkit';
import {jsPDF} from 'jspdf';
import {PdfUtil} from './PdfUtil';


export class FontSpec {

  public static readonly ROBOTO = new FontSpec("Roboto", "normal", "fonts/Roboto/Roboto-Regular.ttf");
  public static readonly ROBOTO_BOLD = new FontSpec("Roboto-bold", "bold", "fonts/Roboto/Roboto-Bold.ttf");
  public static readonly ROBOTO_ITALIC = new FontSpec("Roboto-italic", "italic", "fonts/Roboto/Roboto-Italic.ttf");
  public static readonly ROBOTO_BOLD_ITALIC = new FontSpec("Roboto-bold-italic", "bolditalic", "fonts/Roboto/Roboto-BoldItalic.ttf");

  public static readonly JETBRAINS_MONO = new FontSpec("JetBrainsMono", "normal", "fonts/JetBrainsMono/JetBrainsMono-Regular.ttf");
  public static readonly JETBRAINS_MONO_BOLD = new FontSpec("JetBrainsMono-bold", "bold", "fonts/JetBrainsMono/JetBrainsMono-Bold.ttf");
  public static readonly JETBRAINS_MONO_ITALIC = new FontSpec("JetBrainsMono-italic", "italic", "fonts/JetBrainsMono/JetBrainsMono-Italic.ttf");
  public static readonly JETBRAINS_MONO_BOLD_ITALIC = new FontSpec("JetBrainsMono-bold-italic", "bolditalic", "fonts/JetBrainsMono/JetBrainsMono-BoldItalic.ttf");

  public static readonly LIBRE_BASKERVILLE = new FontSpec("Libre Baskerville", 'normal', "fonts/libre-baskerville/LibreBaskerville-Regular.ttf");
  public static readonly LIBRE_BASKERVILLE_BOLD = new FontSpec("Libre Baskerville-bold", 'bold', "fonts/libre-baskerville/LibreBaskerville-Bold.ttf");
  public static readonly LIBRE_BASKERVILLE_ITALIC = new FontSpec("Libre Baskerville-italic", 'italic', "fonts/libre-baskerville/LibreBaskerville-Italic.ttf");
  public static readonly LIBRE_BASKERVILLE_BOLD_ITALIC = new FontSpec("Libre Baskerville-bolditalic", 'bolditalic', "fonts/libre-baskerville/LibreBaskerville-BoldItalic.ttf");

  private _filename: string;

  private _name: string;

  private _style: 'normal' | 'bold' | 'italic' | 'bolditalic';

  constructor(name: string, style: 'normal' | 'bold' | 'italic' | 'bolditalic', filename: string) {
    this._name = name;
    this._filename = filename;
    this._style = style;
  }

  embedFont(doc: jsPDF) {
    PdfUtil.embedFont(doc, this._filename, this._name + '-' + this._style, this._name, this._style);
  }

  getFontkitFont() {
    const font = fontkit.openSync(this._filename);
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
}
