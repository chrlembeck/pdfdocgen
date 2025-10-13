import fs from 'node:fs';
import {jsPDF} from 'jspdf';
import {PdfTemplate} from './template/PdfTemplate';
import {RenderedLayout} from './layout/RenderedLayout';
import {PdfSection} from './template/PdfSection';
import {SectionLayout} from './layout/SectionLayout';
import {PdfContent} from './document/PdfContent';
import {ContentAreaType} from './template/ContentAreaType';
import {ContentArea} from './template/ContentArea';
import {PageLayout} from './layout/PageLayout';
import {LayoutedText} from './layout/LayoutedText';
import {FontSpec} from './FontSpec';

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

    let currentPageNumber = 1;
    for (let sectionIdx = 0; sectionIdx < template.sections.length; sectionIdx++) {
      const section: PdfSection = template.sections[sectionIdx];
      if (sectionIdx > 0) {
        pdf.addPage([section.size.widthMM, section.size.heightMM], section.orientation === 'portrait' ? 'portrait' : 'landscape');
      }

      this.layoutSection(pdf, layout, section, content, currentPageNumber);
      currentPageNumber = layout.pageCount + 1;
    }
    console.log("Rendered layout: ", layout);

    PdfUtil.renderLayout(pdf, template, layout, debugOutput);

    pdf.save(filename);
  }

  private static layoutSection(pdf: jsPDF, layout: RenderedLayout, section: PdfSection, content: PdfContent, firstPageNumber: number) {
    console.log('Layout section: ', section.id, ' starting at page ', firstPageNumber);
    const sectionLayout = new SectionLayout(layout, section);
    layout.addSectionLayout(sectionLayout);

    if (section.mainContentArea) {
      PdfUtil.layoutContentArea(pdf, sectionLayout, section.mainContentArea, content, firstPageNumber, ContentAreaType.FLOATING);
    }

    let currentPageNumber = firstPageNumber;
    for (let pageLayout of sectionLayout.pageLayouts) {
      for (let fixedArea of section.fixedContentAreas) {
        PdfUtil.layoutContentArea(pdf, sectionLayout, fixedArea, content, currentPageNumber, ContentAreaType.FIX);
      }
      currentPageNumber++;
    }
  }

  private static layoutContentArea(pdf: jsPDF, sectionLayout: SectionLayout, contentArea: ContentArea, content: PdfContent, pageNumber: number, areaType: ContentAreaType) {
    console.log('Layout content area: ', contentArea.id, ' on page ', pageNumber, ' type ', areaType);

    let pageNumberInSection = 1;
    let layoutedText = new LayoutedText(contentArea.startXMM, contentArea.startyMM, contentArea.id, 'left', 0, FontSpec.LIBRE_BASKERVILLE, 8);
    sectionLayout.registerFont(FontSpec.LIBRE_BASKERVILLE);
    if (areaType == ContentAreaType.FLOATING) {
      const pageLayout = new PageLayout(sectionLayout, pageNumberInSection, pageNumberInSection + pageNumber - 1);
      sectionLayout.addPageLayout(pageLayout);
      pageLayout.addLayoutedElement(layoutedText);

    } else {
      sectionLayout.pageLayouts[pageNumber - 1].addLayoutedElement(layoutedText);
    }
  }

  private static renderLayout(pdf: jsPDF, template: PdfTemplate, layout: RenderedLayout, debugOutput?: boolean) {
    if (debugOutput) {
      layout.registerFont(FontSpec.JETBRAINS_MONO);
    }
    layout.registeredFonts.forEach(font => {font.embedFont(pdf)});

    for (let section of template.sections) {
      const sectionLayout: SectionLayout = layout.sectionLayouts.get(section.id)!;
      for (let pageLayout of sectionLayout.pageLayouts) {
        pdf.setPage(pageLayout.pageNumber);
        if (debugOutput) {
          PdfUtil.paintSectionBorders(pdf, pageLayout);
        }

        for (let layoutedElement of pageLayout.layoutedElements) {
          layoutedElement.render(pdf);
        }
      }
    }
  }

  private static paintSectionBorders(pdf: jsPDF, pageLayout: PageLayout) {
    const section = pageLayout.sectionLayout.section;
    pdf.setDrawColor('#c0c0c0');
    pdf.setLineWidth(0.1)
    pdf.setLineDashPattern([], 0);

    pdf.setFontSize(8);
    pdf.setFont(FontSpec.JETBRAINS_MONO.name, FontSpec.JETBRAINS_MONO.style);
    pdf.setTextColor('#c0c0c0');
    const fontkitFont = FontSpec.JETBRAINS_MONO.getFontkitFont();
    const dy = fontkitFont.ascent /fontkitFont.unitsPerEm * 8 / pdf.internal.scaleFactor;

    if (section.mainContentArea) {
      pdf.rect(section.mainContentArea.startXMM, section.mainContentArea.startyMM, section.mainContentArea.widthMM, section.mainContentArea.heightMM);
      pdf.text(section.mainContentArea.id, section.mainContentArea.startXMM, section.mainContentArea.startyMM + dy, {
        align: 'left'
      });

    }
    for (let fixedArea of section.fixedContentAreas) {
      pdf.rect(fixedArea.startXMM, fixedArea.startyMM, fixedArea.widthMM, fixedArea.heightMM);
      pdf.text(fixedArea.id, fixedArea.startXMM, fixedArea.startyMM + dy, {
        align: 'left'
      });
    }
  }

  private static validateTemplate(template: PdfTemplate) {
    if (!template.sections || template.sections.length === 0) {
      throw new Error('Template must contain at least one section.');
    }
    const contentIds = new Set<string>();

    for (let sectionIdx = 0; sectionIdx < template.sections.length; sectionIdx++) {
      const section = template.sections[sectionIdx];
      if (section.mainContentArea) {
        if (contentIds.has(section.mainContentArea.id)) {
          throw new Error("Duplicate content area id: " + section.mainContentArea.id);
        }
      }
      for (let fixedArea of section.fixedContentAreas) {
        if (contentIds.has(fixedArea.id)) {
          throw new Error("Duplicate content area id: " + fixedArea.id);
        }
      }
    }
  }
}