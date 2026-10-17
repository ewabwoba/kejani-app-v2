import { EscrowStatus } from '../../core/theme/tokens';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ViewingAppointment {
  id: string;
  listingId: string;
  listingTitle: string;
  rentKsh: number;
  preferredDate: string; // ISO date
  preferredTime: string;
  status: AppointmentStatus;
  escrow: {
    deposited: boolean;
    amountKsh: number;
    status: EscrowStatus;
    mpesaReceiptNumber?: string;
  };
  landlord: {
    name: string;
    phone: string;
  };
  /** Withheld until status === 'confirmed' — enforced by the repository,
   *  never trusted to the UI to hide conditionally. */
  addressFull?: string;
}
