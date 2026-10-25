"use client";

import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { defaultListings, defaultReviews, defaultSiteContent } from '@/lib/default-data';
import { localStore } from '@/lib/storage';
import type { Lead, Listing, Review, SiteContent } from '@/lib/types';

async function submitLead(payload: Record<string, string>) {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

function LeadForm({
  type,
  title,
  intro,
  buttonLabel,
  onDone,
}: {
  type: 'Buyer' | 'Seller';
  title: string;
  intro: string;
  buttonLabel: string;
  onDone?: () => void;
}) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setStatus('');
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    try {
      const result = await submitLead(payload);
      if (!result.ok) throw new Error(result.error || 'Unable to send');
      localStore.addLead({
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        lead_type: type,
        first_name: payload.first_name || '',
        last_name: payload.last_name || '',
        email: payload.email || '',
        phone: payload.phone || '',
        location: payload.location || '',
        budget: payload.budget || '',
        property_address: payload.property_address || '',
        timeline: payload.timeline || '',
        notes: payload.notes || '',
      } as Lead);
      setStatus('Thanks — the request was submitted successfully.');
      const form = document.getElementById(`${type}-form`) as HTMLFormElement | null;
      form?.reset();
      window.setTimeout(() => onDone?.(), 900);
    } catch {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="modal-head">
        <span className="eyebrow">The Malone Team</span>
        <h3>{title}</h3>
        <p>{intro}</p>
      </div>
      <div className="mini-divider" />
      <form
        id={`${type}-form`}
        className="stack"
        onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(new FormData(e.currentTarget));
        }}
      >
        <input type="hidden" name="lead_type" value={type} />
        <div className="form-grid">
          <div><div className="label">First Name *</div><input className="input field" name="first_name" placeholder={type === 'Buyer' ? 'Jane' : 'John'} required /></div>
          <div><div className="label">Last Name *</div><input className="input field" name="last_name" placeholder="Smith" required /></div>
          <div className="full"><div className="label">Email Address *</div><input className="input field" name="email" type="email" placeholder="name@example.com" required /></div>
          <div className="full"><div className="label">Phone Number</div><input className="input field" name="phone" placeholder="(850) 000-0000" /></div>
          {type === 'Buyer' ? (
            <>
              <div><div className="label">Location / City</div><input className="input field" name="location" placeholder="Pensacola, Mobile..." /></div>
              <div><div className="label">Budget Range</div><input className="input field" name="budget" placeholder="$400,000 - $600,000" /></div>
            </>
          ) : (
            <>
              <div className="full"><div className="label">Property Address *</div><input className="input field" name="property_address" placeholder="123 Gulf Breeze Dr, Pensacola, FL" required /></div>
              <div className="full"><div className="label">When Are You Looking To Sell?</div><input className="input field" name="timeline" placeholder="Within 30 days" /></div>
            </>
          )}
          <div className="full"><div className="label">Tell Us More</div><textarea className="textarea field" name="notes" placeholder={type === 'Buyer' ? 'Style, must-haves, timeline...' : 'Anything about the home, condition, goals, or questions...'} /></div>
        </div>
        <button className="submit" disabled={loading}>{loading ? 'Sending...' : buttonLabel}</button>
        {status && <div className={status.startsWith('Thanks') ? 'success' : 'error'}>{status}</div>}
      </form>
    </>
  );
}

function ListingCard({
  listing,
  priority = false,
  onSellerOpen,
  onBuyerOpen,
}: {
  listing: Listing;
  priority?: boolean;
  onSellerOpen: () => void;
  onBuyerOpen: () => void;
}) {
  const shared = (
    <>
      <div className="listing-image-wrap">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          priority={priority}
          sizes="(max-width: 980px) 100vw, 33vw"
          className="listing-image"
        />
      </div>
      <div className="body">
        <div className="price">{listing.price}</div>
        <h3>{listing.title}</h3>
        <div className="listing-meta">{listing.location}</div>
        <p>{listing.blurb}</p>
      </div>
    </>
  );

  if (listing.href === 'modal:seller') {
    return <button type="button" className="listing-card listing-button" onClick={onSellerOpen}>{shared}</button>;
  }

  if (listing.href === 'modal:buyer') {
    return <button type="button" className="listing-card listing-button" onClick={onBuyerOpen}>{shared}</button>;
  }

  return (
    <a className="listing-card" href={listing.href} target="_blank" rel="noreferrer">
      {shared}
    </a>
  );
}

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal active" aria-hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <button type="button" className="close" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  );
}

export default function SiteClient() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [listings, setListings] = useState<Listing[]>(defaultListings);
  const [reviews, setReviews] = useState<Review[]>(defaultReviews);
  const [activeModal, setActiveModal] = useState<'buyer' | 'seller' | null>(null);

  useEffect(() => {
    setContent(localStore.getContent());
    setListings(localStore.getListings());
    setReviews(localStore.getReviews());
  }, []);

  const featured = useMemo(() => listings.filter((l) => l.featured).slice(0, 3), [listings]);

  return (
    <>
      <header className="hero">
        <div className="hero-bg">
          <Image
            src="/images/img_2.jpg"
            alt="Gulf Coast beach view"
            fill
            priority
            sizes="100vw"
            className="hero-bg-image"
          />
        </div>
        <div className="container hero-inner">
          <div>
            <div className="hero-badge eyebrow">Florida &amp; Alabama | Licensed Real Estate Professionals</div>
            <div className="brand-logo">
              <Image src="/images/img_0.jpg" alt="Gulf Real Estate Group" width={1024} height={555} priority className="brand-logo-image" />
            </div>
            <h1 className="hero-title">Find Your <em>Dream</em><br />On The Gulf Coast</h1>
            <p className="hero-sub">Trusted Guidance — Every Step Of The Way</p>
            <div className="divider" />
            <p className="hero-copy">{content.heroCopy}</p>
            <div className="cta-row">
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal('buyer')}>Help Me Find My Dream Home</button>
              <button className="btn btn-outline" onClick={() => setActiveModal('seller')}>What&apos;s My Home Worth?</button>
              <a className="btn btn-outline" href={content.listingsUrl} target="_blank" rel="noreferrer">View My Listings</a>
            </div>
          </div>
        </div>
      </header>

      <div className="trust-bar">
        <div className="container trust-grid">
          <div className="trust-item">Trusted Local Experts</div>
          <div className="trust-item">FL &amp; AL Licensed</div>
          <div className="trust-item">Gulf Coast Specialists</div>
          <div className="trust-item">Personal Service</div>
        </div>
      </div>

      <section>
        <div className="container agents">
          <div className="agent-photo-wrap">
            <div className="agent-photo-frame"></div>
            <div className="agent-photo">
              <Image
                src="/images/img_1.jpg"
                alt={content.agentName}
                fill
                sizes="(max-width: 980px) 100vw, 50vw"
                className="agent-photo-image"
              />
            </div>
            <div className="license-badge">
              <div className="big">FL &amp; AL</div>
              <div className="small">Licensed Gulf Coast Specialists</div>
            </div>
          </div>
          <div className="agent-copy-wrap">
            <span className="eyebrow">Meet Your Agents</span>
            <h2>Shaunna &amp;<br />Levi Malone</h2>
            <p>{content.agentBio}</p>
            <p>No jargon. No pressure. Just honest guidance from people who genuinely care.</p>
            <div className="contact-list">
              <div><strong>Phone:</strong> {content.phone}</div>
              <div><strong>Email:</strong> {content.email}</div>
              <div><strong>Brokerage:</strong> {content.brokerage}</div>
            </div>
            <div className="cta-row left">
              <a className="btn btn-dark" href={content.listingsUrl} target="_blank" rel="noreferrer">Browse Active Listings</a>
              <button type="button" className="btn btn-admin" onClick={() => setActiveModal('seller')}>Get Home Valuation</button>
            </div>
          </div>
        </div>
      </section>

      <section className="showcase-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured Opportunities</span>
            <h2>Start Your Gulf Coast Search</h2>
            <p>Browse active listings, request a home valuation, or connect directly with The Malone Team in one elegant place.</p>
          </div>
          <div className="showcase-grid">
            {featured.map((listing, index) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                priority={index === 0}
                onSellerOpen={() => setActiveModal('seller')}
                onBuyerOpen={() => setActiveModal('buyer')}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Testimonials</span>
            <h2>Trusted Guidance, Real Results</h2>
          </div>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div className="testimonial" key={review.id}>
                <div className="stars">★★★★★</div>
                <p className="quote">“{review.quote}”</p>
                <div className="review-name">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band-inner">
          <div>
            <span className="eyebrow">Ready When You Are</span>
            <h2>Let&apos;s Find The Right Next Move</h2>
            <p>Whether you&apos;re buying, selling, or just exploring your options, you can start with one simple step.</p>
          </div>
          <div className="cta-row left bottom-cta-row">
            <button type="button" className="btn btn-primary" onClick={() => setActiveModal('buyer')}>Help Me Find My Dream Home</button>
            <button className="btn btn-outline-dark" onClick={() => setActiveModal('seller')}>What&apos;s My Home Worth?</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>{content.brandName}</strong><br />
            {content.agentName}<br />
            {content.brokerage}
          </div>
          <div>
            <strong>{content.phone}</strong><br />
            <strong>{content.email}</strong>
          </div>
        </div>
        <div className="container footer-bottom">
          <div className="footer-admin-wrap">
            <Link className="footer-admin-link" href="/admin">Admin</Link>
          </div>
        </div>
      </footer>

      <Modal open={activeModal === 'buyer'} onClose={() => setActiveModal(null)}>
        <LeadForm
          type="Buyer"
          title="Find My Dream Home"
          intro="Tell us a little about what you're looking for and we'll reach out personally within 24 hours."
          buttonLabel="Send My Request →"
          onDone={() => setActiveModal(null)}
        />
      </Modal>

      <Modal open={activeModal === 'seller'} onClose={() => setActiveModal(null)}>
        <LeadForm
          type="Seller"
          title="What's My Home Worth?"
          intro="Get a free, no-obligation home valuation from local experts who know your market inside and out."
          buttonLabel="Get My Free Valuation →"
          onDone={() => setActiveModal(null)}
        />
      </Modal>
    </>
  );
}
