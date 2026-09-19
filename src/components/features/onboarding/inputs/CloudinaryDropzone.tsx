'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, X, CheckCircle2, Loader2, FileIcon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface CloudinaryDropzoneProps {
  value: string | null; // URL of uploaded file
  onChange: (url: string | null) => void;
  uploadPreset?: string;
}

export function CloudinaryDropzone({ value, onChange, uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET }: CloudinaryDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  // If we already have a file, show the preview
  if (value) {
    const isImage = value.match(/\.(jpeg|jpg|gif|png)$/) != null || value.includes('image/upload');
    
    return (
      <div className="relative p-4 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center gap-4">
        <div className="w-16 h-16 shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          {isImage ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <FileIcon size={24} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">File Uploaded Successfully</p>
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate block">
            View File
          </a>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  // Fallback if no upload preset is configured (development safety)
  if (!uploadPreset) {
    return (
      <div className="p-8 border-2 border-dashed border-red-200 bg-red-50 rounded-xl text-center">
        <p className="text-red-600 font-medium">Cloudinary Upload Preset not configured in environment.</p>
      </div>
    );
  }

  return (
    <CldUploadWidget 
      uploadPreset={uploadPreset}
      onSuccess={(result: any) => {
        if (result?.info?.secure_url) {
          onChange(result.info.secure_url);
        }
        setIsUploading(false);
      }}
      onOpen={() => setIsUploading(true)}
      onClose={() => setIsUploading(false)}
    >
      {({ open }) => {
        return (
          <div 
            onClick={() => open()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-gray-900 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-gray-900 group-hover:text-white">
              {isUploading ? <Loader2 size={24} className="animate-spin" /> : <FileUp size={28} />}
            </div>
            <p className="font-bold text-gray-900 text-lg">Click or drag file to upload</p>
            <p className="text-sm text-gray-500 mt-2">SVG, PNG, JPG, or PDF (max. 10MB)</p>
          </div>
        );
      }}
    </CldUploadWidget>
  );
}
