import { ListingRepository, ListingSearchParams } from '../repositories/ListingRepository';
import { Listing, GeoPoint } from '../entities/Listing';

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.asin(Math.sqrt(h));
}

/**
 * Business rule: "Near Me" search must work in any Kenyan town, not just
 * Nairobi — so it takes the user's live GeoPoint (from the browser/device
 * geolocation API) and ranks results by real distance rather than a
 * hardcoded list of estates. This is what makes the app extensible to
 * Kisumu, Mombasa, Nakuru, Eldoret, etc. without new code.
 */
export async function searchNearbyListingsUseCase(
  repo: ListingRepository,
  userLocation: GeoPoint,
  params: Omit<ListingSearchParams, 'nearMe'> = {},
): Promise<Listing[]> {
  const results = await repo.search({ ...params, nearMe: userLocation });

  return results
    .map((listing) => ({
      ...listing,
      distanceFromUserKm: haversineKm(userLocation, listing.approxLocation),
    }))
    .sort((a, b) => (a.distanceFromUserKm ?? Infinity) - (b.distanceFromUserKm ?? Infinity));
}
