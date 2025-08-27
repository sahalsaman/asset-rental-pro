export interface IUser {
  _id?: string;
  firstName: string;
  lastName?: string;
  phone: string;
  otp?: string;
  role: 'owner' | 'manager' | 'user' | 'admin';
  otpExpireTime?: Date;
  signupCompleted?: boolean;
  lastLogin?: Date;
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProperty {
  _id?: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status:string;
  category: 'Room' | 'Hotel' | 'Hostel';
  images: string[];
  currency: string;
  userId?: string; 
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
  images: string[];
  rentType: 'Day' | 'Week' | 'Month' | 'Year';
  status: 'available' | 'booked' | 'maintenance';
  advanceAmount?: number; // renamed in schema
  noOfSlots: number;
  bookingsCount?: number; // added to track bookings
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: string;
  propertyId: string;
  spaceId: string;
  fullName: string;
  phone: string;
  address: string;
  vericationIdCard?: string;
  vericationIdCardNumber?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  advanceAmount?: number;
  status?: string;
  disabled?: boolean;
    createdAt?: Date;
  updatedAt?: Date;
}

export interface IInvoice {
  _id?: string;
  bookingId: string; // Required in schema
  propertyId: string; // Required in schema
  spaceId: string; // Required in schema
  amount?: number;
  type: "Advance" | "Rent";
  transactionType: "online" | "cash" | "upi" | "card";
  transactionId?: string;
  status: "paid" | "unpaid" | "failed";
  recivedDate?: Date; // Present in schema, optional in interface
  dueDate?: Date;     // Schema uses `dueDate`
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
