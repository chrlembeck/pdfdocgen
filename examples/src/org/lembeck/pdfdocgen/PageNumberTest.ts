import {
  ContentArea,
  ContentBuilder,
  PageOrientation,
  PageSize,
  PdfContentMap,
  PdfSection,
  PdfTemplate,
  renderDocumentToFile
} from 'pdfdocgen';

const template: PdfTemplate = new PdfTemplate()

const sec1 = template.addSection(new PdfSection("section 1", PageSize.A4, PageOrientation.PORTRAIT, new ContentArea(10, 10, 190, 257), 2));
const sec2 = template.addSection(new PdfSection("section 2", PageSize.A4, PageOrientation.LANDSCAPE, new ContentArea(10, 10, 277, 170), 3));
const sec3 = template.addSection(new PdfSection("section 3", PageSize.A4, PageOrientation.PORTRAIT, new ContentArea(10, 10, 190, 257), undefined));

sec1.addFixedContentArea('fusszeile', new ContentArea(10, 277, 190, 15));
sec2.addFixedContentArea('fusszeile', new ContentArea(10, 190, 277, 15));
sec3.addFixedContentArea('fusszeile', new ContentArea(10, 277, 190, 15));

const content: PdfContentMap = new PdfContentMap();
content.setMainContent(...new ContentBuilder()
    .text('Erste Seite des Dokuments. Diese liegt in Section 1, welche nur zwei Seiten umfasst.').newPage()
    .text('Zweite Seite des Dokuments. Da Section 1 nur 2 Seiten umfassen darf, bekommt die nächste Seite das Layout aus Section 2.').newPage()
    .text('Erste Seite in Section 2. Diese sollte drei Seiten umfassen.').newPage()
    .text('Zweite Seite in Section 2').newPage()
    .text('Dritte und vorerst letzte Seite in Section 2. Es erfolgt ein automatischer Wechsel in Section 3.').newPage()
    .text('Erste Seite in Section 3. Diese darf theoretisch unendlich lang sein.').newPage()
    .text('Zweite Seite in Section 3.').newPage()
    .text('Dritte Seite in Section 3.').newPage()
    .text('Vierte Seite in Section 3. Hier folgt ein manueller Sprung zurück in Section 2, welche mit der folgenden Seite erneut begonnen wird.').jumpToSection('section 2')
    .text('Erste Seite nach dem Sprung in Section 2. Diese kann jetzt wieder bis zu 3 Seiten lang werden.').newPage()
    .text('Zweite Seite in Section 2.').newPage()
    .text('Dritte und letzte Seite in Section 2. Es folgt wieder ein automatischer Sprung in Section 3.').newPage()
    .text('1. Seite in Section 3.').newPage()
    .text('2. Seite in Section 3.').newPage()
    .text('3. Seite in Section 3.').newPage()
    .text('4. Seite in Section 3.').newPage()
    .text('5. Seite in Section 4. Hier ist das Dokument zu Ende...').content
);
content.setContent('fusszeile',
    ...new ContentBuilder().alignCenter()
    .text('Seite ').currentPageNumber().text(' von ').totalNumberOfPages().lineBreak()
    .text('(Dies ist die ').currentPageNumberInSection().text('. von ').totalNumberOfPagesInSection().text(' Seiten innerhalb dieses Abschnitts.)')
        .content);

renderDocumentToFile(template, content, "pagenumbertest.pdf", false);
