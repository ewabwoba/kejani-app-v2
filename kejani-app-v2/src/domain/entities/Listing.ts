/**
 * Domain entity — pure business shape, no API/DB concerns.
 * This is what use-cases and UI depend on. The data layer is responsible
 * for mapping raw API/Firestore payloads into this shape (see mappers/).
 */

export type PropertyType =
  | 'single_room'
  | 'bedsitter'
  | 'one_bedroom'
  | 'two_bedroom'
  | 'commercial';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;
  title: string;
  propertyType: PropertyType;
  rentKsh: number;
  depositKsh: number;
  serviceChargeKsh: number;
  /** Ward/estate level only until a viewing is confirmed — mirrors the
   *  "Location Hidden until confirmed" safety pattern from the listing
   *  detail screen; exact GeoPoint and `addressFull` are withheld by the
   *  repository layer, not the UI, so they can never leak by accident. */
  estate: string;
  county: string;
  approxLocation: GeoPoint;
  addressFull?: string; // only populated once a viewing is CONFIRMED
  nearestLandmark?: string;
  landlord: {
    id: string;
    name: string;
    phone: string;
    verified: boolean;
    verifiedSince?: string;
  };
  amenities: string[]; // e.g. ['borehole', 'prepaid_electricity', 'gated']
  houseRules?: string;
  photos: string[];
  availability: 'available' | 'fully_booked' | 'unavailable';
  availableSlots: number;
  rating: number;
  /** Paid placement — landlords buy this via M-Pesa (purpose:
   *  "Premium Boost"). Surfaced in UI as a ribbon, never as a rank
   *  override that hides better/cheaper matches from the tenant. */
  isBoosted: boolean;
  distanceFromUserKm?: number; // populated by geolocation use-case, optional
}
