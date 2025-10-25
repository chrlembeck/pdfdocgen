import * as pdg from 'pdfdocgen';

const template = new pdg.PdfTemplate();
template.addSection(
    new pdg.PdfSection(
        'hello',
        pdg.PageSize.A4,
        pdg.PageOrientation.PORTRAIT,
        new pdg.ContentArea(10, 10, 190, 277),
        undefined));

const content = new pdg.PdfContent().setMainContent(
    ...new pdg.ContentBuilder().text('Hello World!\n How are you').text("Two").content);

pdg.renderDocumentToFile(template, content, "hello-world.pdf");