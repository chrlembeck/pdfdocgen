import {ContentStream} from './ContentStream';

export class PdfContent {

  private contentMap: Map<string, any> = new Map();

  public setContent(key: string, content: ContentStream) {
    this.contentMap.set(key, content);
  }

  public getContent(key: string): ContentStream | undefined {
    return this.contentMap.get(key);
  }
}