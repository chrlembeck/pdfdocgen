import fs from 'node:fs';
import {jsPDF} from 'jspdf';
import {PdfTemplate} from './template/PdfTemplate';
import {RenderedLayout} from './layout/RenderedLayout';
import {PdfSection} from './template/PdfSection';
import {PdfContent} from './document/PdfContent';
import {ContentAreaType} from './template/ContentAreaType';
import {PageLayout} from './layout/PageLayout';
import {FontSpec} from './FontSpec';
import {ContentAreaRenderer} from './rendering/ContentAreaRenderer';
import {ContentStream} from './rendering/ContentStream';

export class PdfUtil {

  static embedFont(pdf: jsPDF, fontPath: string, embeddedFilename: string, fontName: string, fontStyle: string) {
    const buffer = fs.readFileSync(fontPath)
    const base64 = this.base64ArrayBuffer(buffer);

    pdf.addFileToVFS(embeddedFilename, base64);
    pdf.addFont(embeddedFilename, fontName, fontStyle);
    pdf.setFont(fontName, fontStyle);
  }

  static base64ArrayBuffer(arrayBuffer: NonSharedBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
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
    let firstSection = template.sections[0];

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
    PdfUtil.embedFonts(pdf, template, content, debugOutput || false);


    const state = new LayoutState(content);
    do {
      const section: PdfSection = template.sections[state.currentSectionIndex];
      if (state.currentPageNumber > 1) {
        pdf.addPage([section.size.widthMM, section.size.heightMM], section.orientation === 'portrait' ? 'portrait' : 'landscape');
      }
      this.layoutPage(pdf, layout, section, state);
      state.currentPageNumber++;

      // TODO: page in section number hochzählen
      // TODO: Section-Wechsel realisieren

      console.log(state.contentIndex + ' ' + content.getMainContent().length);
    } while (!state.getMainContentStream().isEmpty());

    console.log("Rendered layout: ", layout.pageLayouts);
    PdfUtil.renderLayout(pdf, template, layout, debugOutput);
    pdf.save(filename);
  }

  private static embedFonts(pdf: jsPDF, template: PdfTemplate, content: PdfContent, debugOutput: boolean) {
    const fontMap: Map<string, Map<string, FontSpec>> = new Map();
    let regFunc = (fontSpec: FontSpec) => {
      if (!fontMap.has(fontSpec.name)) {
        fontMap.set(fontSpec.name, new Map());
      }
      const styleMap = fontMap.get(fontSpec.name)!;
      if (!styleMap.has(fontSpec.style)) {
        styleMap.set(fontSpec.style, fontSpec);
        fontSpec.embedFont(pdf);
      }
    };
    content.getMainContent().forEach(c => c.registerFonts(regFunc));
    content.getContentKeys().forEach(key => content.getContent(key).forEach(c => c.registerFonts(regFunc)));
    if (debugOutput) {
      regFunc(FontSpec.JETBRAINS_MONO);
    }
  }

  private static layoutPage(pdf: jsPDF, layout: RenderedLayout, section: PdfSection, state: LayoutState) {
    console.log('Layout page: ', state.currentPageNumber, ' in section ', section.id, ' (page in section: ', state.currentPageInSectionNumber, ')');
    const pageLayout: PageLayout = new PageLayout(layout, section, state.currentPageInSectionNumber, state.currentPageNumber);
    layout.addPageLayout(pageLayout);

    for (let fixedArea of section.fixedContentAreas.entries()) {
      let contentAreaId = fixedArea[0];
      ContentAreaRenderer.layoutContentArea(pdf, pageLayout, contentAreaId, fixedArea[1], state.getContentStream(contentAreaId), state, ContentAreaType.FIX);
    }
    ContentAreaRenderer.layoutContentArea(pdf, pageLayout, 'main', section.mainContentArea, state.getMainContentStream(), state, ContentAreaType.FLOATING);
  }

  private static renderLayout(pdf: jsPDF, template: PdfTemplate, layout: RenderedLayout, debugOutput?: boolean) {
    for (let pageLayout of layout.pageLayouts) {
      pdf.setPage(pageLayout.pageNumber);
      if (debugOutput) {
        PdfUtil.paintSectionBorders(pdf, pageLayout);
      }

      for (let layoutedElement of pageLayout.layoutedElements) {
        layoutedElement.render(pdf, debugOutput);
      }
    }
  }

  private static paintSectionBorders(pdf: jsPDF, pageLayout: PageLayout) {
    const section = pageLayout.section;
    pdf.setDrawColor('#c0c0c0');
    pdf.setLineWidth(0.1)
    pdf.setLineDashPattern([], 0);

    pdf.setFontSize(8);
    pdf.setFont(FontSpec.JETBRAINS_MONO.name, FontSpec.JETBRAINS_MONO.style);
    pdf.setTextColor('#c0c0c0');
    const fontkitFont = FontSpec.JETBRAINS_MONO.getFontkitFont();
    const dy = fontkitFont.ascent / fontkitFont.unitsPerEm * 8 / pdf.internal.scaleFactor;

    if (section.mainContentArea) {
      pdf.rect(section.mainContentArea.startXMM, section.mainContentArea.startYMM, section.mainContentArea.widthMM, section.mainContentArea.heightMM);
      pdf.text('main', section.mainContentArea.startXMM, section.mainContentArea.startYMM + dy, {
        align: 'left'
      });

    }
    for (let fixedAreaEntry of section.fixedContentAreas.entries()) {
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

  private _mainContentStream: ContentStream;

  constructor(content: PdfContent) {
    this._content = content;
    this._mainContentStream = new ContentStream(content.getMainContent());
  }

  getContentStream(id: string): ContentStream {
    return new ContentStream(this._content.getContent(id));
  }

  getMainContentStream(): ContentStream {
    return this._mainContentStream;
  }

  currentPageNumber: number = 1;
  currentPageInSectionNumber: number = 1;
  contentIndex: number = 0;
  currentSectionIndex: number = 0;
}