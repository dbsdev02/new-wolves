'use client';
import { useEffect, useState } from 'react';
import { getMediaUrl } from '@/lib/utils';

interface Props {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string | null;
}

export function ImageUploadField({ label, file, onChange, existingUrl }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayUrl = previewUrl || (existingUrl ? getMediaUrl(existingUrl) : null);

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
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          className="input-luxury text-sm"
        />
      </div>
    </div>
  );
}
