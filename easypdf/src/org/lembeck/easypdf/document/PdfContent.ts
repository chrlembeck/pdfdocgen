import {Content} from './Content';

export class PdfContent {

  private contentMap: Map<string, Content[]> = new Map();

  public setContent(key: string, content: Content[]) {
    this.contentMap.set(key, content);
  }

  public getContent(key: string): Content[] {
    let oldContent = this.contentMap.get(key);
    if (!oldContent) {
      this.contentMap.set(key, []);
    }
    return this.contentMap.get(key)!;
  }

  public getMainContent(): Content[] {
    return this.getContent('main');
  }

  public getContentKeys(): string[] {
    return Array.from(this.contentMap.keys());
  }
}