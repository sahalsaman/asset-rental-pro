export const USER_ROLES = ['owner', 'manager', 'user', 'admin'];
 

export enum PropertyType  {
  SHOP_BUILDING= "Shop Building",
  HOTEL= "Hotel",
  LODGE_ROOM="Lodge/Room",
  PG_HOSTEL= "PG/Hostel",
  HOUSE= "House",
  FLAT_APARTMENT= "Flat/Apartment",
  TURF= "Turf",
  CONFERENCE_HALL= "Conference Hall",
  AUDITORIUM= "Auditorium",
  GODOWN= "Godown",
  OFFICE_SPACE= "Office Room",
  CO_WORKING_SPACE= "Co-Working Room",
  LAND_SPACE= "Land Room",
  REST_SPACE= "Rest Room",
  RESORT= "Resort",
}


// 📌 Property Status
export enum PropertyStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending",
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
  CARRYFORWORDED  = "carry forworded",
}

// 📌 Transaction Type
export enum TransactionType {
  CREDIT = "Credit",
  DEBIT = "Debit",
  UPI = "UPI",
  INHAND = "In hand",
}



export enum CurrencyType {
  INR = '₹',
  AED = 'د.إ',
  USD = '$',
  EUR = '€',
  GBP = '£',
}

export enum RentDuration {
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year',
}


export const FLAT_TYPES = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];