import { app_config } from "../../app-config";
import { SubscriptionBillingCycle } from "./contants";

export const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
];

export const defaultData = {
  country: "India",
  countryCodes: "+91",
}

export const propertyAmenities = [
  // --- Basic Amenities ---
  { name: "AC Included", value: "air_conditioning" },
  { name: "Wi-Fi", value: "wifi" },
  { name: "Television", value: "television" },
  { name: "Refrigerator", value: "refrigerator" },
  { name: "Washing Machine", value: "washing_machine" },
  { name: "Kitchen", value: "kitchen" },
  { name: "Geyser / Water Heater", value: "geyser" },
  { name: "Power Backup", value: "power_backup" },

  // --- Furniture & Fixtures ---
  { name: "Furnished", value: "furnished" },
  { name: "Semi-Furnished", value: "semi_furnished" },

  // --- Building Amenities ---
  { name: "Lift / Elevator", value: "lift" },
  { name: "Parking", value: "parking" },
  { name: "Security / CCTV", value: "security" },
  { name: "Fire Safety", value: "fire_safety" },
  { name: "24/7 Water Supply", value: "water_supply" },
  { name: "Gym / Fitness Center", value: "gym" },
  { name: "Swimming Pool", value: "swimming_pool" },
  { name: "Garden / Park", value: "garden" },
  { name: "Play Area", value: "play_area" },

  // --- Outdoor & Views ---
  { name: "Rooftop Access", value: "rooftop_access" },
  { name: "BBQ Area", value: "bbq_area" },
  { name: "Outdoor Seating", value: "outdoor_seating" },
  { name: "Lake View", value: "lake_view" },
  { name: "Sea View", value: "sea_view" },
  { name: "Mountain View", value: "mountain_view" },

  // --- Accessibility ---
  { name: "Wheelchair Accessible", value: "wheelchair_accessible" },
  { name: "Pet Friendly", value: "pet_friendly" },
];

export const propertyServices = [
  // --- Daily / Maintenance Services ---
  { name: "Housekeeping", value: "housekeeping" },
  { name: "Laundry Service", value: "laundry_service" },
  { name: "Maintenance Staff", value: "maintenance_staff" },
  { name: "Room Service", value: "room_service" },
  { name: "Concierge Service", value: "concierge_service" },
  { name: "Reception / Front Desk", value: "reception" },
  { name: "Luggage Storage", value: "luggage_storage" },

  // --- Safety & Security Services ---
  { name: "Security Guard", value: "security_guard" },
  { name: "First Aid Kit", value: "first_aid" },
  { name: "Smoke Detector", value: "smoke_detector" },

  // --- Business & Tech Services ---
  { name: "Conference Room", value: "conference_room" },
  { name: "Work Desk", value: "work_desk" },
  { name: "Co-working Space", value: "co_working" },

  // --- Hospitality & Guest Services ---
  { name: "Breakfast Included", value: "breakfast_included" },
  { name: "Restaurant On Site", value: "restaurant_on_site" },
  { name: "Bar / Lounge", value: "bar" },
  { name: "Spa / Wellness Center", value: "spa" },
  { name: "Shuttle Service", value: "shuttle_service" },
  { name: "Airport Transfer", value: "airport_transfer" },

  // --- Nearby Facilities ---
  { name: "Public Transport Nearby", value: "public_transport" },
  { name: "ATM Nearby", value: "atm_nearby" },
  { name: "Shopping Mall Nearby", value: "shopping_nearby" },
];



export const subscription_plans = [
  {
    id: "arp_subscription_trial",
    name: "Free",
    amount: 0,
    price: "₹0",
    price_display: false, billingCycle: SubscriptionBillingCycle.MONTHLY,
    period: "per month",
    description: "Perfect for new landlords managing a few assets.",
    features: [
      "Digital invoices",
      "Track dues & settlements",
      "Individual property web page",
      "Digital accounting with profit & loss",
    ],
    buttonText: "Start Free Trial",
    buttonLink: "/subscription",
    buttonStyle: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    borderColor: "border-transparent",
  },
  {
    id: "arp_subscription_21",
    name: "Basic",
    amount: 29,
    price: "₹29",
    price_display: true,
    billingCycle: SubscriptionBillingCycle.MONTHLY,
    period: "per month",
    description: "Per Unit/Room",
    features: [
      "Automated rent collection reminders",
      "Digital invoices",
      "Track dues & settlements",
      "Advanced analytics dashboard",
      "Individual property web page",
      "Digital accounting with profit & loss",
    ],
    buttonText: "Choose Basic",
    buttonLink: "/subscription?plan=basic",
    buttonStyle: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    borderColor: "border-transparent",
    highlight: false,
  },
  {
    id: "arp_subscription_pro47",
    name: "Pro",
    amount: 49,
    price: "₹49",
    price_display: true,
    billingCycle: SubscriptionBillingCycle.MONTHLY,
    period: "per month",
    description: "Per Unit/Room",
    features: [
      "Automated rent collection with reminders",
      "Digital invoices",
      "Track dues & settlements",
      "Advanced analytics dashboard",
      "Individual property web page",
      "Digital accounting with profit & loss",
      "Tenant check-in / check-out QR code",
      "Announcements",
      "Manager control access",
    ],
    buttonText: "Choose Pro",
    buttonLink: "/subscription?plan=pro",
    buttonStyle: "bg-green-700 text-white hover:bg-green-600",
    borderColor: "border-green-700",
    highlight: true,
  },
];


