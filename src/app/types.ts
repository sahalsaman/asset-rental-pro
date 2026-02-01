import {
  AnnouncementType,
  BookingStatus,
  InvoiceStatus,
  PropertyStatus,
  PropertyType,
  RentAmountType,
  RentFrequency,
  UnitStatus,
  SubscriptionBillingCycle,
  SubscritptionStatus,
  TransactionType,
  UserRoles,
  BankStatus,
  PaymentRecieverOptions,
  SubscritptionPaymentStatus,
  SubscritptionPlan,
  LeadStatus
} from "@/utils/contants";

// ✅ User Interface
export interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  countryCode?: string; // default "+91"
  phone: string;
  email?: string;
  otp?: string;
  otpExpireTime?: Date;
  otpVerified?: boolean;
  role: UserRoles;
  properties?: string[]; // Property IDs
  organisationId?: string;
  address: string;
  image?: {
    id?: string;
    url?: string;
    delete_url?: string;
  };
  note?: string;
  verificationIdCard?: string;
  verificationIdCardNumber?: string;
  disabled: boolean;
  deleted?: boolean;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Organisation Subscription
export interface IOrgSubscription {
  plan: SubscritptionPlan;
  planId: string;
  status: SubscritptionStatus;
  startDate: Date;
  endDate?: Date;
  billingCycle: SubscriptionBillingCycle;
  unitPrice: number;
  paymentMethod: string;
  autoRenew: boolean;
  lastPaymentDate?: Date;
  nextBillingDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Vendor Razorpay Account
export interface IVendorRazorpayAccount {
  balance?: number;
  contact?: {
    name?: string;
    email?: string;
    contact?: string;
    type?: string;
  };
  contact_id?: string;
  account_type?: string;
  bank_account?: {
    name?: string;
    ifsc?: string;
    account_number?: string;
  };
  fundAccountId?: string;
}

// ✅ Organisation Interface
export interface IOrganisation {
  _id?: string;
  name: string;
  address?: string;
  logo?: string;
  owner: string; // userId
  website?: string;
  subscription?: IOrgSubscription;
  vendorRazerpayAccount?: IVendorRazorpayAccount;
  selctedSelfRecieveBankOrUpi?: string;
  is_paymentRecieveSelf?: boolean;
  disabled?: boolean;
  deleted?: boolean;
  remark?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Subscription Payment
export interface ISubscriptionPayment {
  _id?: string;
  organisationId?: any;
  plan: string;
  status: SubscritptionPaymentStatus;
  startDate: Date;
  endDate?: Date;
  no_of_units: number;
  unit_price: number;
  total_price: number;
  paymentMethod: string;
  razorpay_orderId?: string;
  razorpay_paymentId?: string;
  razorpay_signature?: string;
  razorpay_status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Property
export interface IProperty {
  _id?: string;
  organisationId?: any;
  name: string;
  description?: string;
  amenities?: string[];
  services?: string[];
  images?: {
    id?: string;
    url: string;
    delete_url?: string;
  }[];
  videoUrl?: string[];
  address: string;
  city: string;
  state: string;
  country?: string;
  zipCode?: string;
  status: PropertyStatus;
  category: PropertyType;
  currency: string;
  disabled: boolean;
  deleted?: boolean;
  managers?: string[];
  selctedSelfRecieveBankOrUpi?: string;
  is_paymentRecieveSelf: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Unit
export interface IUnit {
  _id?: string;
  organisationId?: any;
  propertyId?: any;
  name?: string;
  type?: string;
  amount?: number;
  advanceAmount?: number;
  description?: string;
  frequency: RentFrequency;
  status: UnitStatus;
  noOfSlots: number;
  numberOfUnits?: number;
  currentBooking?: number;
  bookings?: string[];
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Booking
export interface IBooking {
  _id?: string;
  organisationId?: any;
  propertyId?: any;
  unitId: any;
  code: string;
  userId: any;
  checkIn?: Date | string;
  checkOut?: Date | string;
  amount: number;
  advanceAmount?: number;
  frequency: RentFrequency;
  status: BookingStatus;
  lastInvoiceId?: string;
  nextBillingDate?: Date;
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Invoice
export interface IInvoice {
  _id?: string;
  organisationId?: any;
  bookingId: any;
  propertyId?: any;
  unitId: any;
  invoiceId: string;
  amount: number;
  balance?: number;
  carryForwarded?: number;
  type: RentAmountType | string;
  status: InvoiceStatus;
  dueDate: Date;
  paymentGateway?: TransactionType;
  paymentId?: string;
  paidAt?: Date ;
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Self Receive Bank / UPI
export interface ISelfRecieveBankOrUpi {
  _id?: string;
  organisation: string;
  paymentRecieverOption: PaymentRecieverOptions;
  accountHolderName: string;
  value: string; // accountNo or upiId or qrcode_link
  ifsc?: string;
  bankName?: string;
  branch?: string;
  image?: {
    id?: string;
    url?: string;
    delete_url?: string;
  };
  upiPhoneCountryCode?: string;
  status: BankStatus;
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Announcement
export interface IAnnouncement {
  _id?: string;
  organisationId?: any;
  propertyId?: string;
  title: string;
  message: string;
  audienceType: AnnouncementType;
  attachments?: string[];
  createdBy: string;
  disabled: boolean;
  deleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
