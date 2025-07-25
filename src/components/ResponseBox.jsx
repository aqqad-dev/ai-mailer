import { useState } from 'react';

const ResponseBox = ({ response }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (!response) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          AI Response
        </label>
        <button
          onClick={handleCopy}
          className={`
            px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${copySuccess 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            {copySuccess ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </div>
        </button>
      </div>
      
      <div className="relative">
        <textarea
          value={response}
          readOnly
          className="w-full h-48 p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-gray-800 resize-none custom-scrollbar"
          style={{ minHeight: '150px' }}
        />
        <div className="absolute top-2 right-2">
          <div className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md font-medium">
            AI Generated
          </div>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
        <span>{response.length} characters</span>
        <span>~{Math.ceil(response.split(' ').length / 200)} minute read</span>
      </div>
    </div>
  );
};

export default ResponseBox;