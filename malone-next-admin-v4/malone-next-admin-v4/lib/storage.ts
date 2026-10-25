"use client";

import { defaultListings, defaultReviews, defaultSiteContent } from './default-data';
import { Listing, Review, SiteContent, Lead } from './types';

const KEYS = {
  content: 'malone_v4_content',
  listings: 'malone_v4_listings',
  reviews: 'malone_v4_reviews',
  leads: 'malone_v4_leads',
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const localStore = {
  getContent: () => read<SiteContent>(KEYS.content, defaultSiteContent),
  setContent: (v: SiteContent) => write(KEYS.content, v),
  getListings: () => read<Listing[]>(KEYS.listings, defaultListings),
  setListings: (v: Listing[]) => write(KEYS.listings, v),
  getReviews: () => read<Review[]>(KEYS.reviews, defaultReviews),
  setReviews: (v: Review[]) => write(KEYS.reviews, v),
  getLeads: () => read<Lead[]>(KEYS.leads, []),
  addLead: (lead: Lead) => write(KEYS.leads, [lead, ...read<Lead[]>(KEYS.leads, [])]),
};
