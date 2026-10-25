export type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  beds?: string;
  baths?: string;
  sqft?: string;
  image: string;
  href: string;
  blurb: string;
  featured?: boolean;
};

export type Review = {
  id: string;
  name: string;
  quote: string;
};

export type SiteContent = {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCopy: string;
  agentName: string;
  agentBio: string;
  phone: string;
  email: string;
  brokerage: string;
  serviceArea: string;
  listingsUrl: string;
  buyerFormTitle: string;
  sellerFormTitle: string;
};

export type Lead = {
  id: string;
  created_at: string;
  lead_type: 'Buyer' | 'Seller';
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  budget?: string;
  property_address?: string;
  timeline?: string;
  notes?: string;
};
