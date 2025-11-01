import {
  ContentArea,
  ContentBuilder,
  FloatingGraphic,
  FontSpec,
  PageOrientation,
  PageSize,
  PdfContentMap,
  PdfSection,
  PdfTemplate, TextToken,
} from 'pdfdocgen';

import * as pdg from 'pdfdocgen';
import {Paragraph} from 'pdfdocgen/build/org/lembeck/pdfdocgen/document/Paragraph.js';

export class JsPdfDocTest {

  main(): void {



    const template: PdfTemplate = new PdfTemplate();
    const contentArea1 = new ContentArea(20, 25, 170, 247);
    const section = template.addSection(new PdfSection('kapitel 1', PageSize.A4, PageOrientation.PORTRAIT, contentArea1, undefined));
    const kopfzeile1 = section.addFixedContentArea('kopfzeile1', new ContentArea(10, 5, 190, 15));
    const fusszeile1 = section.addFixedContentArea('fusszeile1', new ContentArea(10, 277, 190, 15));

    template.addSection(new PdfSection('section 1', PageSize.A4, PageOrientation.PORTRAIT, new ContentArea(40, 100, 130, 97), 3));
    template.addSection(new PdfSection('section 2', PageSize.A4, PageOrientation.PORTRAIT, new ContentArea(20, 20, 170, 257), undefined));

    new ContentBuilder().text("Hello page 1")
    .newPage()
    .text('This is the second page')
    .nextSection()
    .text('This is the third page. It has the format of the second section.')
    .jumpToSection('section 1')
    .text('This is the fourth page. It has the format of the first section again.')
    .content;


    const content: PdfContentMap = new PdfContentMap();
    content.setContent("fusszeile1", ...new ContentBuilder().alignCenter().text('Seite ').currentPageNumber().text(' von ').totalNumberOfPages().content);


    const mld: FontSpec = FontSpec.fromFile('MonsieurLaDoulaise-Regular','normal','./fonts/MonsieurLaDoulaise/MonsieurLaDoulaise-Regular.ttf');
    const cb: ContentBuilder = new ContentBuilder();
    cb.font(mld).text("MonsieurLaDoulaise")
    .font(FontSpec.ARIMO, 24).text("Arimo")
    .font(FontSpec.LIBRE_BASKERVILLE, 14).text("Libre Baskerville")
    .font(mld).text('MonsieurLaDoulaise')
    .font(FontSpec.JETBRAINS_MONO, 8).text("JetBrainsMono")
    .font(FontSpec.LIBRE_BASKERVILLE, 12);
    cb.spaceBelow(3);
    cb.newParagraph().alignCenter().text('This paragraph is displayed centered.')
    .newParagraph().alignRight().text('This paragraph is right aligned.')
    .newParagraph().alignLeft().text('And this one left aligned.')
    .newParagraph().alignJustify().text('This paragraph is aligned justified. It is a very long paragraph to show, how justified text looks like.')

    cb.newParagraph().fontSize(12).alignRight().font(FontSpec.ROBOTO).text('This line is aligned right.');
    cb.newParagraph().fontSize(16).text('This one too.');
    cb.newParagraph().fontSize(14).alignCenter().text('This paragraph is centered.');
    cb.newParagraph().fontSize(12).text('So as this one is.');
    cb.newParagraph().spaceBelow(3).text('This paragraph is centered and is very long to demonstrate how text wrapping works in centered paragraphs. Let\'s add some more text to make sure it wraps around to the next line properly. Yes, this should be enough text now.');

    cb.newParagraph().alignJustify().text('This paragraph is aligned justified. It is a very long paragraph to show, how justified text looks like. If you add a manual line break (\\n), the last line before the break will not be aligned justified but aligned to the left instead.\nJust like the line before this line.');

    cb.newParagraph().reset().fontColor('#7070d0')
    .text('You can specify a color for a paragraph.')
    .newParagraph().fontColor(undefined).text('You can use ')
    .fontColor('#d04070').text('different ')
    .fontColor('#70d0d0').text('colors ')
    .fontColor('#7070d0').text('for ')
    .fontColor('#d0d070').text('single ')
    .fontColor('#f0a060').text('tokens')
    .fontColor(undefined).text('.')
    .newParagraph().fontColor('#7070d0').text('You can even mix paragraph colors ')
    .fontColor('#d070d0').text('and token colors.');

    cb.reset().spaceBelow(7);
    cb.newParagraph().lineSpacing(1)
        .text('The spacing between the lines in this text is exactly as large as the height of the font requires, so that there is no overlap of the letters across the lines.')
    .newParagraph().lineSpacing(1.15)
    .text('The line spacing in this text is 1.15 times larger than the font height required, so that there is no overlap of letters across the lines.')
    .newParagraph().lineSpacing(1.5)
    .text('The line spacing in this text is 1.5 times larger than the font height required, so that there is no overlap of letters across the lines.')


    cb.reset().newPage().font(FontSpec.ROBOTO);
    cb.text('First Paragraph on new page after page break.');
    cb.newParagraph().text('Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.');
    cb.newParagraph().text('Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.');
    cb.newParagraph().text('Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.');
    cb.newParagraph().text('Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.');
    cb.newParagraph().text('Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.');
    cb.newParagraph().text('At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam');

    cb.newParagraph().text('Lor-em ips-um dol-or sit a-met, conse-tetur sadi-pscing eli-tr, sed di-am no-numy ei-rmod te-mpor inv-idunt ut la-bore et do-lore m-agna aliq-uyam erat, se-d di-am vol-uptua. At ve-ro eos et acc-usam et ju-sto du-o do-ores et e-a reb-um. St-et cl-ita ka-sd gube-rgren, n-o se-a taki-mata sanc-tus es-t Lo-rem ip-sum do-lor s-it a-met. Lo-rem ip-sum do-lor s-it am-et, con-setet-ur sadip-scing e-litr, se-d di-am non-umy eir-mod te-mpor inv-idunt u-t lab-ore e-t dol-ore ma-gna al-iquyam e-rat, s-ed di-am vol-uptua. A-t ve-ro e-os e-t accu-sam e-t ju-sto d-uo dol-ores e-t e-a re-bum. St-et cl-ita k-asd gub-ergren, n-o s-ea takima-ta san-ctus e-st Lo-rem ipsu-m d-olor s-it a-met. Lor-em ip-sum do-lor s-it a-met, con-setetur sadips-cing el-itr, s-ed d-iam nonu-my ei-rmod temp-or invi-dunt u-t lab-ore e-t dol-ore ma-gna aliq-uyam e-rat, s-ed di-am vo-luptua. A-t ve-ro e-os e-t a-ccusam e-t jus-to du-o dolo-res e-t e-a re-bum. St-et cl-ita ka-sd gub-ergren, n-o se-a takim-ata san-ctus e-st Lor-em i-psum do-lor s-it am-et.');
    cb.newParagraph().text('Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.');
    cb.newParagraph().text('Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.');
    cb.newParagraph().text('Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.');
    cb.newParagraph().text('Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.');
    cb.newParagraph().text('At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam');

    cb.newParagraph().text('i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i-i');
    cb.newParagraph().alignJustify().text('Hello World').text('SomeXXXXXX').text('MoreXXXXXX').text('TestXXXXXX').text('SomeXXXXXX').text('MoreXXXXXX').text('TestXXXXXX').text('SomeXXXXXX').text('MoreXXXXXX').text('TestXXXXXXX').text('Some').text('More').text('Test').text('Some').text('More').text('Test').text('Some').text('More').text('Test').text('Some').text('More').text('Test');


    const par = new Paragraph();
    par.addToken(new TextToken('Hello World', FontSpec.ARIMO, 24));

    content.setMainContent(...cb.content, new FloatingGraphic(40, 40), par, new FloatingGraphic(60, 60), par, new FloatingGraphic(50, 30), par);


    pdg.renderDocumentToFile(template, content, 'jspdfdoctest.pdf', false);
  }
}

new JsPdfDocTest().main();