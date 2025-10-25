import {Token} from '../document/Token.js';

export interface LineToken {
  token: Token;
  widthMM: number;
  widthWithoutTrailingWhitespaceMM: number;
  heightMM: number;
  baselineOffsetMM: number;
}