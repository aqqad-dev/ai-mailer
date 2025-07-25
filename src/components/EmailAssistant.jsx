import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ResponseBox from './ResponseBox';
import ActionButtons from './ActionButtons';
import EmailTextarea from './EmailTextarea';
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const EmailAssistant = () => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentAction, setCurrentAction] = useState('');

  const handleActionClick = (action, tone = '') => {
    if (!emailText.trim()) return;
    handleApiCall(action, tone);
  };

  const handleApiCall = async (action, tone = '') => {
    if (!emailText.trim()) return;

    setLoading(true);
    setError('');
    setCurrentAction(action);
    setResponse('');

    try {
      // Note: Replace with your actual Gemini API endpoint and key
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      let prompt = '';
      const toneInstruction = tone ? ` in a ${tone} tone` : '';
      
      switch (action) {
        case 'reply':
          prompt = `Write a ${toneInstruction} email reply to respond to the following message.
                    ${emailSubject ? `Original subject: "${emailSubject}"` : 'No subject provided'}
                    Original message:
                    """
                    ${emailText}
                    """
                    Create an appropriate subject line for your reply and write a ${toneInstruction} response. Maintain the same language as the original message.
                    Output exactly in this format:
                    Subject: [your reply subject line]
                    Body: [your reply email content starting with greeting and ending with closing]`;
          break;
        case 'summarize':
          prompt = `Summarize the following email${emailSubject ? ` (Subject: "${emailSubject}")` : ''} in 2-3 concise sentences.
                    Email content:
                    """
                    ${emailText}
                    """
                    Focus only on the substantive content - the main purpose, key information, and any required actions. Exclude greetings, pleasantries, thank-yous, and sign-offs. Write as a brief paragraph in the same language as the original email.`;
          break;
        case 'improve':
          prompt = `Rewrite this email draft to be more ${toneInstruction}, clear, and well-structured.
                    ${emailSubject ? `Current subject: "${emailSubject}"` : 'No subject provided'}
                    Draft:
                    """
                    ${emailText}
                    """
                    Instructions:
                    - If the draft is a brief phrase or incomplete thought, expand it into a complete email with proper greeting, body paragraphs, and closing
                    - If the draft is already an email, improve its grammar, clarity, structure, ${toneInstruction} tone, and conciseness
                    - Maintain the same language as the original draft
                    - Work only with the information provided - do not add placeholders, brackets, or instructions for the user to fill in
                    - If details are vague, keep them vague rather than adding placeholder text
                    - ${!emailSubject ? 'Create an appropriate subject line' : 'Revise the subject if needed'}

                    Output exactly in this format:
                    Subject: [your improved subject line]
                    Body: [your complete email content]`;
          break;
      }

      const result = await model.generateContent(prompt);
      const resp = await result.response;
      const text = resp.text();
      
      setResponse(text);

    } catch (err) {
      setError(`Failed to process request: ${err.message}. Please check your API key and try again.`);
    } finally {
      setLoading(false);
      setCurrentAction('');
    }
  };

  const handleClearAll = () => {
    setEmailSubject('');
    setEmailText('');
    setResponse('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with branding */}
        <div className="text-center mb-10">
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-3xl"></div>
            </div>
            
            {/* Main header content */}
            <div className="relative z-10 flex flex-col items-center space-y-6">
              {/* Logo/Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              
              {/* Main title */}
              <div className="text-center">
                <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-2 tracking-tight">
                  AI Mailer
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4"></div>
              </div>
              
              {/* Subtitle with enhanced styling */}
              <div className="max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed mb-6">
                  Transform your email communication with 
                  <span className="font-semibold text-indigo-600"> AI-powered assistance</span>
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Generate intelligent replies, create concise summaries, and enhance your drafts with advanced artificial intelligence
                </p>
              </div>
              
              {/* Creator credit with enhanced design */}
              <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-indigo-200 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Created by Mohamed Yassine Aqqad
                </p>
              </div>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm font-medium text-indigo-700">Smart Replies</span>
                </div>
                <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-700">Email Summaries</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-purple-700">Draft Enhancement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
          {/* Email Subject Field */}
          <div className="mb-6">
            <label htmlFor="email-subject" className="block text-sm font-semibold text-gray-700 mb-3">
              Email Subject <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="email-subject"
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              disabled={loading}
              placeholder="Enter email subject line..."
              className={`
                w-full p-4 text-gray-700 bg-gray-50 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                transition-all duration-200
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
              `}
            />
          </div>

          <EmailTextarea 
            value={emailText}
            onChange={setEmailText}
            disabled={loading}
            label="Email Content"
            required={true}
          />

          <ActionButtons 
            onAction={handleActionClick}
            disabled={!emailText.trim() || loading}
            loading={loading}
            currentAction={currentAction}
          />

          {loading && <LoadingSpinner action={currentAction} />}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <ResponseBox response={response} />

          {(emailSubject || emailText || response || error) && (
            <div className="mt-6 text-center">
              <button
                onClick={handleClearAll}
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* API Key Notice 
        <div className="mt-6 text-center">
          <div className="inline-block bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
            <p className="text-sm text-amber-700">
              <span className="font-medium">⚠️ Setup Required:</span> Add your Gemini API key in EmailAssistant.jsx to enable AI features
            </p>
          </div>
        </div> */}

        {/* Footer */}
        <footer className="mt-12 bg-gray-900 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-300">yassine.aqqad@gmail.com</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-300">Global Remote</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Support</p>
                <p className="text-sm text-gray-300">24/7 Available</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                2025 AI Mailer by Mohamed Yassine Aqqad.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EmailAssistant;