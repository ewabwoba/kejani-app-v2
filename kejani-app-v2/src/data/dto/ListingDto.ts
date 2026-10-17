/** Raw shape exactly as the Spring Boot controller serializes it. */
export interface ListingDto {
  id: string;
  title: string;
  propertyType: string;
  rentAmountKsh: number;
  depositAmountKsh: number;
  serviceChargeKsh: number;
  estateName: string;
  countyName: string;
  latitude: number;
  longitude: number;
  addressFull: string | null; // only present once a viewing is CONFIRMED
  nearestLandmark: string | null;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  landlordVerified: boolean;
  landlordVerifiedSince: string | null;
  amenityTags: string[];
  houseRules: string | null;
  photoUrls: string[];
  availabilityStatus: string;
  availableSlots: number;
  rating: number;
  isBoosted: boolean;
}
