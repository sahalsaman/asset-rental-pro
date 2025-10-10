import { AnnouncementType, BookingStatus, InvoiceStatus, PropertyStatus, PropertyType, RentAmountType, RentFrequency, RoomStatus, SubscritptionBillingCycle, SubscritptionStatus, TransactionType, UserRoles } from "@/utils/contants";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName?: string;
  countryCode?: string; // default "+91"
  phone: string;
  otp?: string;
  role: UserRoles;
  otpExpireTime?: Date;
  onboardingCompleted?: boolean;
  lastLogin?: Date;
  properties?: any[]; // Array of Property IDs
  organisationId?: any;
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrganisation {
  _id?: string;
  name: string;
  address?: string;
  logo?: string;
  owner: string; // userId
  website?: string;
  disabled: boolean;
  deleted: boolean;
  subscription?: any; // Org_subscription reference
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUsageLimits {
  property: number;
  rooms: number;
  bookings: number;
}

export interface IOrgSubscription {
  _id?: string;
  organisation: string ;
  plan: string;
  status: SubscritptionStatus;
  startDate: Date;
  endDate?: Date;
  billingCycle: SubscritptionBillingCycle;
  amount: number;
  paymentMethod: string;
  autoRenew: boolean;

  trialDays: number;
  trialStarted?: Date;
  trialEndDate?: Date;
  trialCompleted: boolean;

  usageLimits?: IUsageLimits;

  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubscriptionPayment {
  _id?: string;
  organisation: string ;
  subscription: string;
  plan: string;
  status: SubscritptionStatus;
  startDate: Date;
  endDate?: Date;
  amount: number;
  paymentMethod: string;
  usageLimits?: IUsageLimits;

  razorpay_orderId?: string;
  razorpay_paymentId?: string;
  razorpay_signature?: string;
  razorpay_status?: string;

  createdAt?: Date;
  updatedAt?: Date;
}


export interface IProperty {
  _id?: string;
  organisationId?: any;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  zipCode?: string;
  status: PropertyStatus;
  category: PropertyType;
  images: string[];
  currency: string;
  managers?: any[]; // user IDs
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IRoom {
  _id?: string;
  organisationId: any;
  propertyId: any;
  name: string;
  type: string; // Example: 2BHK, 4 Bed
  amount: number;
  description?: string;
  images: string[];
  frequency: RentFrequency;
  status: RoomStatus;
  advanceAmount?: number;
  noOfSlots: number;
  currentBooking?: number;
  bookings?: any[]; // Array of booking IDs
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IBooking {
  _id?: string;
  organisationId: any;
  propertyId: any;
  roomId: any;
  fullName: string;
  countryCode: string;
  phone: string;
  whatsappCountryCode: string;
  whatsappNumber: string;
  address: string;
  verificationIdCard?: string;
  verificationIdCardNumber?: string;
  checkIn?: Date | string;
  checkOut?: Date | string;
  amount: number;
  advanceAmount?: number;
  status: BookingStatus;
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IInvoice {
  _id?: string;
  organisationId: any;
  bookingId: any;
  propertyId: any;
  roomId: any;
  invoiceId: string;
  amount: number;
  balance?: number;
  carryForwarded?: number;
  type: RentAmountType|string;
  status: InvoiceStatus;
  dueDate: Date;
  paymentGateway: "razorpay" | "upi" | "cash" | "manual";
  disabled: boolean;
  deleted?: boolean;
  payments?: IPayment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayment {
  date?: Date;
  amount: number;
  transactionId: string;
  transactionType?: TransactionType | string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  gateway?: string;
  notes?: string;
}

export interface IAnnouncement {
  _id?: string;
  organisationId: any;
  propertyId: any;
  title: string;
  message: string;
  audienceType: AnnouncementType | string;
  attachments?: string[];
  createdBy: string;
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
