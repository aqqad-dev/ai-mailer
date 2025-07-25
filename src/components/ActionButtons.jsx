import { useState } from 'react';

const ActionButtons = ({ onAction, disabled, loading, currentAction }) => {
  const [expandedButton, setExpandedButton] = useState(null);
  const [selectedTones, setSelectedTones] = useState({
    reply: 'professional',
    improve: 'professional'
  });

  const tones = [
    { id: 'professional', label: 'Professional' },
    { id: 'friendly', label: 'Friendly' },
    { id: 'persuasive', label: 'Persuasive' },
    { id: 'informative', label: 'Informative' },
    { id: 'apologetic', label: 'Apologetic' },
    { id: 'thankful', label: 'Thankful' }
  ];

  const buttons = [
    {
      id: 'reply',
      label: 'Generate Reply',
      icon: '↩️',
      color: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
      hasToneSelector: true,
    },
    {
      id: 'summarize',
      label: 'Summarize Email',
      icon: '📝',
      color: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
      hasToneSelector: false,
    },
    {
      id: 'improve',
      label: 'Improve Draft',
      icon: '✨',
      color: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      hasToneSelector: true,
    },
  ];

  const handleButtonClick = (button) => {
    if (button.hasToneSelector) {
      if (expandedButton === button.id) {
        // Execute action with selected tone
        onAction(button.id, selectedTones[button.id]);
        setExpandedButton(null);
      } else {
        // Expand tone selector
        setExpandedButton(button.id);
      }
    } else {
      // Execute action immediately for buttons without tone selector
      onAction(button.id);
    }
  };

  const handleToneSelect = (buttonId, toneId) => {
    setSelectedTones(prev => ({
      ...prev,
      [buttonId]: toneId
    }));
  };

  const handleClickOutside = () => {
    setExpandedButton(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {buttons.map((button) => (
        <div key={button.id} className="relative">
          <button
            onClick={() => handleButtonClick(button)}
            disabled={disabled}
            className={`
              ${button.color}
              text-white font-semibold py-4 px-6 rounded-xl shadow-lg
              focus:outline-none focus:ring-2 focus:ring-offset-2
              transition-all duration-300 transform w-full
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              ${!disabled ? 'hover:scale-105 hover:shadow-xl active:scale-95' : ''}
              ${loading && currentAction === button.id ? 'opacity-75' : ''}
              ${expandedButton === button.id ? 'rounded-b-none shadow-none' : ''}
            `}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">{button.icon}</span>
              <span>
                {expandedButton === button.id 
                  ? `${button.label} (${tones.find(t => t.id === selectedTones[button.id])?.label})`
                  : button.label
                }
              </span>
              {loading && currentAction === button.id && (
                <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {button.hasToneSelector && (
                <span className={`ml-2 transition-transform duration-300 ${expandedButton === button.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              )}
            </div>
          </button>

          {/* Sliding Tone Selector */}
          {button.hasToneSelector && (
            <div className={`
              absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-xl shadow-lg z-10
              transition-all duration-300 ease-in-out overflow-hidden
              ${expandedButton === button.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Select tone:</p>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => handleToneSelect(button.id, tone.id)}
                      className={`
                        p-3 rounded-lg border-2 transition-all duration-200 text-left
                        ${selectedTones[button.id] === tone.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-800">{tone.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onAction(button.id, selectedTones[button.id]);
                      setExpandedButton(null);
                    }}
                    className={`
                      w-full py-2 px-4 rounded-lg font-medium transition-all duration-200
                      ${button.color.replace('hover:bg-', 'bg-').replace('focus:ring-', 'hover:bg-')}
                      text-white hover:shadow-md
                    `}
                  >
                    Generate with {tones.find(t => t.id === selectedTones[button.id])?.label} tone
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Backdrop to close expanded selector */}
      {expandedButton && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={handleClickOutside}
        />
      )}
    </div>
  );
};

export default ActionButtons;