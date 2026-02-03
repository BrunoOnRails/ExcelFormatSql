import React, { useState } from 'react';
import Header from './components/Header';
import BackButton from './components/BackButton';
import FileUploader from './components/FileUploader';
import ResultView from './components/ResultView';
import ColumnSelector from './components/ColumnSelector';
import { parseFile } from './services/excelService';
import { QuoteType, ParseResult } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rawData, setRawData] = useState<ParseResult | null>(null);
  const [finalData, setFinalData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quoteType, setQuoteType] = useState<QuoteType>(QuoteType.SINGLE);
  const [removeDots, setRemoveDots] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setRawData(null);
    setFinalData([]);
    
    try {
      const result = await parseFile(file);
      
      if (result.headers.length === 1) {
        extractColumnData(result, 0);
      } else {
        setRawData(result);
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao processar o arquivo.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractColumnData = (result: ParseResult, columnIndex: number) => {
    const extracted = result.data
      .map(row => row[columnIndex])
      .filter(val => val !== null && val !== undefined && val !== '')
      .map(val => String(val).trim())
      .filter(val => val.length > 0);

    if (extracted.length === 0) {
      setError(`A coluna "${result.headers[columnIndex]}" parece não ter dados válidos.`);
    } else {
      setFinalData(extracted);
      setRawData(null);
    }
  };

  const handleReset = () => {
    setRawData(null);
    setFinalData([]);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <BackButton />
        <Header />
        
        <main className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Configurações de Saída</h3>
                <p className="text-xs text-slate-500">Escolha o formato envolvente</p>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-2xl w-full sm:w-auto overflow-x-auto">
                <button 
                  onClick={() => setQuoteType(QuoteType.SINGLE)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    quoteType === QuoteType.SINGLE 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  'Item'
                </button>
                <button 
                  onClick={() => setQuoteType(QuoteType.DOUBLE)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    quoteType === QuoteType.DOUBLE 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  "Item"
                </button>
                <button 
                  onClick={() => setQuoteType(QuoteType.NONE)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    quoteType === QuoteType.NONE 
                      ? 'bg-white text-blue-600 shadow-md' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sem Aspas
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Limpar Pontos</h4>
                <p className="text-xs text-slate-500">Remover apenas "." do conteúdo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={removeDots}
                  onChange={(e) => setRemoveDots(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {!rawData && finalData.length === 0 && (
            <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
          )}

          {rawData && (
            <ColumnSelector 
              headers={rawData.headers} 
              onSelect={(index) => extractColumnData(rawData, index)}
              onCancel={handleReset}
            />
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in zoom-in duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
              <button onClick={handleReset} className="ml-auto text-xs underline font-bold">Tentar novamente</button>
            </div>
          )}

          {finalData.length > 0 && (
            <div className="space-y-4">
              <ResultView 
                items={finalData} 
                quoteType={quoteType} 
                removeDots={removeDots}
              />
              <div className="text-center">
                <button 
                  onClick={handleReset}
                  className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  ← Enviar outro arquivo
                </button>
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-20 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Excel & TXT Formatter Pro.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
