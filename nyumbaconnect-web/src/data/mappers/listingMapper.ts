import { Listing, PropertyType } from '../../domain/entities/Listing';
import { ListingDto } from '../dto/ListingDto';

const AVAILABILITY_MAP: Record<string, Listing['availability']> = {
  AVAILABLE: 'available',
  FULLY_BOOKED: 'fully_booked',
  UNAVAILABLE: 'unavailable',
};

export function toListingEntity(dto: ListingDto): Listing {
  return {
    id: dto.id,
    title: dto.title,
    propertyType: dto.propertyType.toLowerCase() as PropertyType,
    rentKsh: dto.rentAmountKsh,
    depositKsh: dto.depositAmountKsh,
    serviceChargeKsh: dto.serviceChargeKsh,
    estate: dto.estateName,
    county: dto.countyName,
    approxLocation: { lat: dto.latitude, lng: dto.longitude },
    addressFull: dto.addressFull ?? undefined,
    nearestLandmark: dto.nearestLandmark ?? undefined,
    landlord: {
      id: dto.landlordId,
      name: dto.landlordName,
      phone: dto.landlordPhone,
      verified: dto.landlordVerified,
      verifiedSince: dto.landlordVerifiedSince ?? undefined,
    },
    amenities: dto.amenityTags,
    houseRules: dto.houseRules ?? undefined,
    photos: dto.photoUrls,
    availability: AVAILABILITY_MAP[dto.availabilityStatus] ?? 'unavailable',
    availableSlots: dto.availableSlots,
    rating: dto.rating,
    isBoosted: dto.isBoosted,
  };
}
