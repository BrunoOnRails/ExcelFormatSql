
import React, { useState } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ResultView from './components/ResultView';
import { parseFile } from './services/excelService';
import { QuoteType } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [quoteType, setQuoteType] = useState<QuoteType>(QuoteType.SINGLE);
  const [removeDots, setRemoveDots] = useState(false);
  const [onlyNumbers, setOnlyNumbers] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await parseFile(file);
      if (result.data.length === 0) {
        setError("O arquivo parece estar vazio ou não contém dados válidos.");
        setData([]);
      } else {
        setData(result.data);
      }
    } catch (err: any) {
      setError(err.message || "Erro desconhecido ao processar o arquivo.");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Header />

        <main className="space-y-8">
          {/* Settings Section */}
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

            <div className="pt-4 border-t border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Limpar Pontos</h4>
                  <p className="text-xs text-slate-500">Remover apenas "."</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={removeDots}
                    onChange={(e) => {
                      setRemoveDots(e.target.checked);
                      if (e.target.checked) setOnlyNumbers(false);
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Apenas Números</h4>
                  <p className="text-xs text-slate-500">Extrair apenas dígitos (0-9)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={onlyNumbers}
                    onChange={(e) => {
                      setOnlyNumbers(e.target.checked);
                      if (e.target.checked) {
                        setRemoveDots(false);
                        setQuoteType(QuoteType.NONE);
                      }
                    }}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>

          <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in zoom-in duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {data.length > 0 && (
            <ResultView 
              items={data} 
              quoteType={quoteType} 
              removeDots={removeDots}
              onlyNumbers={onlyNumbers}
            />
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
