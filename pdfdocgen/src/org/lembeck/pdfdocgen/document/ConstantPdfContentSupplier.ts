import {PageInfo, PdfContentSupplier} from './PdfContentSupplier.js';
import {Content} from './Content.js';

export class ConstantPdfContentSupplier implements PdfContentSupplier {

  private readonly _content: Content[];

  constructor(content: Content[]) {
    this._content = content;
  }

  content(a: PageInfo): Content[] {
    return this._content;
  }
}