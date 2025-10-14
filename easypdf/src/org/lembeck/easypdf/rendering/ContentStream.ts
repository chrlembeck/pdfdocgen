import {Content} from '../document/Content';

export class ContentStream {

  private _content: Content[];

  constructor(content: Content[]) {
    this._content = [...content];
  }

  seek(): Content {
    if (this._content.length === 0) {
      throw new Error('No more content available.');
    }
    return this._content[0];
  }

  remove(): Content {
    if (this._content.length === 0) {
      throw new Error('No more content available.');
    }
    return this._content.shift()!;
  }

  replace(newContent: Content): void {
    if (this._content.length === 0) {
      throw new Error('No more content available.');
    }
    this._content[0] = newContent;
  }

  isEmpty() {
    return this._content.length === 0;
  }
}