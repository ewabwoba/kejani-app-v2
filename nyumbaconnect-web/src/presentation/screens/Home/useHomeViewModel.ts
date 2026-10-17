import { useEffect, useState, useCallback } from 'react';
import { Listing, PropertyType } from '../../../domain/entities/Listing';
import { ListingRepositoryImpl } from '../../../data/repositories/ListingRepositoryImpl';
import { searchNearbyListingsUseCase } from '../../../domain/use-cases/searchNearbyListingsUseCase';
import { trackEvent } from '../../hooks/useAnalytics';

const repo = new ListingRepositoryImpl();

export function useHomeViewModel() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<PropertyType | 'all'>('all');

  const loadNearby = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 }),
      );
      const results = await searchNearbyListingsUseCase(repo, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setListings(results);
      trackEvent('home_near_me_search', { resultCount: results.length });
    } catch {
      // Geolocation denied/unavailable — fall back to a plain search so the
      // app still works (common on desktop browsers / users who decline).
      const results = await repo.search({});
      setListings(results);
      setError('Location unavailable — showing all listings instead.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNearby();
  }, [loadNearby]);

  return { listings, loading, error, activeType, setActiveType, reload: loadNearby };
}
