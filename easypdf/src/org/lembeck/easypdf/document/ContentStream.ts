import {Content} from './Content';

export class ContentStream {

  private _content: Content[] = [];

  addContent(content: Content) {
    this._content.push(content);
  }

  get content(): Content[] {
    return this._content;
  }
}