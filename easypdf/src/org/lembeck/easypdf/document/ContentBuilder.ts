import {FontSpec} from '../FontSpec';
import {Paragraph} from './Paragraph';
import {TextToken} from './TextToken';
import {SpecialContent} from './SpecialContent';
import {Content} from './Content';

export class ContentBuilder {

  private _font: FontSpec = FontSpec.LIBRE_BASKERVILLE;

  private _fontSize: number = 12;

  private _fontColor?: string;

  private _horizontalAlignment: 'left' | 'center' | 'right' = 'left';

  private _currentParagraph?: Paragraph;

  private readonly _content: Content[] = [];

  constructor() {
  }

  reset(): ContentBuilder {
    this._font = FontSpec.LIBRE_BASKERVILLE;
    this._fontSize = 12;
    this._fontColor = undefined;
    this._horizontalAlignment = 'left';
    return this;
  }

  get content() : Content[] {
    return this._content;
  }

  font(font: FontSpec): ContentBuilder {
    this._font = font;
    return this;
  }

  fontSize(size: number): ContentBuilder {
    this._fontSize = size;
    return this;
  }

  fontColor(color?: string): ContentBuilder {
    this._fontColor = color;
    return this;
  }

  text(text: string): ContentBuilder {
    if (!this._currentParagraph) {
      this._currentParagraph = new Paragraph(this._horizontalAlignment);
      if (this._fontColor) {
        this._currentParagraph.color = this._fontColor;
      }
      this._content.push(this._currentParagraph);
    }
    this._currentParagraph.addToken(new TextToken(text, this._font, this._fontSize, this._fontColor));
    return this;
  }

  newParagraph(): ContentBuilder {
    this._currentParagraph = undefined;
    return this;
  }

  newPage(): ContentBuilder {
    this._currentParagraph = undefined;
    this._content.push(new SpecialContent('next_page'));
    return this;
  }

  alignLeft(): ContentBuilder {
    this._horizontalAlignment = 'left';
    return this;
  }

  alignRight(): ContentBuilder {
    this._horizontalAlignment = 'right';
    return this;
  }

  alignCenter(): ContentBuilder {
    this._horizontalAlignment = 'center';
    return this;
  }
}