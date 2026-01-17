
import React from 'react';

interface ColumnSelectorProps {
  headers: string[];
  onSelect: (index: number) => void;
  onCancel: () => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ headers, onSelect, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Múltiplas colunas encontradas</h3>
          <p className="text-sm text-slate-500">Qual coluna você deseja extrair os dados?</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {headers.map((header, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 text-left transition-all group"
          >
            <div className="w-8 h-8 bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
              {String.fromCharCode(65 + index)}
            </div>
            <span className="font-semibold text-slate-700 truncate">{header}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColumnSelector;
