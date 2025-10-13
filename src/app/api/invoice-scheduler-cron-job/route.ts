import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { BookingStatus, InvoiceStatus, RentAmountType, RentFrequency } from "@/utils/contants";
import { sendInvoiceToWhatsApp } from "@/utils/sendToWhatsApp";
import { generateRazorpayLinkForInvoice } from "@/utils/razerPay";
import { NextResponse } from "next/server";

export async function GET() {

  try {
    await connectMongoDB();

    const bookings = await BookingModel.find({ disabled: false, status: BookingStatus.CHECKED_IN })

    const today = new Date();

    const isSameDay = (date1: any, date2: any) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    for (const booking of bookings) {

      if (booking?.nextBillingDate && isSameDay(new Date(booking.nextBillingDate), today)) {
        const invoiceId = `INV-${booking._id}-${Date.now()}-RENT`;
        // const paymentLink = await generateRazorpayLinkForInvoice(invoiceId, booking.amount, booking.fullName);
        const paymentLink = "test"

        const lastInvoice = await InvoiceModel.findOne({
          organisationId: booking.organisationId,
          bookingId: booking._id,
          propertyId: booking.propertyId,
        }).sort({ createdAt: -1 }); 

        let carryForwarded = 0;

        if (lastInvoice && lastInvoice.status !== InvoiceStatus.PAID) {
          carryForwarded = lastInvoice.balance || 0;
          lastInvoice.status = InvoiceStatus.CARRY_FORWARDED; // You can add a new status if needed
          await lastInvoice.save();
        }


        const newInvoice = await InvoiceModel.create({
          organisationId: booking.organisationId,
          bookingId: booking._id,
          propertyId: booking.propertyId,
          roomId: booking.roomId,
          invoiceId,
          amount: booking.amount + carryForwarded, // Add unpaid amount to current invoice
          balance: booking.amount + carryForwarded,
          carryForwarded,
          type: RentAmountType.RENT,
          dueDate: booking.checkIn || new Date(),
          status: InvoiceStatus.PENDING,
          paymentGateway: "razorpay",
        });

        // sendInvoiceToWhatsApp(booking.whatsappNumber, invoiceId, booking.amount, booking.fullName, paymentLink);
        return
      }
    }

    return NextResponse.json({ message: "Invoices generated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error generating invoices" }, { status: 500 });
  }
}
