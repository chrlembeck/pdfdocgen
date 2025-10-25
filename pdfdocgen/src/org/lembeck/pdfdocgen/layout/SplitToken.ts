import {LineToken} from './LineToken.js';
import {Token} from '../document/Token.js';

export interface SplitToken {
  first: LineToken,
  remaining?: Token
}