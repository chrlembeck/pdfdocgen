import {jsPDF} from 'jspdf';

export class LineStyle {

  private readonly _lineWidth: number;

  private readonly _lineColor: string;

  private readonly _joinStyle: 'miter' | 'round' | 'bevel';

  private readonly _capStyle: 'butt' | 'round' | 'square';

  private readonly _lineMiterLimit: number;

  /**
   * Empty array means solid line.
   * First element: length of the dashes.
   * Second element: length of the gaps.
   * If second element is missing. the gaps are as long as the dashes.
   *
   * @private
   */
  private readonly _dashArray: number[];

  private readonly _dashPhase: number;

  constructor(lineColor: string = '#000000',
              lineWidth: number = 1,
              capStyle: 'butt' | 'round' | 'square' = 'round',
              joinStyle: 'miter' | 'round' | 'bevel' = 'round',
              lineMiterLimit: number = 1,
              dashArray: number[] = [],
              dashPhase: number = 0,
  ) {
    this._lineColor = lineColor;
    this._lineWidth = lineWidth;
    this._joinStyle = joinStyle;
    this._capStyle = capStyle;
    this._lineMiterLimit = lineMiterLimit;
    this._dashArray = dashArray;
    this._dashPhase = dashPhase;
  }

  setStyle(pdf: jsPDF): void {
    pdf.setDrawColor(this._lineColor);
    pdf.setLineWidth(this._lineWidth);
    pdf.setLineCap(this._capStyle);
    pdf.setLineJoin(this._joinStyle);
    pdf.setLineMiterLimit(this._lineMiterLimit);
    pdf.setLineDashPattern(this._dashArray, this._dashPhase);
  }
}