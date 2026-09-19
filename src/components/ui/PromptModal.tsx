'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function PromptModal({
  isOpen,
  title,
  description,
  placeholder = 'Enter value...',
  confirmText = 'Submit',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: PromptModalProps) {
  const [inputValue, setInputValue] = useState('');

  // Reset input when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onConfirm(inputValue.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onCancel}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md pointer-events-auto overflow-hidden border border-gray-100"
            >
              <form onSubmit={handleSubmit}>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                  {description && <p className="text-gray-500 mt-2 text-sm">{description}</p>}
                  
                  <div className="mt-4">
                    <input
                      autoFocus
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] focus:ring-1 focus:ring-[#E31E24] outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="px-4 py-2 font-medium text-white bg-[#E31E24] hover:bg-[#C41A20] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {confirmText}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
