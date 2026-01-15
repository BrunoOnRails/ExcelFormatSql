
export interface ExcelRow {
  [key: string]: any;
}

export interface ParseResult {
  data: string[];
  sheetName: string;
}

export enum QuoteType {
  SINGLE = "'",
  DOUBLE = '"',
  NONE = ""
}
