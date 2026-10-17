import { ViewingAppointment } from '../entities/ViewingAppointment';

export interface CreateAppointmentInput {
  listingId: string;
  preferredDate: string;
  preferredTime: string;
}

export interface InitiateEscrowInput {
  appointmentId: string;
  mpesaPhoneNumber: string;
  amountKsh: number;
}

export abstract class BookingRepository {
  abstract createAppointment(input: CreateAppointmentInput): Promise<ViewingAppointment>;
  /** Triggers an STK push; the actual HELD/RELEASED/REFUNDED transition
   *  happens server-side via M-Pesa callback, so this only confirms the
   *  push was sent — the UI must poll or subscribe for the final status. */
  abstract initiateEscrowPayment(input: InitiateEscrowInput): Promise<{ requestSent: boolean }>;
  abstract getAppointment(id: string): Promise<ViewingAppointment | null>;
  abstract listMyAppointments(userId: string): Promise<ViewingAppointment[]>;
}
