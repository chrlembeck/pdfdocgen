import {jsPDF} from 'jspdf';
import {PageLayout} from '../layout/PageLayout.js';
import {ContentAreaType} from '../template/ContentAreaType.js';
import {ContentArea} from '../template/ContentArea.js';
import {Paragraph} from '../document/Paragraph.js';
import {ContentStream} from './ContentStream.js';
import {SpecialContent} from '../document/SpecialContent.js';
import {ImageContent} from '../document/ImageContent.js';
import {ImageElement} from '../template/ImageElement.js';
import {LayoutState} from '../layout/LayoutState.js';
import {FloatingGraphic} from '../document/FloatingGraphic.js';
import {GraphicElement} from '../layout/GraphicElement.js';
import {LayoutResult} from '../layout/LayoutResult.js';

export function layoutContentArea(pdf: jsPDF,
                                  pageLayout: PageLayout,
                                  areaId: string,
                                  contentArea: ContentArea,
                                  content: ContentStream,
                                  state: LayoutState,
                                  areaType: ContentAreaType): LayoutResult {
  console.log('Layout content area: ', areaId, ' on page ', state.currentPageNumber, ' type ', areaType);
  if (content.isEmpty()) {
    return new LayoutResult();
  }

  const areaWidthMM = contentArea.widthMM;
  const areaHeightMM = contentArea.heightMM;
  let cursorY = contentArea.startYMM;
  let remainingHeightMM = areaHeightMM;
  let result: LayoutResult = new LayoutResult();

  let pageFull = false;
  do {
    const nextContent = content.seek();
    if (nextContent instanceof Paragraph) {
      const remainingLines = [];
      const tokenLines = nextContent.splitToLines(pdf, areaWidthMM, state, pageLayout);
      for (let lineIndex = 0; lineIndex < tokenLines.length; lineIndex++){
        const line = tokenLines[lineIndex];
        if (cursorY === contentArea.startYMM || line.height() <= remainingHeightMM) {
          cursorY += line.height();
          remainingHeightMM -= line.height();
          line.addToPageLayout(pageLayout, contentArea.startXMM, cursorY, areaWidthMM, nextContent, lineIndex, tokenLines.length, state);
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
      } else if (nextContent.type === 'next_section') {
        content.remove();
        pageFull = true;
        result.newSectionIndex = state.currentSectionIndex + 1;
      } else if (nextContent.type === 'jump_section') {
        content.remove();
        pageFull = true;
        result.newSectionId = nextContent.sectionId;
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
    } else if (nextContent instanceof FloatingGraphic) {
      if (cursorY === contentArea.startYMM || remainingHeightMM >= nextContent.heightMM) {
        pageLayout.addLayoutedElement(new GraphicElement(contentArea.startXMM, cursorY, nextContent));
        content.remove();
        cursorY += nextContent.heightMM;
        remainingHeightMM -= nextContent.heightMM;
      } else {
        // Das Bild passt nicht mehr auf die Seite
        pageFull = true;
      }
    } else {
      console.log(nextContent);
      console.log(JSON.stringify(nextContent));
      throw new Error('Unsupported content type: ' + nextContent.constructor.name);
    }
  } while (!pageFull && !content.isEmpty());
  return result;
}
