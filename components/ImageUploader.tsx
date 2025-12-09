import React, { useRef, useState } from 'react';
import { CloudArrowUpIcon, CheckCircleIcon } from './Icons';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative group cursor-pointer w-full h-32 rounded-xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center text-center p-4
        ${
          selectedFile
            ? 'border-emerald-500/50 bg-emerald-500/10'
            : dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-700 bg-slate-800 hover:border-slate-600 hover:bg-slate-750'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      {selectedFile ? (
        <div className="flex flex-col items-center text-emerald-400">
          <CheckCircleIcon className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Logo Attached</span>
          <span className="text-xs text-emerald-500/70 mt-1">Click to change</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-slate-400 group-hover:text-slate-300">
          <CloudArrowUpIcon className="w-8 h-8 mb-2 transition-transform group-hover:-translate-y-1" />
          <span className="text-sm font-medium">Click to upload logo</span>
          <span className="text-xs text-slate-500 mt-1">or drag and drop PNG, JPG</span>
        </div>
      )}
    </div>
  );
};