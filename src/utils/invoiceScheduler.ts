// utils/invoiceScheduler.ts
import cron from "node-cron";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import connectMongoDB from "@/../database/db";
import { BookingStatus } from "./contants";
import { sendInvoiceToWhatsApp } from "./sendToWhatsApp";
import {  generateRazorpayLinkForInvoice } from "./razerPay";

connectMongoDB();

// Run every midnight
cron.schedule("0 0 * * *", async () => {
  const bookings = await BookingModel.find({ disabled: false, status: BookingStatus.CHECKED_IN }).populate('roomId');

  for (const booking of bookings) {
    let shouldGenerate = false;
    const now = new Date();

    if (booking.roomId.frequency === "Day") shouldGenerate = true;
    if (booking.roomId.frequency === "Week" && now.getDay() === 1) shouldGenerate = true; // every Monday
    if (booking.roomId.frequency === "Month" && now.getDate() === 1) shouldGenerate = true; // 1st of month
    if (booking.roomId.frequency === "Year" && now.getFullYear() === 1) shouldGenerate = true; // 1st of month
    let invoiceId = `INV-${booking._id}-${Date.now()}-RENT`
    const paymentLink = await generateRazorpayLinkForInvoice(invoiceId, booking.amount, booking?.fullName);
    if (shouldGenerate) {
      await InvoiceModel.create({
        organisationId: booking.organisationId,
        bookingId: booking._id,
        propertyId: booking.propertyId,
        roomId: booking.roomId,
        invoiceId: invoiceId,
        amount: booking.amount,
        balance: booking.amount,
        type: "Rent",
        dueDate: booking.checkIn || new Date(),
      });

      sendInvoiceToWhatsApp(booking.whatsappNumber, invoiceId, booking.amount, booking?.fullName, paymentLink);
    }
  }
});
