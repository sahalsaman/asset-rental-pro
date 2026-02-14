import { app_config } from "../../app-config";
import { SubscriptionBillingCycle, SubscritptionPlan } from "./contants";

export const countryCodes = [
  { code: "+91", name: "India" },
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
    plan: SubscritptionPlan.FREE,
    amount: 0,
    price: "₹0",
    price_display: false,
    billingCycle: SubscriptionBillingCycle.MONTHLY,
    period: "booking per month",
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
    plan: SubscritptionPlan.BASIC,
    amount: 29,
    price: "₹29",
    price_display: true,
    billingCycle: SubscriptionBillingCycle.MONTHLY,
    period: "booking per month",
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
    plan: SubscritptionPlan.PRO,
    amount: 49,
    price: "₹49",
    price_display: true,
    billingCycle: SubscriptionBillingCycle.MONTHLY,
    period: "booking per month",
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


export const faq_data = [
  {
    q: "What types of rental assets can I manage?",
    a: "You can manage virtually any type of rental property, including units, apartments, homestays, entire hostels, and even commercial properties. Our system is flexible to support various unit configurations."
  },
  {
    q: "How does the automated invoicing work?",
    a: "Our system automatically generates and sends rent invoices to tenants on a scheduled cycle (monthly, quarterly, etc.). It tracks payment status and sends automated reminders for overdue payments, simplifying your collection process."
  },
  {
    q: "Is there a limit on the number of tenants or users?",
    a: "The user/tenant limit depends on your chosen plan. The Basic plan supports a small number of properties, while the Pro and Enterprise plans allow for significantly more, or unlimited, users and tenants."
  },
  {
    q: `Can I try ${app_config?.APP_NAME} before I subscribe?`,
    a: "Yes! Our Basic plan is 14 days free and allows you to manage 1 property, giving you a comprehensive feel for the platform's core features before committing to a paid subscription."
  }
]

export const review_data = [
  {
    name: "Santhosh Reddy",
    role: "Property Owner, Bengaluru",
    review:
      "This platform has simplified my rent collection and maintenance tracking. Everything is automated — I don’t have to follow up manually anymore!",
    rating: 5,
  },
  {
    name: "Sara Thomas",
    role: "Manager, Mumbai",
    review:
      "The dashboard is intuitive and the support team is excellent. I manage multiple apartments easily from one place!",
    rating: 5,
  },
  {
    name: "Mohammed Rafi",
    role: "Building Owner, Kochi",
    review:
      "Highly recommend it for small business owners like me. The invoicing system and reports are a game-changer.",
    rating: 4,
  },
]

export const app_values = [
  { value: "1,300+", label: "Properties" },
  { value: "98.5%", label: "Average Occupancy Rate" },
  { value: "4.9/5", label: "Owner Satisfaction Rating" }
]