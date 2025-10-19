import {FontSpec} from '../FontSpec';
import {LayoutedElement} from './LayoutedElement';
import jsPDF from 'jspdf';

export class LayoutedText implements LayoutedElement {

  private _x: number;

  private _y: number;

  private _text: string;

  private _horizontalAlignment: 'left' | 'center' | 'right' | 'justify';

  private _width: number;

  private _font: FontSpec;

  private _fontSize: number;

  private _color?: string;

  constructor(x: number, y: number, text: string, horizontalAlignment: 'left' | 'center' | 'right' | 'justify', width: number, font: FontSpec, fontSize: number, color?: string) {
    this._x = x;
    this._y = y;
    this._text = text;
    this._horizontalAlignment = horizontalAlignment;
    this._width = width;
    this._font = font;
    this._fontSize = fontSize;
    this._color = color;
  }

  render(pdf: jsPDF, debugOutput?: boolean): void {
    console.log('Rendering text at ' + this._x + '/' + this._y + ': ' + this._text + ' width: ' + this.width);

    pdf.setFont(this._font.name, this._font.style);
    pdf.setFontSize(this._fontSize);
    pdf.setTextColor(this._color || '#000000');
    console.log(pdf.getTextWidth(this._text));
    pdf.text(this._text, this._x, this._y, {
      align: this._horizontalAlignment,
      maxWidth: this._width + 0.001 // workaround to avoid unwanted line breaks due to rounding issues
    });
    if (debugOutput) {
      // TODO draw ascent, descent...
    }
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  get text(): string {
    return this._text;
  }

  get horizontalAlignment(): 'left' | 'center' | 'right' | 'justify' {
    return this._horizontalAlignment;
  }

  get width(): number {
    return this._width;
  }

  get font(): FontSpec {
    return this._font;
  }

  get fontSize(): number {
    return this._fontSize;
  }
}