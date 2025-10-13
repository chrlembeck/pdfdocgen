import {PdfTemplate} from './template/PdfTemplate';
import {PdfSection} from './template/PdfSection';
import {PageOrientation} from './template/PageOrientation';
import {PageSize} from './template/PageSize';
import {PdfUtil} from './PdfUtil';
import {ContentArea} from './template/ContentArea';
import {PdfContent} from './document/PdfContent';

export class JsPdfDocTest {

  main(): void {
    console.log("This is a placeholder for JsPdfDocTest.");
    const template: PdfTemplate = new PdfTemplate();
    const contentArea1 = new ContentArea('inhalt1', 20, 25, 170, 247);
    const section = template.addSection(new PdfSection('kapitel 1', PageSize.A4, PageOrientation.PORTRAIT, contentArea1));
    const kopfzeile1 = section.addFixedContentArea(new ContentArea('kopfzeile1', 10, 5, 190, 15));
    const fusszeile1 = section.addFixedContentArea(new ContentArea('fusszeile1', 10, 277, 190, 15));


    const content: PdfContent = new PdfContent();


    PdfUtil.renderDocument(template, content, 'test-document.pdf', true);
  }
}

new JsPdfDocTest().main();