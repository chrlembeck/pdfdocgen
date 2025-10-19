import {jsPDF} from 'jspdf';
import {PageLayout} from '../layout/PageLayout';
import {ContentAreaType} from '../template/ContentAreaType';
import {ContentArea} from '../template/ContentArea';
import {LayoutState} from '../PdfUtil';
import {Paragraph} from '../document/Paragraph';
import {ContentStream} from './ContentStream';
import {SpecialContent} from '../document/SpecialContent';

export class ContentAreaRenderer {

  public static layoutContentArea(pdf: jsPDF,
                                  pageLayout: PageLayout,
                                  areaId: string,
                                  contentArea: ContentArea,
                                  content: ContentStream,
                                  state: LayoutState,
                                  areaType: ContentAreaType) {
    console.log('Layout content area: ', areaId, ' on page ', state.currentPageNumber, ' type ', areaType);
    if (content.isEmpty()) {
      return;
    }


    const areaWidthMM = contentArea.widthMM;
    const areaHeightMM = contentArea.heightMM;
    let cursorY = contentArea.startYMM;
    let remainingHeightMM = areaHeightMM;

    let pageFull = false;
    do {
      const nextContent = content.seek();
      console.log(' Next content: ', nextContent, ' at index ', state.contentIndex);
      if (nextContent instanceof Paragraph) {
        const remainingLines = [];
        const tokenLines = nextContent.splitToLines(pdf, areaWidthMM);
        for (let lineIndex = 0; lineIndex < tokenLines.length; lineIndex++) {
          const line = tokenLines[lineIndex];
          if (lineIndex == 0 || line.height() <= remainingHeightMM) {
            cursorY += line.height();
            remainingHeightMM -= line.height();
            line.addToPageLayout(pageLayout, contentArea.startXMM, cursorY, areaWidthMM, nextContent);
          } else {
            remainingLines.push(line);
            pageFull = true;
          }
        }
        if (remainingLines.length === 0) {
          content.remove();
        } else {
          const newParagraph = new Paragraph();
          remainingLines.forEach(l => l.tokens.forEach(t => newParagraph.addToken(t.token)));
          content.replace(newParagraph);
        }

      } else if (nextContent instanceof SpecialContent) {
        if (nextContent.type === 'next_page') {
          content.remove();
          pageFull = true;
        } else {
          throw new Error('Unsupported special content type: ' + nextContent.type);
        }

      } else {
        throw new Error('Unsupported content type: ' + typeof nextContent);
      }
    } while (!pageFull && !content.isEmpty());
  }
}