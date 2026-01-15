
import * as XLSX from 'xlsx';
import { ParseResult } from '../types';

/**
 * Processa arquivos Excel ou TXT e extrai os valores.
 * @param file O arquivo enviado pelo usuário
 * @returns Uma promessa com os dados formatados
 */
export const parseFile = async (file: File): Promise<ParseResult> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension === 'txt') {
    return parseTextFile(file);
  }

  return parseExcelFile(file);
};

const parseTextFile = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Divide por quebra de linha, remove espaços e filtra vazios
        const lines = content
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        resolve({
          data: lines,
          sheetName: 'Arquivo de Texto'
        });
      } catch (error) {
        reject(new Error("Erro ao processar o arquivo de texto."));
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsText(file);
  });
};

const parseExcelFile = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const flattenedData: string[] = jsonData
          .flat()
          .filter(val => val !== null && val !== undefined && val !== '')
          .map(val => String(val).trim())
          .filter(val => val.length > 0);

        resolve({
          data: flattenedData,
          sheetName: firstSheetName
        });
      } catch (error) {
        reject(new Error("Falha ao processar o arquivo Excel."));
      }
    };

    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsArrayBuffer(file);
  });
};
