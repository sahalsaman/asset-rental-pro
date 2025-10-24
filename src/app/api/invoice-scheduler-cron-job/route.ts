import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { BookingStatus, InvoiceStatus, RentAmountType, RentFrequency, RoomStatus } from "@/utils/contants";
import { sendInvoiceToWhatsAppWithPaymentUrl, sendInvoiceToWhatsAppWithSelfBank } from "@/utils/sendToWhatsApp";
import { generateRazorpayLinkForInvoice, razorpayPayout } from "@/utils/razerPay";
import { NextResponse } from "next/server";
import { OrganisationModel } from "../../../../models/Organisation";
import { calculateDueDate } from "@/utils/functions";
import RoomModel from "../../../../models/Room";

export async function GET() {

  try {
    await connectMongoDB();
    // new invoice generating
    await handleInvoice()
    // send overdue message
    await sendOverdueMessage()
    // daily collected mount payout to organisation
    await payOutrazerpaytToOrganisation()

    await handleCheckout()

    console.log("cron job is working.........", new Date());

    return NextResponse.json({ message: "Invoices generated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error generating invoices" }, { status: 500 });
  }
}



const handleInvoice = async () => {
  const bookings = await BookingModel.find({ disabled: false, status: BookingStatus.CHECKED_IN }).populate('propertyId')

  const today = new Date();

  const isSameDay = (date1: any, date2: any) => {
    if (date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()) {
      return true
    } else {
      return false
    }
  }

  for (const booking of bookings) {

    if (booking?.nextBillingDate && isSameDay(new Date(booking.nextBillingDate), today)) {

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

      const dueDate = calculateDueDate(booking?.frequency)

      const invoiceId = `INV-${booking._id}-${Date.now()}-RENT`;
      let paymentLink = "test"
      paymentLink = await generateRazorpayLinkForInvoice(invoiceId, booking.amount, booking.fullName, booking);
      let new_amount = booking.amount + carryForwarded
      await InvoiceModel.create({
        organisationId: booking.organisationId,
        bookingId: booking._id,
        propertyId: booking.propertyId,
        roomId: booking.roomId,
        invoiceId,
        amount: new_amount, // Add unpaid amount to current invoice
        balance: new_amount,
        carryForwarded,
        type: RentAmountType.RENT,
        dueDate,
        status: InvoiceStatus.PENDING,
        paymentGateway: "razorpay",
        paymentUrl: paymentLink ?? "SELF RECEIVE"
      });

      // if (booking?.propertyId?.is_paymentRecieveSelf === false) {
      //   sendInvoiceToWhatsAppWithPaymentUrl(booking, new_amount, invoiceId, paymentLink);
      // } else {
      //   sendInvoiceToWhatsAppWithSelfBank(booking, new_amount, invoiceId, booking.propertyId?.selectedBank);
      // }
      return
    }

  }

  console.log("cron handle nvoice working.........", new Date());
}

const sendOverdueMessage = async () => {
  const invoices = await InvoiceModel.find({ disabled: false, status: InvoiceStatus.PENDING }).populate('bookingId');


  if (invoices.length > 0) {
    for (const invoice of invoices) {
      const dueDate = new Date(invoice.dueDate);
      const today = new Date();

      if (dueDate < today) {
        invoice.status = InvoiceStatus.OVERDUE;
        await invoice.save();
      }

      // sendInvoiceToWhatsAppWithPaymentUrl(invoice?.bookingId, invoice?.amount, invoice?.invoiceId, invoice?.paymentUrl);
    }
  }
  console.log("cron sendOverdueMessage working.........", new Date());
}

const payOutrazerpaytToOrganisation = async () => {
  const organisations = await OrganisationModel.find({ pendingPayout: { $gt: 0 } });

  for (const org of organisations) {
    const payoutAmount = org.pendingPayout;

    razorpayPayout(payoutAmount, org)

    // Mark payout done
    await OrganisationModel.findByIdAndUpdate(org._id, {
      $set: { pendingPayout: 0 },
    });
  }
  console.log("cron payOutrazerpaytToOrganisation working.........", new Date());
}

const handleCheckout = async () => {


    // 🕓 Get today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🕓 Get tomorrow's date to match same-day checkouts
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // 1️⃣ Find all active bookings whose checkout date is today
    const dueForCheckout = await BookingModel.find({
      status: BookingStatus.CHECKED_IN,
      checkOut: { $gte: today, $lt: tomorrow },
    });

    if (dueForCheckout.length === 0) {
      return NextResponse.json({ message: "No checkouts due today" });
    }

    for (const booking of dueForCheckout) {
      // Update booking → CHECKED_OUT
      booking.status = BookingStatus.CHECKED_OUT;
      await booking.save();

      // 2️⃣ Update room slots
      const room = await RoomModel.findById(booking.roomId);
      if (!room) continue;

      let updatedStatus = RoomStatus.AVAILABLE;
      let newCurrentBooking = Math.max(0, room.currentBooking - 1);

      // if partially booked → check if more slots active
      if (newCurrentBooking > 0 && newCurrentBooking < room.noOfSlots) {
        updatedStatus = RoomStatus.PARTIALLY_BOOKED;
      } else if (newCurrentBooking >= room.noOfSlots) {
        updatedStatus = RoomStatus.BOOKED;
      }

      await RoomModel.findByIdAndUpdate(room._id, {
        currentBooking: newCurrentBooking,
        status: updatedStatus,
        $pull: { Bookings: booking._id },
      });
    }

    return 


}