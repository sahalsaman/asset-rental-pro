
export interface IAuth {
  _id?: string;
  phone: string;
  otp?: string;
  role: 'owner' | 'tenant' | 'admin';
  otpExpireTime?: Date;
  userId?: string; 
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  firstName: string;
  lastName?: string;
  email?: string;
  role: 'owner' | 'tenant' | 'admin';
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProperty {
  _id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  category: 'Room' | 'Hotel' | 'Hostel';
  images: string[];
  amount: number;
  rentType: 'Day' | 'Week' | 'Month' | 'Year';
  status: 'active' | 'inactive';
  advance: number;
  advanceDescription: string;
  currency: string;
  userId?: string;
  ownerId: string;
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ISpace {
  _id?: string;
  propertyId: string;
  name: string;
  type: string; // e.g. 2BHK, 4 bed
  amount: number;
  description: string;
  floor: number;
  images: string[];
  rentType: 'Day' | 'Week' | 'Month' | 'Year';
  status: 'available' | 'booked' | 'maintenance';
  advance: number;
  advanceDescription: string;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IBooking {
  _id?: string;
  userId: string;
  propertyId: string;
  spaceId: string;
  checkIn: Date;
  checkOut: Date;
  amount: number;
  advance: number;
  currency: string;
  bookingType: 'single' | 'recurring';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IInvoice {
  _id?: string;
  bookingId: string;
  amount: number;
  type: 'Advance' | 'Rent';
  transactionType: 'online' | 'cash' | 'upi' | 'card';
  transactionId?: string;
  status: 'paid' | 'unpaid' | 'failed';
  due?: Date;
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
