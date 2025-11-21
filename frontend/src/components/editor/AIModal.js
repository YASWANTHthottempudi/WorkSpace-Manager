'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import Button from '@/components/ui/Button';

export default function AIModal({ isOpen, onClose, type, content }) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content || content.trim().length === 0) {
      setError('No content available to process. Please add some content to the page first.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      let result;

      if (type === 'summarize') {
        // Call summarize API
        const response = await axios.post('/api/ai/summarize', {
          content: content,
        });
        result = response.data.summary;
      } else if (type === 'ask') {
        if (!input || input.trim().length === 0) {
          setError('Please enter a question');
          setLoading(false);
          return;
        }
        // Call query API
        const response = await axios.post('/api/ai/query', {
          content: content,
          question: input,
        });
        result = response.data.answer;
      } else if (type === 'rewrite') {
        if (!input || input.trim().length === 0) {
          setError('Please enter rewrite instructions (e.g., "make it more formal", "simplify")');
          setLoading(false);
          return;
        }
        // Call rewrite API
        const response = await axios.post('/api/ai/rewrite', {
          content: content,
          instruction: input,
        });
        result = response.data.rewritten;
      } else {
        throw new Error('Unknown AI type');
      }

      setResponse(result);
    } catch (err) {
      console.error('AI request error:', err);
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to process AI request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInput('');
    setResponse('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {type === 'summarize' ? 'AI Summarize' : type === 'rewrite' ? 'AI Rewrite' : 'Ask AI'}
                </h2>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {type === 'ask' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Question
                    </label>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question about this page..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </div>
                )}

                {type === 'rewrite' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rewrite Instructions
                    </label>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="e.g., 'make it more formal', 'simplify', 'make it shorter'"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter instructions on how you want the content rewritten
                    </p>
                  </div>
                )}

                {type === 'summarize' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      AI will summarize the content of this page.
                    </p>
                  </div>
                )}

                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">AI Response:</h3>
                    <p className="text-gray-900 whitespace-pre-wrap">{response}</p>
                  </motion.div>
                )}

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">AI is thinking...</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={loading || ((type === 'ask' || type === 'rewrite') && !input.trim())}
                >
                  {loading ? 'Processing...' : 
                   type === 'summarize' ? 'Summarize' : 
                   type === 'rewrite' ? 'Rewrite' : 
                   'Ask'}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}