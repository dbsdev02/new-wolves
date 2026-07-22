'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_COMPARE = 4;

interface PropertyListState {
  wishlist: string[];
  compare: string[];
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  toggleCompare: (slug: string) => void;
  isComparing: (slug: string) => boolean;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
}

export const usePropertyListStore = create<PropertyListState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      compare: [],

      toggleWishlist: (slug) => {
        const { wishlist } = get();
        set({
          wishlist: wishlist.includes(slug) ? wishlist.filter((x) => x !== slug) : [...wishlist, slug],
        });
      },
      isWishlisted: (slug) => get().wishlist.includes(slug),

      toggleCompare: (slug) => {
        const { compare } = get();
        if (compare.includes(slug)) {
          set({ compare: compare.filter((x) => x !== slug) });
        } else if (compare.length < MAX_COMPARE) {
          set({ compare: [...compare, slug] });
        }
      },
      isComparing: (slug) => get().compare.includes(slug),
      removeFromCompare: (slug) => set({ compare: get().compare.filter((x) => x !== slug) }),
      clearCompare: () => set({ compare: [] }),
    }),
    { name: 'property-list-store' }
  )
);

export const MAX_COMPARE_ITEMS = MAX_COMPARE;
