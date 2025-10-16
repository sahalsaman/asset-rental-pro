import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { BookingStatus, InvoiceStatus, RentAmountType, RentFrequency } from "@/utils/contants";
import { sendInvoiceToWhatsAppWithPaymentUrl, sendInvoiceToWhatsAppWithSelfBank } from "@/utils/sendToWhatsApp";
import { generateRazorpayLinkForInvoice, razorpayPayout } from "@/utils/razerPay";
import { NextResponse } from "next/server";
import { OrganisationModel } from "../../../../models/Organisation";
import { razorpay_config } from "@/utils/config";

export async function GET() {

  try {
    await connectMongoDB();

    const bookings = await BookingModel.find({ disabled: false, status: BookingStatus.CHECKED_IN }).populate('propertyId')

    const today = new Date();

    const isSameDay = (date1: any, date2: any) =>
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();

    for (const booking of bookings) {

      if (booking?.nextBillingDate && isSameDay(new Date(booking.nextBillingDate), today)) {
        const invoiceId = `INV-${booking._id}-${Date.now()}-RENT`;
        let paymentLink = "test"
        paymentLink = await generateRazorpayLinkForInvoice(invoiceId, booking.amount, booking.fullName, booking);

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

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 5);

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
          dueDate,
          status: InvoiceStatus.PENDING,
          paymentGateway: "razorpay",
          paymentUrl: paymentLink ?? "SELF RECEIVE"
        });

        if (booking?.propertyId?.is_paymentRecieveSelf === false) {
          sendInvoiceToWhatsAppWithPaymentUrl(booking.whatsappNumber, invoiceId, booking.advanceAmount, booking?.fullName, paymentLink);
        } else {
          sendInvoiceToWhatsAppWithSelfBank(booking.whatsappNumber, invoiceId, booking.advanceAmount, booking?.fullName, booking?.propertyId?.selectedBank);
        }
        return
      }

    }


    const invoices = await InvoiceModel.find({ disabled: false, status: InvoiceStatus.PENDING }).populate('bookingId');


    if (invoices.length > 0) {
      for (const invoice of invoices) {
        const dueDate = new Date(invoice.dueDate);
        const today = new Date();

        if (dueDate < today) {
          invoice.status = InvoiceStatus.OVERDUE;
          await invoice.save();
        }

        sendInvoiceToWhatsAppWithPaymentUrl(invoice?.bookingId?.whatsappNumber,
          invoice?.invoiceId,
          invoice?.amount,
          invoice?.bookingId.fullName, invoice?.paymentUrl);
      }
    }

    const organisations = await OrganisationModel.find({ pendingPayout: { $gt: 0 } });

    for (const org of organisations) {
      const payoutAmount = org.pendingPayout;

      razorpayPayout(payoutAmount, org)

      // Mark payout done
      await OrganisationModel.findByIdAndUpdate(org._id, {
        $set: { pendingPayout: 0 },
      });
    }

    return NextResponse.json({ message: "Invoices generated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error generating invoices" }, { status: 500 });
  }
}
