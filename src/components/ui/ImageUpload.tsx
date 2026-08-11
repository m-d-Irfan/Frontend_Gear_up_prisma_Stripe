'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (base64Url: string) => void;
  onRemove?: () => void;
  label?: string;
  error?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Equipment Image File Upload',
  error,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isReading, setIsReading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`Image file size must be smaller than ${maxSizeMB}MB.`);
      return;
    }

    setIsReading(true);
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;
      onChange(result);
      setIsReading(false);
    };

    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
      setIsReading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
    setUploadError(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-file-input"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 group shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded gear preview"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
            <ImageIcon className="w-3 h-3" />
            <span>Image Attached</span>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-400 dark:hover:border-slate-600'
          }`}
        >
          {isReading ? (
            <div className="flex flex-col items-center space-y-2 py-2 text-slate-600 dark:text-slate-300">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-bold">Processing Image File...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center text-slate-600 dark:text-slate-300">
                <UploadCloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-emerald-600 dark:text-emerald-400 underline">Click to upload</span> or drag and drop image file
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Supports PNG, JPG, WEBP or GIF (max {maxSizeMB}MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-xs font-semibold text-rose-600">{error || uploadError}</p>
      )}
    </div>
  );
}
