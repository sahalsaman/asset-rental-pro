export enum UserRoles {
  OWNER = 'Owner',
  MANAGER = 'Manager', 
  USER = 'User', 
  ADMIN = 'Admin'
}


export enum PropertyType {
  SHOP_BUILDING = "Shop Building",
  HOTEL = "Hotel",
  LODGE_ROOM = "Lodge/Room",
  PG_HOSTEL = "PG/Hostel",
  HOUSE = "House",
  FLAT_APARTMENT = "Flat/Apartment",
  TURF = "Turf",
  CONFERENCE_HALL = "Conference Hall",
  AUDITORIUM = "Auditorium",
  GODOWN = "Godown",
  OFFICE_SPACE = "Office Room",
  CO_WORKING_SPACE = "Co-Working Room",
  LAND_SPACE = "Land Room",
  REST_SPACE = "Rest Room",
  RESORT = "Resort",
}


// 📌 Property Status
export enum PropertyStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  DRAFT = "Draft",
}

// 📌 Room Status (inside property: room, bed, hall, etc.)
export enum RoomStatus {
  AVAILABLE = "Available",
  PARTIALLYOCCUPIED = "Partially Occupied",
  OCCUPIED = "Occupied",
  MAINTENANCE = "Maintenance",
  RESERVED = "Reserved",
}

// 📌 Booking Status
export enum BookingStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  CANCELLED = "Cancelled",
  CHECKED_IN = "Checked-In",
  CHECKED_OUT = "Checked-Out",
}

// 📌 Invoice Status
export enum InvoiceStatus {
  PENDING = "Pending",
  PAID = "Paid",
  OVERDUE = "Overdue",
  BALANCE = "Balance",
  CANCELLED = "Cancelled",
  REFUNDED = "Refunded",
  CARRYFORWORDED = "carry forworded",
}

// 📌 Transaction Type
export enum TransactionType {
  CREDIT = "Credit",
  DEBIT = "Debit",
  UPI = "UPI",
  INHAND = "In hand",
}

export enum RentAmountType {
  ADVANCE = "Advance",
  RENT = "Rent",
}

export enum CurrencyType {
  INR = '₹',
  AED = 'د.إ',
  USD = '$',
  EUR = '€',
  GBP = '£',
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

export enum SubscritptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial',
  PENDING = 'pending',
}

export enum SubscritptionBillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}



export const FLAT_TYPES = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];


// utils/statusColors.ts
export const statusColorMap: Record<string, string> = {
  // 🏠 Property Status
  Active: "bg-green-100 text-green-800",
  Inactive: "bg-gray-100 text-gray-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Draft: "bg-slate-100 text-slate-800",

  // 🛏️ Room Status
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
