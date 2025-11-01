import fs from 'node:fs';
import {jsPDF} from 'jspdf';
import {PdfTemplate} from './template/PdfTemplate.js';
import {RenderedLayout} from './layout/RenderedLayout.js';
import {PdfSection} from './template/PdfSection.js';
import {PdfContentMap} from './document/PdfContentMap.js';
import {ContentAreaType} from './template/ContentAreaType.js';
import {PageLayout} from './layout/PageLayout.js';
import {FontSpec} from './FontSpec.js';
import {layoutContentArea} from './rendering/ContentAreaRenderer.js';
import {PageInfo} from './document/PdfContentSupplier.js';
import {base64ArrayBuffer} from './MiscUtil.js';
import {LayoutState} from './layout/LayoutState.js';
import {LayoutResult} from './layout/LayoutResult.js';


export function embedFont(pdf: jsPDF, fontData: Buffer<ArrayBuffer>, embeddedFilename: string, fontName: string, fontStyle: string) {
  console.log('Embedding Font: ' + fontName + ' - ' + fontStyle);
  const base64 = base64ArrayBuffer(fontData);

  pdf.addFileToVFS(embeddedFilename, base64);
  pdf.addFont(embeddedFilename, fontName, fontStyle);
  pdf.setFont(fontName, fontStyle);
}

export function renderDocumentToFile(template: PdfTemplate, content: PdfContentMap, filename: string, debugOutput ?: boolean): void {
  renderDocument(template, content, debugOutput).save(filename);
}

function setTotalNumberOfPagesInSection(pageLayouts: PageLayout[], totalNumberOfPagesInSection: number) {
  for (let i = 1; i <= totalNumberOfPagesInSection; i++) {
    pageLayouts[pageLayouts.length - i].totalNumberOfPagesInSection = totalNumberOfPagesInSection;
  }
}

function renderDocument(template: PdfTemplate, content: PdfContentMap, debugOutput ?: boolean): jsPDF {
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

  const state = new LayoutState(content, 0, template.sections[0].id);
  do {
    const section: PdfSection = template.sections[state.currentSectionIndex];

    if (state.currentPageNumber > 1) {
      pdf.addPage([section.size.widthMM, section.size.heightMM], section.orientation === 'portrait' ? 'portrait' : 'landscape');
    }
    const layoutResult = layoutPageMainContent(pdf, layout, section, state);
    if (layoutResult.newSectionId) {
      // Sprung in eine andere Section
      state.currentSectionId = layoutResult.newSectionId;
      state.currentSectionIndex = template.findSectionIndexById(layoutResult.newSectionId);
      setTotalNumberOfPagesInSection(layout.pageLayouts, state.currentPageInSectionNumber);
      state.currentPageInSectionNumber = 1
    } else if (layoutResult.newSectionIndex) {
      // Sprung in die nächste Section
      if (layoutResult.newSectionIndex >= template.sections.length) {
        throw new Error('No such section index: ' + layoutResult.newSectionIndex);
      }
      state.currentSectionIndex = layoutResult.newSectionIndex;
      state.currentSectionId = template.sections[layoutResult.newSectionIndex].id;
      setTotalNumberOfPagesInSection(layout.pageLayouts, state.currentPageInSectionNumber);
      state.currentPageInSectionNumber = 1
    } else if (section.numberOfPages && section.numberOfPages <= state.currentPageInSectionNumber) {
      // automatischer Wechsel in die nächste Section.
      setTotalNumberOfPagesInSection(layout.pageLayouts, state.currentPageInSectionNumber);
      state.currentSectionIndex++;
      state.currentSectionId = template.sections[state.currentSectionIndex].id;
      state.currentPageInSectionNumber = 1
    } else {
      state.currentPageInSectionNumber++;
    }
    state.currentPageNumber++;
  } while (!state.getMainContentStream().isEmpty());
  state.currentPageInSectionNumber--;

  // Totalanzahl der Seiten in den pageLayouts setzen
  for (let pageIndex = 0; pageIndex < layout.pageCount; pageIndex++) {
    layout.pageLayouts[pageIndex].totalNumberOfPages = layout.pageCount;
  }

  // Totalanzahl der Seiten im letzten Abschnitt setzen
  setTotalNumberOfPagesInSection(layout.pageLayouts, state.currentPageInSectionNumber);

  // Layout der fixen Sections der Seiten berechnen
  for (let pageNumber = 1; pageNumber <= layout.pageCount; pageNumber++) {
    state.currentPageNumber = pageNumber;
    layoutPageFixedSections(pdf, layout, state);
  }

  renderLayout(pdf, layout, debugOutput);
  return pdf;
}

function layoutPageMainContent(pdf: jsPDF, layout: RenderedLayout, section: PdfSection, state: LayoutState): LayoutResult {
  console.log('Layout page: ', state.currentPageNumber, ' in section ', section.id, ' (page in section: ', state.currentPageInSectionNumber, ')');
  const pageLayout: PageLayout = new PageLayout(layout, section, state.currentPageInSectionNumber, state.currentPageNumber);
  layout.addPageLayout(pageLayout);

  for (const element of section.graphicElements) {
    pageLayout.addLayoutedElement(element);
  }

  return layoutContentArea(pdf, pageLayout, 'main', section.mainContentArea, state.getMainContentStream(), state, ContentAreaType.FLOATING);
}

function layoutPageFixedSections(pdf: jsPDF, layout: RenderedLayout, state: LayoutState) {
  const pageLayout: PageLayout = layout.pageLayouts[state.currentPageNumber - 1];
  const section = pageLayout.section;
  console.log('Layout page: ', state.currentPageNumber, ' in section ', section.id, ' (page in section: ', state.currentPageInSectionNumber, ')');

  for (const fixedArea of section.fixedContentAreas.entries()) {
    const contentAreaId = fixedArea[0];
    const pageInfo: PageInfo = new PageInfo(state.currentPageNumber, state.currentPageInSectionNumber, section.id);
    layoutContentArea(pdf, pageLayout, contentAreaId, fixedArea[1], state.getContentStream(contentAreaId, pageInfo), state, ContentAreaType.FIX);
  }
}

function renderLayout(pdf: jsPDF, layout: RenderedLayout, debugOutput?: boolean) {
  for (const pageLayout of layout.pageLayouts) {
    pdf.setPage(pageLayout.pageNumber);

    if (debugOutput) {
      paintSectionDebugBorders(pdf, pageLayout);
    }
    paintSectionBorders(pdf, pageLayout);

    for (const layoutedElement of pageLayout.layoutedElements) {
      layoutedElement.render(pdf, debugOutput);
    }
  }
}

function paintSectionDebugBorders(pdf: jsPDF, pageLayout: PageLayout) {
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

function paintSectionBorders(pdf: jsPDF, pageLayout: PageLayout) {
  const section = pageLayout.section;

  if (section.mainContentArea && section.mainContentArea.borderStyle && section.mainContentArea.borderStyle.lineWidth > 0) {
    section.mainContentArea.borderStyle.setStyle(pdf);
    pdf.rect(section.mainContentArea.startXMM, section.mainContentArea.startYMM, section.mainContentArea.widthMM, section.mainContentArea.heightMM);
  }
  for (const fixedArea of section.fixedContentAreas.values()) {
    if (fixedArea.borderStyle && fixedArea.borderStyle.lineWidth > 0) {
      fixedArea.borderStyle.setStyle(pdf);
      pdf.rect(fixedArea.startXMM, fixedArea.startYMM, fixedArea.widthMM, fixedArea.heightMM);
    }
  }
}

function validateTemplate(template: PdfTemplate) {
  if (!template.sections || template.sections.length === 0) {
    throw new Error('Template must contain at least one section.');
  }
}
