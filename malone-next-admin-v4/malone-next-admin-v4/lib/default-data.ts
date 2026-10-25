import { Listing, Review, SiteContent } from './types';

export const defaultSiteContent: SiteContent = {
  brandName: 'The Malone Team',
  heroTitle: 'Find Your Dream Home On The Gulf Coast',
  heroSubtitle: 'Trusted Guidance — Every Step Of The Way',
  heroCopy:
    "We didn't get into real estate to close deals — we got into it to open doors. Whether you're buying your first home, selling to move on to something bigger, or relocating to the Gulf Coast, we're with you every step of the way. No jargon. No pressure. Just honest guidance from people who genuinely care.",
  agentName: 'Shaunna & Levi Malone',
  agentBio:
    "We didn't get into real estate to close deals — we got into it to open doors. Whether you're buying your first home, selling to move on to something bigger, or relocating to the Gulf Coast, we're with you every step of the way.",
  phone: '(850) 480-5198',
  email: 'shaunnasoldit@gmail.com',
  brokerage: 'Gulf Real Estate Group',
  serviceArea: 'Serving buyers, sellers, and relocation clients across the Gulf Coast.',
  listingsUrl:
    'https://parmls.paragonrels.com/CCR/collablink/424cbdc0-bad5-4df6-ae8e-36af017351bc/listings/results?forMlsId=parmls&fromccp=true&sid=KoW4-pRWhoV',
  buyerFormTitle: 'Help Me Find My Dream Home',
  sellerFormTitle: "What's My Home Worth?",
};

export const defaultListings: Listing[] = [
  {
    id: '1',
    title: 'Featured Gulf Coast Property',
    price: 'View Listing',
    location: 'Florida & Alabama Gulf Coast',
    beds: '',
    baths: '',
    sqft: '',
    image: '/images/img_3.jpg',
    href: defaultSiteContent.listingsUrl,
    blurb: 'Tap to open the live listings feed from The Malone Team.',
    featured: true,
  },
  {
    id: '2',
    title: 'Buyer-Focused Search',
    price: 'Start Here',
    location: 'Search active listings',
    beds: '',
    baths: '',
    sqft: '',
    image: '/images/img_2.jpg',
    href: 'modal:buyer',
    blurb: 'Browse current listings and tell us what you want in your next home.',
    featured: true,
  },
  {
    id: '3',
    title: 'Seller Opportunity',
    price: 'Request Value',
    location: 'Get guidance before you list',
    beds: '',
    baths: '',
    sqft: '',
    image: '/images/img_3.jpg',
    href: 'modal:seller',
    blurb: 'Perfect section to drive homeowners toward the valuation form.',
    featured: true,
  },
];

export const defaultReviews: Review[] = [
  {
    id: '1',
    name: 'Happy Buyer',
    quote: 'Shaunna was responsive, thoughtful, and professional from start to finish. We felt guided every step of the way.',
  },
  {
    id: '2',
    name: 'Seller Client',
    quote: 'The process felt clear and organized. We appreciated the honest communication and local expertise.',
  },
  {
    id: '3',
    name: 'Relocation Client',
    quote: 'Very helpful, patient, and knowledgeable. We felt supported through every stage of the move.',
  },
];
