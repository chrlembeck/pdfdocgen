import {FontSpec} from '../FontSpec.js';
import {Paragraph} from './Paragraph.js';
import {TextToken} from './TextToken.js';
import {SpecialContent} from './SpecialContent.js';
import {Content} from './Content.js';
import {ImageContent} from './ImageContent.js';
import {CurrentPageNumberToken} from './CurrentPageNumberToken.js';
import {TotalNumberOfPagesToken} from './TotalNumberOfPagesToken.js';
import {NewLineToken} from './NewLineToken.js';
import {CurrentPageNumberInSectionToken} from './CurrentPageNumberInSectionToken.js';
import {TotalNumberOfPagesInSectionToken} from './TotalNumberOfPagesInSectionToken.js';

export class ContentBuilder {

  private readonly _content: Content[] = [];

  private _font: FontSpec = FontSpec.LIBRE_BASKERVILLE;

  private _fontSize: number = 12;

  private _lineSpacing: number = 1.15;

  private _fontColor?: string;

  private _horizontalAlignment: 'left' | 'center' | 'right' | 'justify' = 'left';

  private _currentParagraph?: Paragraph;

  private _spaceBelow: number = 0;

  reset(): ContentBuilder {
    this._font = FontSpec.LIBRE_BASKERVILLE;
    this._fontSize = 12;
    this._fontColor = undefined;
    this._horizontalAlignment = 'left';
    this._spaceBelow = 0;
    this._lineSpacing = 1.15;
    return this;
  }

  get content() : Content[] {
    return this._content;
  }

  font(font: FontSpec, fontSize?: number): ContentBuilder {
    this._font = font;
    if (fontSize) {
      this._fontSize = fontSize;
    }
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
    this.checkParagraph();
    this._currentParagraph!.addToken(new TextToken(text, this._font, this._fontSize, this._fontColor));
    return this;
  }

  currentPageNumber(): ContentBuilder {
    this.checkParagraph();
    this._currentParagraph!.addToken(new CurrentPageNumberToken(this._font, this._fontSize, this._fontColor));
    return this;
  }

  totalNumberOfPages() {
    this.checkParagraph();
    this._currentParagraph!.addToken(new TotalNumberOfPagesToken(this._font, this._fontSize, this._fontColor));
    return this;
  }

  totalNumberOfPagesInSection() {
    this.checkParagraph();
    this._currentParagraph!.addToken(new TotalNumberOfPagesInSectionToken(this._font, this._fontSize, this._fontColor));
    return this;
  }

  currentPageNumberInSection() {
    this.checkParagraph();
    this._currentParagraph!.addToken(new CurrentPageNumberInSectionToken(this._font, this._fontSize, this._fontColor));
    return this;
  }

  private checkParagraph() {
    if (!this._currentParagraph) {
      this._currentParagraph = new Paragraph(this._horizontalAlignment);
      this._currentParagraph.spaceBelow = this._spaceBelow;
      this._currentParagraph.lineSpacing = this._lineSpacing;
      if (this._fontColor) {
        this._currentParagraph.color = this._fontColor;
      }
      this._content.push(this._currentParagraph);
    }
  }

  newParagraph(): ContentBuilder {
    this._currentParagraph = undefined;
    return this;
  }

  imageParagraph(width: number, height: number, image: Uint8Array) {
    this._content.push(new ImageContent(width, height, image))
    this._currentParagraph = undefined
    return this;
  }

  newPage(): ContentBuilder {
    this._currentParagraph = undefined;
    this._content.push(new SpecialContent('next_page'));
    return this;
  }

  nextSection() {
    this._currentParagraph = undefined;
    this._content.push(new SpecialContent('next_section'));
    return this;
  }

  jumpToSection(sectionID: string) {
    this._currentParagraph = undefined;
    this._content.push(new SpecialContent('jump_section', sectionID));
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

  alignJustify(): ContentBuilder {
    this._horizontalAlignment = 'justify';
    return this;
  }

  lineSpacing(lineSpacing: number): ContentBuilder {
    this._lineSpacing = lineSpacing;
    if (this._currentParagraph) {
      this._currentParagraph.lineSpacing = lineSpacing;
    }
    return this;
  }

  alignCenter(): ContentBuilder {
    this._horizontalAlignment = 'center';
    return this;
  }

  spaceBelow(space: number) {
    this._spaceBelow = space;
    if (this._currentParagraph) {
      this._currentParagraph.spaceBelow = space;
    }
    return this;
  }

  lineBreak() {
    this.checkParagraph();
    this._currentParagraph!.addToken(new NewLineToken());
    return this;
  }
}