'use client';
import { useEffect, useState } from 'react';
import { getMediaUrl } from '@/lib/utils';
import { compressImage } from '@/lib/imageCompression';

interface Props {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
}

export function ImageUploadField({ label, file, onChange, existingUrl }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayUrl = previewUrl || (existingUrl ? getMediaUrl(existingUrl) : null);

  const handleFile = async (raw: File | null) => {
    if (!raw) { onChange(null); return; }
    setIsCompressing(true);
    try {
      onChange(await compressImage(raw));
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div>
      <label className="label-luxury">{label}</label>
      <div className="flex items-center gap-4">
        {displayUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt={label} className="w-24 h-16 object-cover bg-gray-100 flex-shrink-0" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="input-luxury text-sm"
        />
        {isCompressing && <span className="text-xs text-gray-400">Optimizing…</span>}
      </div>
    </div>
  );
}
