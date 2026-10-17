import {
  ModerationTicket,
  KycSubmission,
  GovernanceStats,
  MarketVelocityPoint,
} from '../entities/Moderation';

export abstract class AdminRepository {
  abstract getGovernanceStats(regionId: string): Promise<GovernanceStats>;
  abstract getFlaggedListingsQueue(regionId: string): Promise<ModerationTicket[]>;
  abstract getRecentKycSubmissions(regionId: string): Promise<KycSubmission[]>;
  abstract getMarketVelocity(regionId: string): Promise<MarketVelocityPoint[]>;
  abstract approveListing(ticketId: string): Promise<void>;
  abstract rejectListing(ticketId: string): Promise<void>;
  abstract approveKyc(submissionId: string): Promise<void>;
}
