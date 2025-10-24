import {jsPDF} from 'jspdf';
import {LayoutedElement} from '../layout/LayoutedElement.js';

export class ImageElement implements LayoutedElement {

  private readonly image: Uint8Array;

  private readonly xMM: number;

  private readonly yMM: number;

  private readonly widthMM: number;

  private readonly heightMM: number;

  constructor(xMM: number, yMM: number, widthMM: number, heightMM: number, image: Uint8Array) {
    this.image = image;
    this.xMM = xMM;
    this.yMM = yMM;
    this.widthMM = widthMM;
    this.heightMM = heightMM;
  }

  render(pdf: jsPDF): void {
    pdf.addImage({
      imageData: this.image,
      x: this.xMM,
      y: this.yMM,
      width: this.widthMM,
      height: this.heightMM
    });
  }

}