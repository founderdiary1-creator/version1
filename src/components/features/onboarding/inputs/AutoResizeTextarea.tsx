'use client';

import { useRef, useEffect } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

export function AutoResizeTextarea({ value, className = '', ...props }: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to correctly shrink if text is deleted
      textareaRef.current.style.height = 'auto';
      // Set height based on scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      className={`w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:ring-0 outline-none transition-all resize-none overflow-hidden ${className}`}
      rows={3}
      {...props}
    />
  );
}
