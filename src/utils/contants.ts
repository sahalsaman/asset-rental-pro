export enum UserRoles {
  OWNER = 'Owner',
  MANAGER = 'Manager',
  USER = 'User',
  ADMIN = 'Admin'
}


export enum PropertyType {
  COMMERCIAL_BUILDING = "Cmmercial Building",
  HOTEL = "Hotel",
  PG_HOSTEL = "PG/Hostel",
  HOMESTAY = "Homestay",
  FLAT_APARTMENT = "Flat/Apartment",
  TURF = "Turf",
  CONFERENCE_HALL = "Conference Hall",
  AUDITORIUM = "Auditorium",
  GODOWN = "Godown",
  OFFICE_SPACE = "Office Unit",
  CO_WORKING_SPACE = "Co-Working Unit",
  LAND_SPACE = "Land Unit",
  REST_SPACE = "Rest Unit",
  RESORT = "Resort",
}


// 📌 Property Status
export enum PropertyStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  DRAFT = "Draft",
}

// 📌 Unit Status (inside property: unit, bed, hall, etc.)
export enum UnitStatus {
  AVAILABLE = "Available",
  PARTIALLY_BOOKED = "Partially Booked",
  MAINTENANCE = "Maintenance",
  BOOKED = "Booked",
}

// 📌 Booking Status
export enum BookingStatus {
  // PENDING = "Pending",
  BOOKED = "Booked",
  CHECKED_IN = "Checked-In",
  CHECKED_OUT = "Checked-Out",
  // CANCELLED = "Booking Cancelled",
}

// 📌 Invoice Status
export enum InvoiceStatus {
  PENDING = "Pending",
  PAID = "Paid",
  OVERDUE = "Overdue",
  // BALANCE = "Balance",
  // CANCELLED = "Cancelled",
  // REFUNDED = "Refunded",
  CARRY_FORWARDED = "Carry forwarded",
}

// 📌 Transaction Type
export enum TransactionType {
  RAZORPAY = "razorpay",
  MANUAL = "In Hand",
  CREDIT = "Credit",
  DEBIT = "Debit",
  UPI = "UPI",
  BANK = "Bank",
}

export enum RentAmountType {
  ADVANCE = "Advance",
  RENT = "Rent",
}

export enum CurrencyType {
  INR = '₹',
  // AED = 'د.إ',
  // USD = '$',
  // EUR = '€',
  // GBP = '£',
}

export enum RentFrequency {
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year',
}

export enum AnnouncementType {
  ALL = 'all',
  MANAGERS = 'managers',
  USERS = 'users',
}

export enum SubscritptionPlan {
  FREE = "free",
  BASIC = 'basic',
  PRO = 'pro',
}

export enum SubscritptionStatus {
  FREE = "free",
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum SubscritptionPaymentStatus {
  PENDING = "Pending",
  PAID = "Paid",
  OVERDUE = "Overdue",
}

export enum SubscriptionBillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum BankStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum PaymentStatus {
  CREDIT = "Credit",
  DEBIT = "Debit",
}

export enum PaymentMethod {
  RAZORPAY = "razorpay",
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  UPI = "upi",
}

export enum PaymentType {
  RENT = "rent",
  ADVANCE = "advance",
  SERVICE = "service",
  REFUND = "refund",
}

export enum PaymentRecieverOptions {
  BANK = "Bank",
  UPIPHONE = "UPI Phone",
  UPIQR = "UPI QR",
  UPIID = "UPI ID",
}

export enum LeadStatus {
  NEW = "New",
  CONTACTED = "Contacted",
  PENDING = "Pending",
  REJECTED = "Rejected",
  CLOSED = "Closed"
}



export const FLAT_TYPES = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];


// utils/statusColors.ts
export const statusColorMap: Record<string, string> = {
  // 🏠 Property Status
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Draft: "bg-slate-100 text-slate-800",

  // 🛏️ Unit Status
  Available: "bg-green-100 text-green-800",
  "Partially Occupied": "bg-yellow-100 text-yellow-800",
  Occupied: "bg-red-100 text-red-800",
  Maintenance: "bg-orange-100 text-orange-800",
  Reserved: "bg-blue-100 text-blue-800",

  // 📦 Booking Status
  // Pending: "bg-yellow-100 text-yellow-800", repeated
  Confirmed: "bg-blue-100 text-blue-800",
  Cancelled: "bg-gray-200 text-gray-800",
  "Checked-In": "bg-green-100 text-green-800",
  "Checked-Out": "bg-purple-100 text-purple-800",

  // 💰 Invoice Status
  Paid: "bg-green-100 text-green-800",
  PendingInvoice: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-800",
  Balance: "bg-blue-100 text-blue-800",
  CancelledInvoice: "bg-gray-100 text-gray-800",
  Refunded: "bg-pink-100 text-pink-800",
  "carry forworded": "bg-indigo-100 text-indigo-800",
};


