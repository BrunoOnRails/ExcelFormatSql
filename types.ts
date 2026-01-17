
export interface ExcelRow {
  [key: string]: any;
}

export interface ParseResult {
  data: any[][]; // Agora retorna a matriz de dados
  headers: string[]; // Nomes das colunas encontrados
  sheetName: string;
}

export enum QuoteType {
  SINGLE = "'",
  DOUBLE = '"',
  NONE = ""
}
