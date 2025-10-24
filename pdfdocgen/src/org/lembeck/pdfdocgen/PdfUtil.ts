import fs from 'node:fs';
import {jsPDF} from 'jspdf';
import {PdfTemplate} from './template/PdfTemplate.js';
import {RenderedLayout} from './layout/RenderedLayout.js';
import {PdfSection} from './template/PdfSection.js';
import {PdfContent} from './document/PdfContent.js';
import {ContentAreaType} from './template/ContentAreaType.js';
import {PageLayout} from './layout/PageLayout.js';
import {FontSpec} from './FontSpec.js';
import {layoutContentArea} from './rendering/ContentAreaRenderer.js';
import {ContentStream} from './rendering/ContentStream.js';
import {PageInfo} from './document/PdfContentSupplier.js';

export class PdfUtil {

  static embedFont(pdf: jsPDF, fontPath: string, embeddedFilename: string, fontName: string, fontStyle: string) {
    console.log('Embedding Font: ' + fontName + ' - ' + fontStyle);
    const buffer = fs.readFileSync(fontPath)
    const base64 = this.base64ArrayBuffer(buffer);

    pdf.addFileToVFS(embeddedFilename, base64);
    pdf.addFont(embeddedFilename, fontName, fontStyle);
    pdf.setFont(fontName, fontStyle);
  }

  static base64ArrayBuffer(arrayBuffer: Buffer<ArrayBuffer>) {
    let base64 = ''
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    const bytes = new Uint8Array(arrayBuffer)
    const byteLength = bytes.byteLength
    const byteRemainder = byteLength % 3
    const mainLength = byteLength - byteRemainder

    let a, b, c, d
    let chunk

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
      d = chunk & 63               // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength]

      a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4 // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

      a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2 // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
  }

  static renderDocument(template: PdfTemplate, content: PdfContent, filename: string, debugOutput ?: boolean) {
    PdfUtil.validateTemplate(template);
    const firstSection = template.sections[0];

    const pdf = new jsPDF({
      unit: 'mm',
      format: [firstSection.size.widthMM, firstSection.size.heightMM],
      orientation: firstSection.orientation === 'portrait' ? 'portrait' : 'landscape',
      putOnlyUsedFonts: true,
      compress: false,
      precision: 16,
      floatPrecision: 16
    });

    const layout: RenderedLayout = new RenderedLayout(template);

    const state = new LayoutState(content);
    do {
      const section: PdfSection = template.sections[state.currentSectionIndex];
      if (state.currentPageNumber > 1) {
        pdf.addPage([section.size.widthMM, section.size.heightMM], section.orientation === 'portrait' ? 'portrait' : 'landscape');
      }
      this.layoutPage(pdf, layout, section, state);
      state.currentPageNumber++;
      state.currentPageInSectionNumber++;
      if (section.numberOfPages && section.numberOfPages < state.currentPageInSectionNumber) {
        state.currentSectionIndex++;
        state.currentPageInSectionNumber = 1
      }
    } while (!state.getMainContentStream().isEmpty());

    PdfUtil.renderLayout(pdf, layout, debugOutput);
    pdf.save(filename);
  }

  private static layoutPage(pdf: jsPDF, layout: RenderedLayout, section: PdfSection, state: LayoutState) {
    console.log('Layout page: ', state.currentPageNumber, ' in section ', section.id, ' (page in section: ', state.currentPageInSectionNumber, ')');
    const pageLayout: PageLayout = new PageLayout(layout, section, state.currentPageInSectionNumber, state.currentPageNumber);
    layout.addPageLayout(pageLayout);

    for (const element of section.graphicElements) {
      pageLayout.addLayoutedElement(element);
    }

    for (const fixedArea of section.fixedContentAreas.entries()) {
      const contentAreaId = fixedArea[0];
      const pageInfo: PageInfo = new PageInfo(state.currentPageNumber, state.currentPageInSectionNumber, section.id);
      layoutContentArea(pdf, pageLayout, contentAreaId, fixedArea[1], state.getContentStream(contentAreaId, pageInfo), state, ContentAreaType.FIX);
    }
    layoutContentArea(pdf, pageLayout, 'main', section.mainContentArea, state.getMainContentStream(), state, ContentAreaType.FLOATING);
  }

  private static renderLayout(pdf: jsPDF, layout: RenderedLayout, debugOutput?: boolean) {
    for (const pageLayout of layout.pageLayouts) {
      pdf.setPage(pageLayout.pageNumber);

      if (debugOutput) {
        PdfUtil.paintSectionBorders(pdf, pageLayout);
      }

      for (const layoutedElement of pageLayout.layoutedElements) {
        layoutedElement.render(pdf, debugOutput);
      }
    }
  }

  private static paintSectionBorders(pdf: jsPDF, pageLayout: PageLayout) {
    const section = pageLayout.section;
    pdf.setDrawColor('#c0c0c0');
    pdf.setLineWidth(0.1)
    pdf.setLineDashPattern([], 0);

    FontSpec.JETBRAINS_MONO.setFont(pdf, 8);
    pdf.setTextColor('#c0c0c0');
    const fontkitFont = FontSpec.JETBRAINS_MONO.getFontkitFont();
    const dy = fontkitFont.ascent / fontkitFont.unitsPerEm * 8 / pdf.internal.scaleFactor;

    if (section.mainContentArea) {
      pdf.rect(section.mainContentArea.startXMM, section.mainContentArea.startYMM, section.mainContentArea.widthMM, section.mainContentArea.heightMM);
      pdf.text('main', section.mainContentArea.startXMM, section.mainContentArea.startYMM + dy, {
        align: 'left'
      });

    }
    for (const fixedAreaEntry of section.fixedContentAreas.entries()) {
      const id = fixedAreaEntry[0];
      const fixedArea = fixedAreaEntry[1];
      pdf.rect(fixedArea.startXMM, fixedArea.startYMM, fixedArea.widthMM, fixedArea.heightMM);
      pdf.text(id, fixedArea.startXMM, fixedArea.startYMM + dy, {
        align: 'left'
      });
    }
  }

  private static validateTemplate(template: PdfTemplate) {
    if (!template.sections || template.sections.length === 0) {
      throw new Error('Template must contain at least one section.');
    }
  }
}

export class LayoutState {

  private _content: PdfContent;

  private readonly _mainContentStream: ContentStream;

  currentPageNumber: number = 1;

  currentPageInSectionNumber: number = 1;

  currentSectionIndex: number = 0;

  constructor(content: PdfContent) {
    this._content = content;
    this._mainContentStream = new ContentStream(content.getMainContent().content(new PageInfo(1, 1, 'main')));
  }

  getContentStream(contentId: string, pageInfo: PageInfo): ContentStream {
    return new ContentStream(this._content.getContent(contentId).content(pageInfo));
  }

  getMainContentStream(): ContentStream {
    return this._mainContentStream;
  }
}