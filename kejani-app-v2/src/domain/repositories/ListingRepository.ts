import { Listing, GeoPoint, PropertyType } from '../entities/Listing';

/** 999 is the sentinel the backend treats as unbounded ("All Kenya") —
 *  named here so the UI picks from this list instead of typing a number. */
export const RADIUS_PRESETS_KM = [1, 5, 10, 20, 50, 999] as const;
export type RadiusPresetKm = (typeof RADIUS_PRESETS_KM)[number];

export interface ListingSearchParams {
  /** Free text: estate, ward, street — dynamic, not a hardcoded enum,
   *  so it scales from Nairobi estates to Kisumu, Mombasa, Nakuru, Eldoret. */
  query?: string;
  county?: string; // 'All' = every county, matches the backend's own default
  propertyType?: PropertyType;
  nearMe?: GeoPoint;
  maxRadiusKm?: RadiusPresetKm;
  maxRentKsh?: number;
}

/**
 * Abstract contract — the domain layer never imports Axios/Firebase directly.
 * Concrete implementations live in data/repositories/.
 */
export abstract class ListingRepository {
  abstract search(params: ListingSearchParams): Promise<Listing[]>;
  abstract getById(id: string): Promise<Listing | null>;
  abstract toggleSaved(listingId: string, userId: string): Promise<void>;
  abstract create(input: NewListingInput): Promise<Listing>;
}

/** Fields a landlord fills in on the Add Listing form. Server assigns id,
 *  verification-derived landlord fields, and defaults isBoosted to false —
 *  boosting is a separate paid action, never set at creation time. */
export interface NewListingInput {
  title: string;
  propertyType: PropertyType;
  rentKsh: number;
  depositKsh: number;
  serviceChargeKsh: number;
  county: string;
  estate: string;
  nearestLandmark?: string;
  amenities: string[];
  houseRules?: string;
  photos: string[];
}
