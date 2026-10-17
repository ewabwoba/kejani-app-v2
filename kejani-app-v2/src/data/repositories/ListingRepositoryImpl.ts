import { ListingRepository, ListingSearchParams, NewListingInput } from '../../domain/repositories/ListingRepository';
import { Listing } from '../../domain/entities/Listing';
import { httpClient } from '../api/httpClient';
import { ListingDto } from '../dto/ListingDto';
import { toListingEntity } from '../mappers/listingMapper';

export class ListingRepositoryImpl extends ListingRepository {
  async search(params: ListingSearchParams): Promise<Listing[]> {
    const query = new URLSearchParams();
    if (params.query) query.set('q', params.query);
    if (params.county) query.set('county', params.county);
    if (params.propertyType) query.set('type', params.propertyType);
    if (params.maxRentKsh) query.set('maxRent', String(params.maxRentKsh));
    if (params.nearMe) {
      query.set('lat', String(params.nearMe.lat));
      query.set('lng', String(params.nearMe.lng));
      query.set('radiusKm', String(params.maxRadiusKm ?? 5));
    }

    const dtos = await httpClient<ListingDto[]>(`/api/listings?${query.toString()}`);
    return dtos.map(toListingEntity);
  }

  async getById(id: string): Promise<Listing | null> {
    try {
      const dto = await httpClient<ListingDto>(`/api/listings/${id}`);
      return toListingEntity(dto);
    } catch {
      return null;
    }
  }

  async toggleSaved(listingId: string, userId: string): Promise<void> {
    await httpClient<void>(`/api/users/${userId}/saved-listings/${listingId}`, {
      method: 'POST',
    });
  }

  async create(input: NewListingInput): Promise<Listing> {
    const dto = await httpClient<ListingDto>('/api/listings', { method: 'POST', body: input });
    return toListingEntity(dto);
  }
}
