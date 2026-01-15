
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
      <div className="inline-flex items-center justify-center p-3 mb-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
        Excel Formatter Pro
      </h1>
      <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
        Converta colunas do Excel em listas formatadas separadas por vírgula e aspas. 
        Perfeito para desenvolvedores e analistas de dados.
      </p>
    </header>
  );
};

export default Header;
