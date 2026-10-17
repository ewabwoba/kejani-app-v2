import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Listing, PropertyType } from '../../../domain/entities/Listing';
import { RADIUS_PRESETS_KM, RadiusPresetKm } from '../../../domain/repositories/ListingRepository';
import { ListingRepositoryImpl } from '../../../data/repositories/ListingRepositoryImpl';
import { searchNearbyListingsUseCase } from '../../../domain/use-cases/searchNearbyListingsUseCase';
import { getSavedListingIds, toggleSavedListingId } from '../../../data/local/savedListingsStore';
import { trackEvent } from '../../hooks/useAnalytics';

const repo = new ListingRepositoryImpl();

export function useDiscoverViewModel() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<RadiusPresetKm>(5);
  const [propertyType, setPropertyType] = useState<PropertyType | 'all'>('all');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setLocationNotice(null);

    async function searchWithoutLocation(notice: string) {
      const results = await repo.search({
        propertyType: propertyType === 'all' ? undefined : propertyType,
        query: query || undefined,
      });
      setListings(results);
      setLocationNotice(notice);
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Denied — fall back to a county-wide search so the app still
        // works; this is what makes "All Kenya" mode necessary.
        await searchWithoutLocation('Location permission denied — showing listings across Kenya instead.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const results = await searchNearbyListingsUseCase(
        repo,
        { lat: position.coords.latitude, lng: position.coords.longitude },
        {
          maxRadiusKm: radiusKm,
          propertyType: propertyType === 'all' ? undefined : propertyType,
          query: query || undefined,
        },
      );
      setListings(results);
      trackEvent('discover_search', { radiusKm, propertyType, resultCount: results.length });
    } catch {
      // Location services off, timed out, or the device has no GPS/emulator
      // fix — same graceful fallback either way.
      await searchWithoutLocation('Location unavailable — showing listings across Kenya instead.');
    } finally {
      setLoading(false);
    }
  }, [radiusKm, propertyType, query]);

  useEffect(() => {
    getSavedListingIds().then(setSavedIds);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleSave(id: string) {
    const next = await toggleSavedListingId(id);
    setSavedIds(next);
    trackEvent('listing_save_toggled', { listingId: id, saved: next.includes(id) });
  }

  return {
    listings,
    savedIds,
    loading,
    locationNotice,
    radiusKm,
    setRadiusKm,
    propertyType,
    setPropertyType,
    query,
    setQuery,
    reload: load,
    toggleSave,
    radiusPresets: RADIUS_PRESETS_KM,
  };
}
