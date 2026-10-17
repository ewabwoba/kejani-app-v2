import { AdminRepository } from '../../domain/repositories/AdminRepository';
import {
  ModerationTicket,
  KycSubmission,
  GovernanceStats,
  MarketVelocityPoint,
} from '../../domain/entities/Moderation';
import { httpClient } from '../api/httpClient';

export class AdminRepositoryImpl extends AdminRepository {
  async getGovernanceStats(regionId: string): Promise<GovernanceStats> {
    return httpClient<GovernanceStats>(`/api/admin/regions/${regionId}/stats`);
  }

  async getFlaggedListingsQueue(regionId: string): Promise<ModerationTicket[]> {
    return httpClient<ModerationTicket[]>(`/api/admin/regions/${regionId}/moderation-queue`);
  }

  async getRecentKycSubmissions(regionId: string): Promise<KycSubmission[]> {
    return httpClient<KycSubmission[]>(`/api/admin/regions/${regionId}/kyc-submissions`);
  }

  async getMarketVelocity(regionId: string): Promise<MarketVelocityPoint[]> {
    return httpClient<MarketVelocityPoint[]>(`/api/admin/regions/${regionId}/market-velocity`);
  }

  async approveListing(ticketId: string): Promise<void> {
    await httpClient<void>(`/api/admin/moderation-queue/${ticketId}/approve`, { method: 'POST' });
  }

  async rejectListing(ticketId: string): Promise<void> {
    await httpClient<void>(`/api/admin/moderation-queue/${ticketId}/reject`, { method: 'POST' });
  }

  async approveKyc(submissionId: string): Promise<void> {
    await httpClient<void>(`/api/admin/kyc-submissions/${submissionId}/approve`, { method: 'POST' });
  }
}
