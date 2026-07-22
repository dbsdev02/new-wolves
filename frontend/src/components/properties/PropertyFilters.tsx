'use client';
import { useState } from 'react';
import type { PropertyFilters } from '@/types';
import { useCommunities, useDevelopers } from '@/hooks/useContent';

interface Props {
  filters: PropertyFilters;
  onUpdate: (filters: Partial<PropertyFilters>) => void;
}

const propertyTypes = ['apartment', 'villa', 'townhouse', 'penthouse', 'duplex', 'studio', 'office', 'retail', 'land'];
const purposes = [{ label: 'For Sale', value: 'sale' }, { label: 'For Rent', value: 'rent' }, { label: 'Off Plan', value: 'off_plan' }];
const completionStatuses = [{ label: 'Ready', value: 'ready' }, { label: 'Off Plan', value: 'off_plan' }, { label: 'Under Construction', value: 'under_construction' }];
const bedroomOptions = [0, 1, 2, 3, 4, 5];

export function PropertyFilters({ filters, onUpdate }: Props) {
  const { data: communities } = useCommunities({ page_size: 100 });
  const { data: developers } = useDevelopers({ page_size: 100 });

  const fieldClass = 'w-full bg-transparent border border-border px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="border border-border p-6 space-y-8">
      <div>
        <p className="eyebrow">Refine</p>
        <h3 className="mt-2 serif text-xl text-ink">Filter Properties</h3>
      </div>

      {/* Purpose */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Purpose</p>
        <div className="space-y-2">
          {[{ label: 'All', value: '' }, ...purposes].map((p) => (
            <label key={p.value || 'all'} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="purpose"
                value={p.value}
                checked={p.value ? filters.purpose === p.value : !filters.purpose}
                onChange={() => onUpdate({ purpose: p.value || undefined })}
                className="accent-gold"
              />
              <span className="text-sm text-ink/70 group-hover:text-ink transition-colors">{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Property Type</p>
        <select
          value={filters.property_type || ''}
          onChange={(e) => onUpdate({ property_type: e.target.value || undefined })}
          className={`${fieldClass} appearance-none`}
        >
          <option value="">All Types</option>
          {propertyTypes.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onUpdate({ min_bedrooms: undefined })}
            className={`px-3 py-1.5 text-xs border transition-colors ${!filters.min_bedrooms ? 'bg-ink text-white border-ink' : 'border-border hover:border-gold'}`}
          >
            Any
          </button>
          {bedroomOptions.map((b) => (
            <button
              key={b}
              onClick={() => onUpdate({ min_bedrooms: b })}
              className={`px-3 py-1.5 text-xs border transition-colors ${filters.min_bedrooms === b ? 'bg-ink text-white border-ink' : 'border-border hover:border-gold'}`}
            >
              {b === 0 ? 'Studio' : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Price Range (AED)</p>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.min_price || ''}
            onChange={(e) => onUpdate({ min_price: e.target.value ? Number(e.target.value) : undefined })}
            className={fieldClass}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.max_price || ''}
            onChange={(e) => onUpdate({ max_price: e.target.value ? Number(e.target.value) : undefined })}
            className={fieldClass}
          />
        </div>
      </div>

      {/* Community */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Community</p>
        <select
          value={filters.community || ''}
          onChange={(e) => onUpdate({ community: e.target.value || undefined })}
          className={`${fieldClass} appearance-none`}
        >
          <option value="">All Communities</option>
          {communities?.results?.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Developer */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Developer</p>
        <select
          value={filters.developer || ''}
          onChange={(e) => onUpdate({ developer: e.target.value || undefined })}
          className={`${fieldClass} appearance-none`}
        >
          <option value="">All Developers</option>
          {developers?.results?.map((d) => (
            <option key={d.id} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Completion Status */}
      <div>
        <p className="text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground mb-3">Completion Status</p>
        <select
          value={filters.completion_status || ''}
          onChange={(e) => onUpdate({ completion_status: e.target.value || undefined })}
          className={`${fieldClass} appearance-none`}
        >
          <option value="">Any Status</option>
          {completionStatuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      <button
        onClick={() => onUpdate({ purpose: undefined, property_type: undefined, min_price: undefined, max_price: undefined, min_bedrooms: undefined, community: undefined, developer: undefined, completion_status: undefined })}
        className="w-full py-3 border border-border text-xs tracking-[0.15em] uppercase text-muted-foreground hover:border-gold hover:text-gold-deep transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
