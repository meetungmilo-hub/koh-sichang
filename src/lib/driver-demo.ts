export type DriverBookingStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export type DriverBooking = {
  id: string;
  packageId: string;
  date: string;
  time: string;
  travelers: number;
  pickup: string;
  places: string[];
  status: DriverBookingStatus;
  createdAt: string;
};

export type DriverProfile = {
  displayName: string;
  experienceYears: string;
  vehicle: string;
  seats: string;
  shortPrice: string;
  overnightPrice: string;
  available: boolean;
  availableTimes: string[];
};

const BOOKINGS_KEY = 'sichang-demo-driver-bookings';
const PROFILE_KEY = 'sichang-demo-driver-profile';

export const emptyDriverProfile: DriverProfile = {
  displayName: '',
  experienceYears: '',
  vehicle: 'Skylab',
  seats: '',
  shortPrice: '',
  overnightPrice: '',
  available: false,
  availableTimes: [],
};

export function readDriverBookings(): DriverBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(BOOKINGS_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(isDriverBooking);
  } catch {
    return [];
  }
}

export function saveDriverBooking(booking: Omit<DriverBooking, 'id' | 'createdAt' | 'status'>): DriverBooking {
  const allBookings = readDriverBookings();
  const newBooking: DriverBooking = {
    ...booking,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify([newBooking, ...allBookings]));
  return newBooking;
}

export function updateDriverBooking(id: string, status: DriverBookingStatus): DriverBooking[] {
  const updated = readDriverBookings().map((booking) => booking.id === id ? { ...booking, status } : booking);
  if (typeof window !== 'undefined') window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return updated;
}

export function readDriverProfile(): DriverProfile {
  if (typeof window === 'undefined') return emptyDriverProfile;
  try {
    const value = JSON.parse(window.localStorage.getItem(PROFILE_KEY) || 'null') as Partial<DriverProfile> | null;
    return value ? { ...emptyDriverProfile, ...value } : emptyDriverProfile;
  } catch {
    return emptyDriverProfile;
  }
}

export function saveDriverProfile(profile: DriverProfile): void {
  if (typeof window !== 'undefined') window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function isDriverBooking(value: unknown): value is DriverBooking {
  if (!value || typeof value !== 'object') return false;
  const booking = value as Partial<DriverBooking>;
  return typeof booking.id === 'string'
    && typeof booking.packageId === 'string'
    && typeof booking.date === 'string'
    && typeof booking.time === 'string'
    && typeof booking.travelers === 'number'
    && typeof booking.pickup === 'string'
    && Array.isArray(booking.places)
    && typeof booking.status === 'string'
    && ['pending', 'accepted', 'declined', 'completed'].includes(booking.status)
    && typeof booking.createdAt === 'string';
}
