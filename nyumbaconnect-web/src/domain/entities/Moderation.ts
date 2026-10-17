export type FlagReason = 'misleading_price' | 'duplicate' | 'poor_images' | 'suspected_scam' | 'other';

export interface ModerationTicket {
  id: string;
  listingId: string;
  propertyTitle: string;
  unitDetail: string;
  reason: FlagReason;
  landlordName: string;
  flaggedAt: string; // ISO date
}

export interface KycSubmission {
  id: string;
  applicantName: string;
  role: 'landlord' | 'agent';
  submittedContext: string; // e.g. "Landlord since 2021" or "Agent · 12 listings"
  avatarUrl?: string;
}

export interface GovernanceStats {
  pendingVerifications: number;
  pendingVerificationsTrendPct: number;
  flaggedListings: number;
  flaggedListingsTrendPct: number;
  totalActiveUsers: number;
  totalActiveUsersTrend: number;
  revenueKsh: number;
  revenueTrendPct: number;
}

export interface MarketVelocityPoint {
  label: string;
  newListings: number;
  bookings: number;
}
