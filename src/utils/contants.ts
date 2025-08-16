// utils/constants.ts
export const Roles = {
  ADMIN: "admin",
  OWNER: "owner",
  USER: "user",
};

export const SpaceStatus = {
  AVAILABLE: "available",
  RENTED: "rented",
  MAINTENANCE: "maintenance",
};
          


export const PropertyTypes = {
  SHOP_BUILDING: "Shop Building",
  HOTEL: "Hotel",
  LODGE_ROOM:"Lodge/Room",
  PG_HOSTEL: "PG/Hostel",
  HOUSE: "House",
  FLAT_APARTMENT: "Flat/Apartment",
  TURF: "Turf",
  CONFERENCE_HALL: "Conference Hall",
  AUDITORIUM: "Auditorium",
  GODOWN: "Godown",
  OFFICE_SPACE: "Office Space",
  CO_WORKING_SPACE: "Co-Working Space",
  LAND_SPACE: "Land Space",
  REST_SPACE: "Rest Space",
  RESORT: "Resort",
} as const;

export type PropertyType = typeof PropertyTypes[keyof typeof PropertyTypes];

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