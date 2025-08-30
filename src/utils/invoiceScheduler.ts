// utils/invoiceScheduler.ts
import cron from "node-cron";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import connectMongoDB from "@/../database/db";
import { BookingStatus } from "./contants";
import { sendInvoiceToWhatsApp } from "./sendInvoiceToWhatsApp";

connectMongoDB();

// Run every midnight
cron.schedule("0 0 * * *", async () => {
  const bookings = await BookingModel.find({disabled: false,status:BookingStatus.CHECKED_IN}).populate('spaceId');

  for (const booking of bookings) {
    let shouldGenerate = false;
    const now = new Date();

    if (booking.spaceId.frequency === "daily") shouldGenerate = true;
    if (booking.spaceId.frequency === "weekly" && now.getDay() === 1) shouldGenerate = true; // every Monday
    if (booking.spaceId.frequency === "monthly" && now.getDate() === 1) shouldGenerate = true; // 1st of month

    if (shouldGenerate) {
      await InvoiceModel.create({
          organisationId: booking.organisationId,
          bookingId: booking._id,
          propertyId: booking.propertyId,
          spaceId: booking.spaceId,
          invoiceId: `INV-${Date.now()}-RENT`, 
          amount: booking.amount,
          balance: booking.amount,
          type: "Rent",
          dueDate: booking.checkIn || new Date(),
      });
      sendInvoiceToWhatsApp(booking.contactPhone, `INV-${Date.now()}-RENT`, booking.amount);
    }
  }
});
