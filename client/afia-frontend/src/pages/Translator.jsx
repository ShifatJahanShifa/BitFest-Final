import React, { useState } from 'react';
import axios from 'axios';

function Translator() {
  const [inputLanguage, setInputLanguage] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const translate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:8000/translator/translate',
        null,  // No body data, we are sending data as query parameters
        {
          params: {
            input_language: inputLanguage,
            output_language: outputLanguage,
            text: text,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      setError('An error occurred during translation.');
      console.error('Error during translation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Language Translator</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600">Input Language (e.g., en)</label>
            <input
              type="text"
              placeholder="Enter Input Language"
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-600">Output Language (e.g., es)</label>
            <input
              type="text"
              placeholder="Enter Output Language"
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-600">Text to Translate</label>
            <textarea
              placeholder="Enter the text you want to translate"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={translate}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg focus:outline-none hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-center">
              <p>{error}</p>
            </div>
          )}

          {translatedText && !loading && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800">Translated Text:</h3>
              <p className="mt-2 text-gray-600">{translatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Translator;
