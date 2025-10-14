import {PdfTemplate} from './template/PdfTemplate';
import {PdfSection} from './template/PdfSection';
import {PageOrientation} from './template/PageOrientation';
import {PageSize} from './template/PageSize';
import {PdfUtil} from './PdfUtil';
import {ContentArea} from './template/ContentArea';
import {PdfContent} from './document/PdfContent';
import {Paragraph} from './document/Paragraph';
import {TextToken} from './document/TextToken';
import {FontSpec} from './FontSpec';
import {SpecialContent} from './document/SpecialContent';

export class JsPdfDocTest {

  main(): void {
    console.log("This is a placeholder for JsPdfDocTest.");
    const template: PdfTemplate = new PdfTemplate();
    const contentArea1 = new ContentArea( 20, 25, 170, 247);
    const section = template.addSection(new PdfSection('kapitel 1', PageSize.A4, PageOrientation.PORTRAIT, contentArea1, undefined));
    const kopfzeile1 = section.addFixedContentArea('kopfzeile1', new ContentArea(10, 5, 190, 15));
    const fusszeile1 = section.addFixedContentArea('fusszeile1', new ContentArea(10, 277, 190, 15));


    const content: PdfContent = new PdfContent();
    const paragraph1 = new Paragraph();
    paragraph1.addToken(new TextToken('First Token', FontSpec.LIBRE_BASKERVILLE, 12));
    paragraph1.addToken(new TextToken('Second Token', FontSpec.LIBRE_BASKERVILLE, 26));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));
    paragraph1.addToken(new TextToken('Third Token', FontSpec.LIBRE_BASKERVILLE, 14));


    content.getMainContent().push(paragraph1);
    content.getMainContent().push(new Paragraph(new TextToken('This line is right alligned.', FontSpec.ROBOTO, 12)));
    content.getMainContent().push(new Paragraph(new TextToken('This one too.', FontSpec.ROBOTO, 16)));
    content.getMainContent().push(new Paragraph(new TextToken('This paragraph is centered.', FontSpec.ROBOTO, 14)));
    content.getMainContent().push(new Paragraph(new TextToken('So as this one is.', FontSpec.ROBOTO, 12)));
    content.getMainContent().push(new SpecialContent('next_page'));
    content.getMainContent().push(new Paragraph(new TextToken('First Paragraph after page break.', FontSpec.ROBOTO, 12)));



    console.log(content.getMainContent())


    PdfUtil.renderDocument(template, content, 'test-document.pdf', true);
  }
}

new JsPdfDocTest().main();