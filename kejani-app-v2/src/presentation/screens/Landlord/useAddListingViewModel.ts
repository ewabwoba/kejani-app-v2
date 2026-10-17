import { useState } from 'react';
import { PropertyType } from '../../../domain/entities/Listing';
import { NewListingInput } from '../../../domain/repositories/ListingRepository';
import { ListingRepositoryImpl } from '../../../data/repositories/ListingRepositoryImpl';
import { trackEvent } from '../../hooks/useAnalytics';

const repo = new ListingRepositoryImpl();

const AMENITY_OPTIONS = [
  'borehole', 'prepaid_electricity', 'gated', 'cctv', 'parking', 'wifi', 'water_included',
] as const;

export function useAddListingViewModel(onCreated: (listingId: string) => void) {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('bedsitter');
  const [rentKsh, setRentKsh] = useState('');
  const [depositKsh, setDepositKsh] = useState('');
  const [serviceChargeKsh, setServiceChargeKsh] = useState('0');
  const [county, setCounty] = useState('Nairobi');
  const [estate, setEstate] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [houseRules, setHouseRules] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleAmenity(a: string) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function addMockPhoto() {
    // Real implementation opens the native image picker and uploads to
    // Firebase Storage / S3, then pushes the returned URL here.
    setPhotos((prev) => [...prev, `local-photo-${prev.length + 1}`]);
  }

  const isValid =
    title.trim().length > 2 &&
    Number(rentKsh) > 0 &&
    Number(depositKsh) >= 0 &&
    estate.trim().length > 1 &&
    photos.length > 0;

  async function handleSubmit() {
    if (!isValid) {
      setError('Fill in the title, rent, deposit, estate and at least one photo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const input: NewListingInput = {
      title: title.trim(),
      propertyType,
      rentKsh: Number(rentKsh),
      depositKsh: Number(depositKsh),
      serviceChargeKsh: Number(serviceChargeKsh) || 0,
      county,
      estate: estate.trim(),
      nearestLandmark: nearestLandmark.trim() || undefined,
      amenities,
      houseRules: houseRules.trim() || undefined,
      photos,
    };
    try {
      const created = await repo.create(input);
      trackEvent('landlord_listing_created', { propertyType, county });
      onCreated(created.id);
    } catch {
      setError("Couldn't publish the listing — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    title, setTitle,
    propertyType, setPropertyType,
    rentKsh, setRentKsh,
    depositKsh, setDepositKsh,
    serviceChargeKsh, setServiceChargeKsh,
    county, setCounty,
    estate, setEstate,
    nearestLandmark, setNearestLandmark,
    amenities, toggleAmenity, amenityOptions: AMENITY_OPTIONS,
    houseRules, setHouseRules,
    photos, addMockPhoto,
    submitting, error, isValid,
    handleSubmit,
  };
}
