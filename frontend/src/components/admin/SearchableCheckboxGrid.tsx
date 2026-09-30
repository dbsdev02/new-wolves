'use client';
import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

interface Option<T> {
  value: T;
  label: string;
}

interface Props<T> {
  options: readonly Option<T>[];
  selected: T[];
  onToggle: (value: T) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  columns?: string;
}

export function SearchableCheckboxGrid<T extends string | number>({
  options,
  selected,
  onToggle,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No matches.',
  columns = 'grid-cols-2 md:grid-cols-3',
}: Props<T>) {
  const [query, setQuery] = useState('');
  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  return (
    <div className="space-y-3">
      {options.length > 8 && (
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="input-luxury text-sm pl-9 w-full"
          />
        </div>
      )}
      {filtered.length ? (
        <div className={`grid ${columns} gap-2`}>
          {filtered.map((o) => (
            <label key={String(o.value)} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                className="accent-gold w-4 h-4"
                checked={selected.includes(o.value)}
                onChange={() => onToggle(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      )}
    </div>
  );
}
