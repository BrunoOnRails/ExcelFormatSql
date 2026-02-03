import React from 'react';

interface BackButtonProps {
  url?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ url = 'https://brunosilva.dev' }) => {
  return (
    <div className="flex justify-start mb-6">
      <button 
        onClick={() => window.location.href = url}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Voltar ao Início
      </button>
    </div>
  );
};

export default BackButton;
