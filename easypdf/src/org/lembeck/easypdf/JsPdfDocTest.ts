import {PdfTemplate} from './template/PdfTemplate';
import {PdfSection} from './template/PdfSection';
import {PageOrientation} from './template/PageOrientation';
import {PageSize} from './template/PageSize';
import {PdfUtil} from './PdfUtil';
import {ContentArea} from './template/ContentArea';
import {PdfContent} from './document/PdfContent';
import {FontSpec} from './FontSpec';
import {ContentBuilder} from './document/ContentBuilder';

export class JsPdfDocTest {

  main(): void {
    console.log("This is a placeholder for JsPdfDocTest.");
    const template: PdfTemplate = new PdfTemplate();
    const contentArea1 = new ContentArea(20, 25, 170, 247);
    const section = template.addSection(new PdfSection('kapitel 1', PageSize.A4, PageOrientation.PORTRAIT, contentArea1, undefined));
    const kopfzeile1 = section.addFixedContentArea('kopfzeile1', new ContentArea(10, 5, 190, 15));
    const fusszeile1 = section.addFixedContentArea('fusszeile1', new ContentArea(10, 277, 190, 15));

    const content: PdfContent = new PdfContent();
    const cb: ContentBuilder = new ContentBuilder();
    cb.text('First Token');
    cb.fontSize(26).text('Second Token');
    cb.fontSize(14).text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');
    cb.text('Third Token');

    cb.newParagraph().fontSize(12).alignRight().font(FontSpec.ROBOTO).text('This line is aligned right.');
    cb.newParagraph().fontSize(16).text('This one too.');
    cb.newParagraph().fontSize(14).alignCenter().text('This paragraph is centered.');
    cb.newParagraph().fontSize(12).text('So as this one is.');
    cb.newParagraph().text('This paragraph is centered and is very long to demonstrate how text wrapping works in centered paragraphs. Let\'s add some more text to make sure it wraps around to the next line properly. Yes, this should be enough text now.');

    cb.newParagraph().reset().fontColor('#7070d0');
    cb.text('You can specify a color for a paragraph.');
    cb.newParagraph().fontColor(undefined).text('You can use ')
    .fontColor('#d04070').text('different ')
    .fontColor('#70d0d0').text('colors ')
    .fontColor('#7070d0').text('for ')
    .fontColor('#d0d070').text('single ')
    .fontColor('#f0a060').text('Tokens')
    .fontColor(undefined).text('.');
    cb.newParagraph().fontColor('#7070d0').text('You can even mix paragraph colors ')
    .fontColor('#d070d0').text('and token colors.');

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




    content.getMainContent().push(...cb.content);

    console.log(content.getMainContent())


    PdfUtil.renderDocument(template, content, 'test-document.pdf', true);
  }
}

new JsPdfDocTest().main();