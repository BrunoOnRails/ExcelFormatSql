
import React, { useState, useEffect } from 'react';

interface ResultViewProps {
  items: string[];
  quoteType: string;
  removeDots: boolean;
  onlyNumbers: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ items, quoteType, removeDots, onlyNumbers }) => {
  const [copied, setCopied] = useState(false);
  const [formattedText, setFormattedText] = useState('');

  const processItem = (item: string) => {
    let processed = item;
    
    if (onlyNumbers) {
      // Remove tudo que não for dígito
      processed = processed.replace(/\D/g, '');
    } else if (removeDots) {
      // Remove apenas pontos
      processed = processed.replace(/\./g, '');
    }
    
    return `${quoteType}${processed}${quoteType}`;
  };

  useEffect(() => {
    const text = items
      .map(processItem)
      .filter(item => {
        // Se estivermos em modo "apenas números", filtramos itens que ficaram vazios (não tinham números)
        if (onlyNumbers) {
          const val = item.replace(new RegExp(`[${quoteType},]`, 'g'), '');
          return val.length > 0;
        }
        return true;
      })
      .join(',');
    setFormattedText(text);
  }, [items, quoteType, removeDots, onlyNumbers]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Resultado
          <span className="text-sm font-normal bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
            {items.length} itens encontrados
          </span>
        </h2>
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
            copied 
              ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
          }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copiado!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copiar Tudo
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-slate-900 rounded-3xl blur-sm opacity-5"></div>
        <textarea
          readOnly
          className="relative w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-3xl font-mono text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none overflow-y-auto"
          value={formattedText}
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <p className="w-full text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pré-visualização dos Itens:</p>
        {items.slice(0, 10).map((item, idx) => {
           const preview = processItem(item);
           return (
            <span key={idx} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs shadow-sm">
              {preview}
            </span>
           );
        })}
        {items.length > 10 && (
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs italic">
            + {items.length - 10} mais...
          </span>
        )}
      </div>
    </div>
  );
};

export default ResultView;
