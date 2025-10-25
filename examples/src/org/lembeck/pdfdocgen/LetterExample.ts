import fs from 'node:fs';
import {
  ContentArea,
  ContentBuilder,
  FontSpec,
  Content
} from 'pdfdocgen';

import * as pdg from 'pdfdocgen';


export class LetterExample {

  main(): void {
    const template: pdg.PdfTemplate = new pdg.PdfTemplate();
    const seite1text = new pdg.ContentArea(20, 107, 170, 150);
    const seite1 = new pdg.PdfSection('seite1', pdg.PageSize.A4, pdg.PageOrientation.PORTRAIT, seite1text, 1);
    seite1.addFixedContentArea('adresse', new ContentArea(25, 45, 80, 40));
    seite1.addFixedContentArea('kontakt', new ContentArea(135, 45, 55, 50));
    seite1.addFixedContentArea('fuss1', new ContentArea(20, 272, 38, 20));
    seite1.addFixedContentArea('fuss2', new ContentArea(20 + 44, 272, 38, 20));
    seite1.addFixedContentArea('fuss3', new ContentArea(20 + 88, 272, 38, 20));
    seite1.addFixedContentArea('fuss4', new ContentArea(20 + 88 + 44, 272, 38, 20));
    const logo = fs.readFileSync('img/abc-logo.png');
    seite1.addGraphicElement(new pdg.Rectangle(0, 15, 145, 20, '#5CA595'));
    seite1.addGraphicElement(new pdg.ImageElement(150, 15, 36.61, 20, logo));
    seite1.addGraphicElement(new pdg.Rectangle(150 + 5 + 36.61, 15, 18.39, 20, '#5CA595'));

    /*
     * Falzmarke 1: 105 mm von der oberen Blattkante
     * Lochmarke: 148,5 mm von der oberen Blattkante
     * Falzmarke 2: 210 mm von der oberen Blattkante
     */
    seite1.addGraphicElement(new pdg.Line(0, 105, 5, 105, new pdg.LineStyle('#a0a0a0', 0.1)));
    seite1.addGraphicElement(new pdg.Line(0, 148.5, 7, 148.5, new pdg.LineStyle('#a0a0a0', 0.1)));
    seite1.addGraphicElement(new pdg.Line(0, 210, 5, 210, new pdg.LineStyle('#a0a0a0', 0.1)));


    const folgeseiten = new pdg.PdfSection('folgeseiten', pdg.PageSize.A4, pdg.PageOrientation.PORTRAIT, new pdg.ContentArea(20, 25, 170, 247), undefined);

    template.addSection(seite1);
    template.addSection(folgeseiten);

    const content = new pdg.PdfContent();

    const fuss1text = new ContentBuilder().font(FontSpec.ROBOTO).fontSize(6.5).spaceBelow(1).fontColor('#a0a0a0')
    .text('ABC Versicherung')
    .newParagraph().text('Musterstraße 42')
    .newParagraph().text('34567 Musterstadt')
        .content;
    const fuss2text = new ContentBuilder().font(FontSpec.ROBOTO).fontSize(6.5).spaceBelow(1).fontColor('#a0a0a0')
    .text('Telefon: 02345 67890')
    .newParagraph().text('E-Mail: info@abc.de')
    .newParagraph().text('Internet: www.abc.de')
        .content;
    const fuss3text = new ContentBuilder().font(FontSpec.ROBOTO).fontSize(6.5).spaceBelow(1).fontColor('#a0a0a0')
    .text('Sparkasse Musterstadt')
    .newParagraph().text('IBAN DE01 2345 6789 0123 4567 89')
    .newParagraph().text('BIC/SWIFT: SPKMDE12345')
        .content;
    const fuss4text = new ContentBuilder().font(FontSpec.ROBOTO).fontSize(6.5).spaceBelow(1).fontColor('#a0a0a0')
    .text('Volksbank Musterstadt')
    .newParagraph().text('IBAN DE01 2345 6789 0123 4567 89')
    .newParagraph().text('BIC/SWIFT: VKBKMDE12345')
        .content;
    const adresstext = new ContentBuilder().font(FontSpec.ROBOTO).fontSize(7).spaceBelow(5)
    .fontColor('#a0a0a0')
    .text('ABC Versicherung \u00b7 Musterstraße 42 \u00b7 34567 Musterstadt')
    .fontColor('#000000').fontSize(12)

    .newParagraph().text('Herrn').spaceBelow(1)
    .newParagraph().text('Maximilian Mustermann')
    .newParagraph().text('Rügenwalderstraße 10b')
    .newParagraph().text('87654 Beispielstadt')
        .content;

    const kontakttext = new ContentBuilder().font(FontSpec.ROBOTO).fontSize(10).spaceBelow(1)
    .text('Unser Zeichen: ABC/12345')
    .newParagraph().text('Ihr Zeichen: XYZ-67890')
    .newParagraph().text('Ansprechpartner')
    .newParagraph().text('Frau Anna Beispiel')
    .newParagraph().text('Telefon: 02345 67891')
    .newParagraph().text('E-Mail: anna-beispiel@abc.de')
    .newParagraph().text('Öffnungszeiten:')
    .newParagraph().text('Mo - Fr: 08:00 - 18:00 Uhr')
        .content;

    const brieftext: Content[] = new ContentBuilder().font(FontSpec.LIBRE_BASKERVILLE_BOLD).fontSize(12).spaceBelow(10)
    .text('Ihr Anliegen vom 13. Juni 2024')
    .newParagraph().spaceBelow(4).font(FontSpec.LIBRE_BASKERVILLE).fontSize(11)
    .text('Sehr geehrter Herr Mustermann,')
    .newParagraph().alignJustify()
    .text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.')
    .newParagraph().text('Wir laden sie daher ein, am')
    .newParagraph().alignCenter().font(FontSpec.LIBRE_BASKERVILLE_BOLD)
    .text('Montag, den 24. Juni 2024, 8:30 Uhr')
    .newParagraph().font(FontSpec.LIBRE_BASKERVILLE).alignJustify()
    .text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.')
    .newParagraph().text('Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.')
    .newParagraph().text('Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.')
    .newParagraph().text('Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.')
    .newParagraph().text('Mit freundlichen Grüßen')
    .imageParagraph(60, 15, fs.readFileSync('img/anna-beispiel.png'))
    .newParagraph().text('Anna Beispiel')

    .text('')
        .content;

    content.setContent('fuss1', fuss1text);
    content.setContent('fuss2', fuss2text);
    content.setContent('fuss3', fuss3text);
    content.setContent('fuss4', fuss4text);
    content.setContent('adresse', adresstext);
    content.setContent('kontakt', kontakttext);
    content.setMainContent(...brieftext);
    pdg.renderDocumentToFile(template, content, 'letter-example.pdf', false);
  }
}

new LetterExample().main();