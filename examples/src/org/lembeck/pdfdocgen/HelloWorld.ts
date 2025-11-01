import * as pdg from 'pdfdocgen';

const template = new pdg.PdfTemplate();
template.addSection(
    new pdg.PdfSection('hello', pdg.PageSize.A4, pdg.PageOrientation.PORTRAIT,
        new pdg.ContentArea(10, 10, 190, 277),
        undefined));

const content = new pdg.PdfContentMap().setMainContent(
    ...new pdg.ContentBuilder().text('Hello World!').content);

pdg.renderDocumentToFile(template, content, "hello-world.pdf");