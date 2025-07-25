const EmailTextarea = ({ value, onChange, disabled, label = "Email Content", required = false }) => {
  return (
    <div className="mb-6">
      <label htmlFor="email-input" className="block text-sm font-semibold text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id="email-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`${required ? 'Required: ' : ''}Paste or type your email message here...`}
        className={`
          w-full h-64 p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl 
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
          resize-none transition-all duration-200 custom-scrollbar
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${required && !value.trim() ? 'border-red-300 bg-red-50' : ''}
        `}
        style={{ minHeight: '200px' }}
      />
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-gray-500">
          {value.length} characters
        </p>
        {value.length > 0 && (
          <p className="text-sm text-gray-500">
            ~{Math.ceil(value.split(' ').length / 200)} minute read
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailTextarea;