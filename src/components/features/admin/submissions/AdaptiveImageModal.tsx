'use client';

import { motion } from 'framer-motion';
import { X, Download, ExternalLink, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useState } from 'react';

export function AdaptiveImageModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'asset-download';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      window.open(url, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      <div 
        className="relative bg-transparent w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls */}
        <div className="absolute top-0 right-0 flex items-center gap-2 z-10">
          <div className="bg-black/50 backdrop-blur-md rounded-full p-1 flex items-center gap-1">
            <button onClick={() => setScale(s => s + 0.25)} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors" title="Zoom In">
              <ZoomIn size={18} />
            </button>
            <span className="text-white text-xs font-bold w-10 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.max(0.25, s - 0.25))} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors" title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <button onClick={() => setScale(1)} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors" title="Reset Zoom">
              <Maximize size={18} />
            </button>
          </div>

          <div className="bg-black/50 backdrop-blur-md rounded-full p-1 flex items-center gap-1">
            <button onClick={handleDownload} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors" title="Download">
              <Download size={18} />
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 text-white hover:bg-white/20 rounded-full transition-colors block" title="Open in New Tab">
              <ExternalLink size={18} />
            </a>
          </div>

          <button onClick={onClose} className="bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-[#E31E24] transition-colors ml-4" title="Close">
            <X size={24} />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center overflow-auto pt-16 pb-4">
          <motion.img 
            src={url} 
            alt="Asset Viewer" 
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg origin-center"
            style={{ scale }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag
            dragConstraints={{ top: -200, bottom: 200, left: -200, right: 200 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
