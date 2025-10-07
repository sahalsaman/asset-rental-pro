import { InvoiceStatus, RentAmountType, TransactionType } from "@/utils/contants";

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
  status: string;
  category: 'Room' | 'Hotel' | 'Hostel';
  images: string[];
  currency: string;
  userId?: string;
  disabled: boolean;
  organisationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoom {
  _id?: string;
  propertyId: IProperty| string;
  name: string;
  type: string; // e.g. 2BHK, 4 bed
  amount: number;
  description: string;
  images: string[];
  frequency: 'Day' | 'Week' | 'Month' | 'Year';
  status: string;
  advanceAmount?: number; // renamed in schema
  noOfSlots: number;
  bookingsCount?: number; // added to track bookings
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: string;
  propertyId: IProperty| string;
  roomId: IRoom|string; 
  property?: IProperty;
  room?: IRoom;
  fullName: string;
  phone: string;
  whatsappNumber?: string;
  address: string;
  verificationIdCard?: string;
  verificationIdCardNumber?: string;
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
  invoiceId?: string; // Added for better invoice numbering
  _id?: string;
  bookingId: IBooking|string; // Required in schema
  propertyId: IProperty| string; // Required in schema
  roomId: IRoom|string; // Required in schema
  amount?: number;
  type: RentAmountType;
  transactionType: TransactionType;
  transactionId?: string;
  status: InvoiceStatus;
  recivedDate?: Date; // Present in schema, optional in interface
  dueDate?: Date;     // Schema uses `dueDate`
  disabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAnnouncement {
  _id: string;
  organisationId: string;
  title: string;
  message: string;
  audience: "all" | "employees" | "customers";
  disabled?: boolean;
  attachments?: string[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}
