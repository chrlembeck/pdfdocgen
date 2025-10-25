import {Content} from './Content.js';
import {PdfContentSupplier} from './PdfContentSupplier.js';
import {ConstantPdfContentSupplier} from './ConstantPdfContentSupplier.js';

export class PdfContent {

  private contentMap: Map<string, PdfContentSupplier> = new Map<string, PdfContentSupplier>();

  public setContent(key: string, content: Content[]):PdfContent {
    this.contentMap.set(key, new ConstantPdfContentSupplier(content));
    return this;
  }

  public setContentProvider(key: string, contentSupplier: PdfContentSupplier): PdfContent {
    this.contentMap.set(key, contentSupplier);
    return this;
  }

  public getContent(key: string): PdfContentSupplier {
    const oldContent = this.contentMap.get(key);
    if (oldContent) {
      return oldContent;
    } else {
      const newContent = new ConstantPdfContentSupplier([]);
      this.contentMap.set(key, newContent);
      return newContent;
    }
  }

  public setMainContent(...content: Content[]): PdfContent {
    this.setContent('main', content);
    return this;
  }

  public getMainContent(): PdfContentSupplier {
    return this.getContent('main');
  }

  public getContentKeys(): string[] {
    return Array.from(this.contentMap.keys());
  }
}