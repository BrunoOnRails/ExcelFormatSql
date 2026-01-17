
import * as XLSX from 'xlsx';
import { ParseResult } from '../types';

/**
 * Processa arquivos Excel ou TXT e extrai os valores estruturados.
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
        const lines = content
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        resolve({
          data: lines.map(line => [line]), // Formato de matriz para consistência
          headers: ['Linha de Texto'],
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
        
        // Obtém os dados como matriz (array de arrays)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length === 0) {
          throw new Error("Planilha vazia.");
        }

        // Assume que a primeira linha com dados são os cabeçalhos
        const headers = jsonData[0].map((h, i) => h ? String(h) : `Coluna ${i + 1}`);
        const rows = jsonData.slice(1); // O restante são os dados

        resolve({
          data: rows,
          headers: headers,
          sheetName: firstSheetName
        });
      } catch (error) {
        reject(new Error("Falha ao processar o arquivo Excel. Verifique se há dados."));
      }
    };

    reader.onerror = () => reject(new Error("Erro ao ler o arquivo."));
    reader.readAsArrayBuffer(file);
  });
};
