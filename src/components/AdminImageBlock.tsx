import React, { useState, useEffect, useRef } from 'react';
import { Image, Trash2, Link, AlertCircle } from 'lucide-react';

interface AdminImageBlockProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  description?: string;
}

export default function AdminImageBlock({ label, value, onChange, description }: AdminImageBlockProps) {
  // Local state to manage input value independently from parent prop
  const [localValue, setLocalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const isInitialMount = useRef(true);
  const lastSavedValue = useRef(value || '');

  // Sync local state with prop value ONLY when:
  // 1. It's the initial mount
  // 2. The input is NOT focused (user is not typing)
  // 3. The prop value has changed from what we last saved (external update)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setLocalValue(value || '');
      lastSavedValue.current = value || '';
      return;
    }

    // Only update local value from prop if user is not actively editing
    // AND the incoming value is different from what we last saved
    if (!isFocused && value !== lastSavedValue.current) {
      setLocalValue(value || '');
      lastSavedValue.current = value || '';
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    // Update parent state and save to draft
    onChange(newValue);
    lastSavedValue.current = newValue;
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    lastSavedValue.current = '';
  };

  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return url.startsWith('/') || url.startsWith('http');
    }
  };

  return (
    <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {label}
          </span>
          {description && (
            <p className="text-[11px] text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* URL Input Field */}
        <div className="flex-1 w-full relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Link size={14} />
          </div>
          <input
            type="text"
            placeholder="Paste Cloudinary, Unsplash, or CDN image URL..."
            value={localValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#004D40]"
          />
        </div>

        {/* Clear/Remove Button */}
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 whitespace-nowrap bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-red-100/50"
          >
            <Trash2 size={13} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Thumbnail Render Preview */}
      {localValue ? (
        <div className="flex items-center gap-4 p-3 bg-white border border-slate-200/50 rounded-xl">
          {isValidUrl(localValue) ? (
            <div className="relative w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
              <img
                src={localValue}
                alt={label}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // If image fails to load, fallback gracefully
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-bold text-[#004D40] uppercase tracking-wider mb-0.5">
              Live Image Preview
            </span>
            <p className="text-[11px] text-slate-400 truncate mb-1" title={localValue}>
              {localValue}
            </p>
            {isValidUrl(localValue) ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                Valid Image URL
              </span>
            ) : (
              <span className="text-[9px] font-bold text-orange-600 uppercase">
                Invalid URL format
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 border border-dashed border-slate-250 bg-white rounded-xl text-slate-400">
          <Image size={18} className="text-slate-300" />
          <span className="text-xs font-medium">No image URL configured. Component fallback will be rendered.</span>
        </div>
      )}
    </div>
  );
}
