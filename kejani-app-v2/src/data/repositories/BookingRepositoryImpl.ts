import {
  BookingRepository,
  CreateAppointmentInput,
  InitiateEscrowInput,
} from '../../domain/repositories/BookingRepository';
import { ViewingAppointment } from '../../domain/entities/ViewingAppointment';
import { httpClient } from '../api/httpClient';

export class BookingRepositoryImpl extends BookingRepository {
  async createAppointment(input: CreateAppointmentInput): Promise<ViewingAppointment> {
    return httpClient<ViewingAppointment>('/api/appointments', { method: 'POST', body: input });
  }

  async initiateEscrowPayment(input: InitiateEscrowInput): Promise<{ requestSent: boolean }> {
    return httpClient<{ requestSent: boolean }>('/api/escrow/mpesa/stk-push', {
      method: 'POST',
      body: input,
    });
  }

  async getAppointment(id: string): Promise<ViewingAppointment | null> {
    try {
      return await httpClient<ViewingAppointment>(`/api/appointments/${id}`);
    } catch {
      return null;
    }
  }

  async listMyAppointments(userId: string): Promise<ViewingAppointment[]> {
    return httpClient<ViewingAppointment[]>(`/api/users/${userId}/appointments`);
  }
}
