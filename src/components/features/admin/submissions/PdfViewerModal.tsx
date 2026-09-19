'use client';

import { motion } from 'framer-motion';
import { X, Download, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PdfViewerModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      <div 
        className="relative bg-white w-full max-w-6xl h-full rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Toolbar */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 text-sm bg-gray-200 px-3 py-1 rounded-md">PDF Reader</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Pagination Controls */}
            {numPages && (
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <button 
                  onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-semibold text-gray-600">
                  {pageNumber} / {numPages}
                </span>
                <button 
                  onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                  disabled={pageNumber >= numPages}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <div className="w-px h-6 bg-gray-300" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors" title="Open in New Tab">
                <ExternalLink size={20} />
              </a>
              <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-[#E31E24] rounded-lg transition-colors ml-2" title="Close">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* PDF Document Container */}
        <div className="flex-1 overflow-auto bg-gray-50 flex justify-center p-8">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 mt-20">
                <Loader2 size={32} className="animate-spin" />
                <p>Loading document...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center h-full text-red-500 gap-4 mt-20">
                <p className="font-bold">Failed to load PDF.</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Download instead</a>
              </div>
            }
            className="flex flex-col items-center"
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-xl"
            />
          </Document>
        </div>
      </div>
    </motion.div>
  );
}
