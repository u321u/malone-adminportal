"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { defaultListings } from '@/lib/default-data';
import { localStore } from '@/lib/storage';
import { Listing } from '@/lib/types';

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  useEffect(() => setListings(localStore.getListings()), []);

  return (
    <main className="section">
      <div className="container">
        <Link href="/" className="btn btn-ghost">← Back Home</Link>
        <div className="section-head" style={{ marginTop: 24 }}>
          <div className="eyebrow" style={{ color: 'var(--gold)' }}>All featured homes</div>
          <h2>Listings</h2>
          <p>These cards are editable from the admin panel.</p>
        </div>
        <div className="showcase-grid" style={{ color: 'var(--text)' }}>
          {listings.map((listing) => (
            <a key={listing.id} className="card" href={listing.href} target="_blank" style={{ overflow: 'hidden' }}>
              <img src={listing.image} alt={listing.title} style={{ height: 260, width: '100%', objectFit: 'cover' }} />
              <div style={{ padding: 18 }}>
                <div className="price" style={{ color: 'var(--navy)' }}>{listing.price}</div>
                <h3 style={{ margin: '8px 0', fontSize: '1.9rem' }}>{listing.title}</h3>
                <div className="muted">{listing.location}</div>
                <p className="muted">{listing.blurb}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
