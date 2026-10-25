"use client";

import { useMemo, useState } from 'react';
import { defaultListings, defaultReviews, defaultSiteContent } from '@/lib/default-data';
import { localStore } from '@/lib/storage';
import { Listing, Review, SiteContent, Lead } from '@/lib/types';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@demo.com';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password123';

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<'dashboard' | 'content' | 'listings' | 'reviews' | 'leads'>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [leads, setLeads] = useState<Lead[]>([]);

  function loadAll() {
    setContent(localStore.getContent());
    setListings(localStore.getListings());
    setReviews(localStore.getReviews());
    setLeads(localStore.getLeads());
  }

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadAll();
      setMessage('');
    } else {
      setMessage('Invalid login. Update your admin env vars if needed.');
    }
  }

  const kpis = useMemo(() => ([
    { label: 'Listings', value: listings.length },
    { label: 'Featured', value: listings.filter((l) => l.featured).length },
    { label: 'Reviews', value: reviews.length },
    { label: 'Leads', value: leads.length },
  ]), [listings, reviews, leads]);

  if (!loggedIn) {
    return (
      <main className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="card" style={{ padding: 28 }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>Private admin</div>
            <h1 style={{ fontSize: '3rem', margin: '10px 0 18px', fontWeight: 400 }}>Malone Team Dashboard</h1>
            <p className="muted">Use the admin email and password from your environment variables.</p>
            <form className="stack" onSubmit={login}>
              <div><div className="label">Email</div><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div><div className="label">Password</div><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <button className="btn btn-secondary" type="submit">Log In</button>
              {message && <div className="error">{message}</div>}
              <div className="notice">Demo/local mode is enabled by default. For shared real client data, connect Supabase.</div>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <h2 style={{ marginTop: 0, fontSize: '2.2rem', fontWeight: 400 }}>Admin Panel</h2>
        {['dashboard', 'content', 'listings', 'reviews', 'leads'].map((item) => (
          <button key={item} className={view === item ? 'active' : ''} onClick={() => setView(item as any)}>{item[0].toUpperCase() + item.slice(1)}</button>
        ))}
        <button onClick={() => { setLoggedIn(false); setEmail(''); setPassword(''); }}>Log Out</button>
      </aside>
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>Client-manageable site</div>
            <h1 style={{ margin: '8px 0 0', fontSize: '3rem', fontWeight: 400 }}>{view[0].toUpperCase() + view.slice(1)}</h1>
          </div>
          <a className="btn btn-secondary" href="/" target="_blank">View Site</a>
        </div>

        {view === 'dashboard' && (
          <div className="stack">
            <div className="kpi-grid">{kpis.map((k) => <div className="card kpi" key={k.label}><div className="muted">{k.label}</div><div className="num">{k.value}</div></div>)}</div>
            <div className="notice">This dashboard is ready for a client demo now. Supabase is recommended for production so all edits and leads persist across devices.</div>
          </div>
        )}

        {view === 'content' && (
          <div className="card" style={{ padding: 24 }}>
            <div className="admin-grid">
              {Object.entries(content).map(([key, value]) => (
                <div key={key} style={key.includes('Copy') || key.includes('Bio') ? { gridColumn: '1 / -1' } : undefined}>
                  <div className="label">{key}</div>
                  {String(value).length > 80 ? (
                    <textarea className="textarea" value={value as string} onChange={(e) => setContent({ ...content, [key]: e.target.value })} />
                  ) : (
                    <input className="input" value={value as string} onChange={(e) => setContent({ ...content, [key]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18 }}><button className="btn btn-secondary" onClick={() => { localStore.setContent(content); setMessage('Content saved.'); }}>Save Content</button></div>
          </div>
        )}

        {view === 'listings' && (
          <div className="stack">
            {listings.map((listing, idx) => (
              <div className="card" key={listing.id} style={{ padding: 20 }}>
                <div className="admin-grid">
                  {(['title', 'price', 'location', 'beds', 'baths', 'sqft', 'image', 'href', 'blurb'] as const).map((field) => (
                    <div key={field} style={field === 'blurb' ? { gridColumn: '1 / -1' } : undefined}>
                      <div className="label">{field}</div>
                      {field === 'blurb' ? (
                        <textarea className="textarea" value={listing[field] || ''} onChange={(e) => { const next = [...listings]; next[idx] = { ...listing, [field]: e.target.value }; setListings(next); }} />
                      ) : (
                        <input className="input" value={listing[field] || ''} onChange={(e) => { const next = [...listings]; next[idx] = { ...listing, [field]: e.target.value }; setListings(next); }} />
                      )}
                    </div>
                  ))}
                  <div>
                    <div className="label">featured</div>
                    <select className="select" value={String(Boolean(listing.featured))} onChange={(e) => { const next = [...listings]; next[idx] = { ...listing, featured: e.target.value === 'true' }; setListings(next); }}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
                  <button className="btn btn-ghost" onClick={() => setListings(listings.filter((x) => x.id !== listing.id))}>Delete</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setListings([...listings, { id: newId(), title: 'New Listing', price: '$0', location: 'Location', beds: '', baths: '', sqft: '', image: '/images/img_4.jpg', href: '#', blurb: 'Listing description', featured: false }])}>Add Listing</button>
              <button className="btn btn-secondary" onClick={() => { localStore.setListings(listings); setMessage('Listings saved.'); }}>Save Listings</button>
            </div>
          </div>
        )}

        {view === 'reviews' && (
          <div className="stack">
            {reviews.map((review, idx) => (
              <div className="card" key={review.id} style={{ padding: 20 }}>
                <div className="stack">
                  <div><div className="label">Name</div><input className="input" value={review.name} onChange={(e) => { const next = [...reviews]; next[idx] = { ...review, name: e.target.value }; setReviews(next); }} /></div>
                  <div><div className="label">Quote</div><textarea className="textarea" value={review.quote} onChange={(e) => { const next = [...reviews]; next[idx] = { ...review, quote: e.target.value }; setReviews(next); }} /></div>
                  <div><button className="btn btn-ghost" onClick={() => setReviews(reviews.filter((x) => x.id !== review.id))}>Delete</button></div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setReviews([...reviews, { id: newId(), name: 'New Review', quote: 'Client feedback goes here.' }])}>Add Review</button>
              <button className="btn btn-secondary" onClick={() => { localStore.setReviews(reviews); setMessage('Reviews saved.'); }}>Save Reviews</button>
            </div>
          </div>
        )}

        {view === 'leads' && (
          <div className="stack">
            {leads.length === 0 ? <div className="notice">No leads yet in local/demo mode.</div> : leads.map((lead) => (
              <div className="card" key={lead.id} style={{ padding: 20 }}>
                <strong>{lead.first_name} {lead.last_name}</strong> · {lead.lead_type}<br />
                <span className="muted">{lead.email}{lead.phone ? ` · ${lead.phone}` : ''}</span>
                <p className="muted">{lead.location || lead.property_address || ''}</p>
                <p className="muted">{lead.budget || lead.timeline || ''}</p>
                <p>{lead.notes}</p>
              </div>
            ))}
          </div>
        )}
        {message && <div style={{ marginTop: 16 }} className="success">{message}</div>}
      </main>
    </div>
  );
}
