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
import {PageInfo} from './document/PdfContentSupplier.js';
import {base64ArrayBuffer} from './MiscUtil.js';
import {LayoutState} from './layout/LayoutState.js';


export function embedFont(pdf: jsPDF, fontPath: string, embeddedFilename: string, fontName: string, fontStyle: string) {
  console.log('Embedding Font: ' + fontName + ' - ' + fontStyle);
  const buffer = fs.readFileSync(fontPath)
  const base64 = base64ArrayBuffer(buffer);

  pdf.addFileToVFS(embeddedFilename, base64);
  pdf.addFont(embeddedFilename, fontName, fontStyle);
  pdf.setFont(fontName, fontStyle);
}

export function renderDocumentToFile(template: PdfTemplate, content: PdfContent, filename: string, debugOutput ?: boolean): void {
  renderDocument(template, content, debugOutput).save(filename);
}

function renderDocument(template: PdfTemplate, content: PdfContent, debugOutput ?: boolean): jsPDF {
  validateTemplate(template);
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
    layoutPage(pdf, layout, section, state);
    state.currentPageNumber++;
    state.currentPageInSectionNumber++;
    if (section.numberOfPages && section.numberOfPages < state.currentPageInSectionNumber) {
      state.currentSectionIndex++;
      state.currentPageInSectionNumber = 1
    }
  } while (!state.getMainContentStream().isEmpty());

  renderLayout(pdf, layout, debugOutput);
  return pdf;
}

function layoutPage(pdf: jsPDF, layout: RenderedLayout, section: PdfSection, state: LayoutState) {
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

function renderLayout(pdf: jsPDF, layout: RenderedLayout, debugOutput?: boolean) {
  for (const pageLayout of layout.pageLayouts) {
    pdf.setPage(pageLayout.pageNumber);

    if (debugOutput) {
      paintSectionBorders(pdf, pageLayout);
    }

    for (const layoutedElement of pageLayout.layoutedElements) {
      layoutedElement.render(pdf, debugOutput);
    }
  }
}

function paintSectionBorders(pdf: jsPDF, pageLayout: PageLayout) {
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

function validateTemplate(template: PdfTemplate) {
  if (!template.sections || template.sections.length === 0) {
    throw new Error('Template must contain at least one section.');
  }
}
