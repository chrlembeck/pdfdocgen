export class PageSize {

  static A0: PageSize = new PageSize(841, 1189);
  static A1: PageSize = new PageSize(594, 841);
  static A2: PageSize = new PageSize(420, 594);
  static A3: PageSize = new PageSize(297, 420);
  static A4: PageSize = new PageSize(210, 297);
  static A5: PageSize = new PageSize(148, 210);
  static A6: PageSize = new PageSize(105, 148);
  static A7: PageSize = new PageSize(74, 105);
  static A8: PageSize = new PageSize(52, 74);
  static A9: PageSize = new PageSize(37, 52);
  static A10: PageSize = new PageSize(26, 37);

  static B0: PageSize = new PageSize(1000, 1414);
  static B1: PageSize = new PageSize(707, 1000);
  static B2: PageSize = new PageSize(500, 707);
  static B3: PageSize = new PageSize(353, 500);
  static B4: PageSize = new PageSize(250, 353);
  static B5: PageSize = new PageSize(176, 250);
  static B6: PageSize = new PageSize(125, 176);
  static B7: PageSize = new PageSize(88, 125);
  static B8: PageSize = new PageSize(62, 88);
  static B9: PageSize = new PageSize(44, 62);
  static B10: PageSize = new PageSize(31, 44);

  static C0: PageSize = new PageSize(917, 1297);
  static C1: PageSize = new PageSize(648, 917);
  static C2: PageSize = new PageSize(458, 648);
  static C3: PageSize = new PageSize(324, 458);
  static C4: PageSize = new PageSize(229, 324);
  static C5: PageSize = new PageSize(162, 229);
  static C6: PageSize = new PageSize(114, 162);
  static C7: PageSize = new PageSize(81, 114);
  static C8: PageSize = new PageSize(57, 81);
  static C9: PageSize = new PageSize(40, 57);
  static C10: PageSize = new PageSize(28, 40);

  static D0: PageSize = new PageSize(771, 1090);
  static D1: PageSize = new PageSize(545, 771);
  static D2: PageSize = new PageSize(385, 545);
  static D3: PageSize = new PageSize(272, 385);
  static D4: PageSize = new PageSize(192, 272);
  static D5: PageSize = new PageSize(136, 192);
  static D6: PageSize = new PageSize(96, 136);
  static D7: PageSize = new PageSize(68, 96);
  static D8: PageSize = new PageSize(48, 68);
  static D9: PageSize = new PageSize(34, 48);
  static D10: PageSize = new PageSize(24, 34);

  static TABLOID_EXTRA: PageSize = new PageSize(304.8 , 457.29);
  static TABLOID_LEDGER: PageSize = new PageSize(279.4, 431.8);
  static LEGAL: PageSize = new PageSize(215.9, 355.6);
  static LEGAL_13: PageSize = new PageSize(215.9, 330.2);
  static LETTER: PageSize = new PageSize(215.9, 279.4);
  static EXECUTIVE: PageSize = new PageSize(184.2, 266.7);
  static STATEMENT_HALF_LETTER: PageSize = new PageSize(139.7, 215.9);
  static COMMERCIAL_10: PageSize = new PageSize(104.8, 241.3);
  static MONARCH: PageSize = new PageSize(98.4, 190.5);
  static CARD_5x7: PageSize = new PageSize(127.0, 177.8);
  static CARD_4x6: PageSize = new PageSize(101.6, 152.4);

  private _widthMM: number;

  private _heightMM: number;

  constructor(widthMM: number, heightMM: number) {
    this._widthMM = widthMM;
    this._heightMM = heightMM;
  }

  get widthMM(): number {
    return this._widthMM;
  }

  get heightMM(): number {
    return this._heightMM;
  }
}