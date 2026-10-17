import { useEffect, useState, useCallback } from 'react';
import { AdminRepositoryImpl } from '../../../data/repositories/AdminRepositoryImpl';
import {
  ModerationTicket,
  KycSubmission,
  GovernanceStats,
  MarketVelocityPoint,
} from '../../../domain/entities/Moderation';
import { trackEvent } from '../../hooks/useAnalytics';

const repo = new AdminRepositoryImpl();

/** Nairobi Hub today, but the region is a parameter, not a hardcoded
 *  string baked into the queries — this is what lets the same dashboard
 *  serve a Mombasa or Kisumu regional moderation team later. */
export function useAdminDashboardViewModel(regionId: string) {
  const [stats, setStats] = useState<GovernanceStats | null>(null);
  const [queue, setQueue] = useState<ModerationTicket[]>([]);
  const [kyc, setKyc] = useState<KycSubmission[]>([]);
  const [velocity, setVelocity] = useState<MarketVelocityPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, queueRes, kycRes, velocityRes] = await Promise.all([
        repo.getGovernanceStats(regionId),
        repo.getFlaggedListingsQueue(regionId),
        repo.getRecentKycSubmissions(regionId),
        repo.getMarketVelocity(regionId),
      ]);
      setStats(statsRes);
      setQueue(queueRes);
      setKyc(kycRes);
      setVelocity(velocityRes);
    } catch {
      setError('Could not reach the moderation API. Showing nothing until it recovers.');
    } finally {
      setLoading(false);
    }
  }, [regionId]);

  useEffect(() => {
    load();
  }, [load]);

  async function approveTicket(id: string) {
    setQueue((prev) => prev.filter((t) => t.id !== id));
    trackEvent('admin_ticket_approved', { ticketId: id });
    await repo.approveListing(id);
  }

  async function rejectTicket(id: string) {
    setQueue((prev) => prev.filter((t) => t.id !== id));
    trackEvent('admin_ticket_rejected', { ticketId: id });
    await repo.rejectListing(id);
  }

  async function approveKycSubmission(id: string) {
    setKyc((prev) => prev.filter((k) => k.id !== id));
    trackEvent('admin_kyc_approved', { submissionId: id });
    await repo.approveKyc(id);
  }

  return { stats, queue, kyc, velocity, loading, error, reload: load, approveTicket, rejectTicket, approveKycSubmission };
}
