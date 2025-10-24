import {jsPDF} from 'jspdf';
import {PageLayout} from '../layout/PageLayout.js';
import {ContentAreaType} from '../template/ContentAreaType.js';
import {ContentArea} from '../template/ContentArea.js';
import {LayoutState} from '../PdfUtil.js';
import {Paragraph} from '../document/Paragraph.js';
import {ContentStream} from './ContentStream.js';
import {SpecialContent} from '../document/SpecialContent.js';
import {ImageContent} from '../document/ImageContent.js';
import {ImageElement} from '../template/ImageElement.js';

export function layoutContentArea(pdf: jsPDF,
                                  pageLayout: PageLayout,
                                  areaId: string,
                                  contentArea: ContentArea,
                                  content: ContentStream,
                                  state: LayoutState,
                                  areaType: ContentAreaType): void {
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
    if (nextContent instanceof Paragraph) {
      const remainingLines = [];
      const tokenLines = nextContent.splitToLines(pdf, areaWidthMM);
      for (const line of tokenLines) {
        if (cursorY === contentArea.startYMM || line.height() <= remainingHeightMM) {
          cursorY += line.height();
          remainingHeightMM -= line.height();
          line.addToPageLayout(pageLayout, contentArea.startXMM, cursorY, areaWidthMM, nextContent);
          if (nextContent.lineSpacing !== 1) {
            cursorY += line.height() * (nextContent.lineSpacing - 1);
            remainingHeightMM -= line.height() * (nextContent.lineSpacing - 1);
          }
        } else {
          remainingLines.push(line);
          pageFull = true;
        }
      }
      if (remainingLines.length === 0) {
        content.remove();
      } else {
        const newParagraph = nextContent.asThis();
        remainingLines.forEach(l => l.tokens.forEach(t => newParagraph.addToken(t.token)));
        content.replace(newParagraph);
      }
      cursorY += nextContent.spaceBelow;
      remainingHeightMM -= nextContent.spaceBelow;
    } else if (nextContent instanceof SpecialContent) {
      if (nextContent.type === 'next_page') {
        content.remove();
        pageFull = true;
      } else {
        throw new Error('Unsupported special content type: ' + nextContent.type);
      }
    } else if (nextContent instanceof ImageContent) {
      if (cursorY === contentArea.startYMM || remainingHeightMM >= nextContent.heightMM) {
        // Bild passt auf die Seite oder ist erstes Element
        pageLayout.addLayoutedElement(new ImageElement(contentArea.startXMM, cursorY, nextContent.widthMM, nextContent.heightMM, nextContent.imageData));
        content.remove();
        cursorY += nextContent.heightMM;
        remainingHeightMM -= nextContent.heightMM;
      } else {
        // Das Bild passt nicht mehr auf die Seite
        pageFull = true;
      }
    } else {
      throw new Error('Unsupported content type: ' + typeof nextContent);
    }
  } while (!pageFull && !content.isEmpty());
}
