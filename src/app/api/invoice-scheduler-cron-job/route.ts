import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { BookingStatus, InvoiceStatus, RentAmountType, RentFrequency, UnitStatus, SubscritptionStatus } from "@/utils/contants";
import { sendInvoiceToWhatsAppWithPaymentUrl, sendInvoiceToWhatsAppWithSelfBank } from "@/utils/sendToWhatsApp";
import { generateRazorpayLinkForInvoice, razorpayPayout } from "@/utils/razerPay";
import { NextResponse } from "next/server";
import { OrganisationModel } from "../../../../models/Organisation";
import { calculateDueDate, calculateNextBillingdate } from "@/utils/functions";
import { SelfRecieveBankOrUpiModel } from "../../../../models/SelfRecieveBankOrUpi";
import UnitModel from "../../../../models/Unit";

export async function GET() {

  try {
    await connectMongoDB();
    // new invoice generating
    await handleInvoice()
    // send overdue message
    await sendOverdueMessage()
    // daily collected mount payout to organisation
    // await payOutrazerpaytToOrganisation() // auto pay

    await handleCheckout()

    await updateOrganisationSubscription()

    console.log("cron job is working well.........", new Date());

    return NextResponse.json({ message: "working successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error cron job working" }, { status: 500 });
  }
}



const handleInvoice = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await BookingModel.find({
    disabled: false,
    status: BookingStatus.CHECKED_IN,
    nextBillingDate: { $gte: startOfDay, $lte: endOfDay },
  }).populate('organisationId').populate('propertyId');

  for (const booking of bookings) {

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
    let paymentUrl = "SELF RECEIVE"
    let paymentGateway = "manual"
    if (booking?.propertyId?.is_paymentRecieveSelf === false) {
          paymentUrl = await generateRazorpayLinkForInvoice(invoiceId, booking.amount, booking.fullName, booking)
    paymentGateway="razorpay"
    }
    let new_amount = booking.amount + carryForwarded
    await InvoiceModel.create({
      organisationId: booking.organisationId?._id,
      bookingId: booking._id,
      propertyId: booking.propertyId,
      unitId: booking.unitId,
      invoiceId,
      amount: new_amount, // Add unpaid amount to current invoice
      balance: new_amount,
      carryForwarded,
      type: RentAmountType.RENT,
      dueDate,
      status: InvoiceStatus.PENDING,
      paymentGateway,
      paymentUrl
    });

    let nextBillingDate = calculateNextBillingdate(booking.checkInDate, booking.frequency)
    await BookingModel.findByIdAndUpdate(booking._id, {
      nextBillingDate
    })

    if (booking?.propertyId?.is_paymentRecieveSelf) {
      const selected_bank = await SelfRecieveBankOrUpiModel.findById(booking.propertyId?.selctedSelfRecieveBankOrUpi)
      sendInvoiceToWhatsAppWithSelfBank(booking, new_amount, invoiceId, selected_bank, dueDate);
    } else {
      sendInvoiceToWhatsAppWithPaymentUrl(booking, new_amount, invoiceId, paymentUrl, dueDate);
    }
    return
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

      sendInvoiceToWhatsAppWithPaymentUrl(invoice?.bookingId, invoice?.amount, invoice?.invoiceId, invoice?.paymentUrl, dueDate);
    }
  }
  console.log("cron sendOverdueMessage working.........", new Date());
}

// const payOutrazerpaytToOrganisation = async () => {
//   const organisations = await OrganisationModel.find({ pendingPayout: { $gt: 0 } });

//   for (const org of organisations) {
//     const payoutAmount = org.pendingPayout;

//     razorpayPayout(payoutAmount, org)

//     // Mark payout done
//     await OrganisationModel.findByIdAndUpdate(org._id, {
//       $set: { pendingPayout: 0 },
//     });
//   }
//   console.log("cron payOutrazerpaytToOrganisation working.........", new Date());
// }

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

    // 2️⃣ Update unit slots
    const unit = await UnitModel.findById(booking.unitId);
    if (!unit) continue;

    let updatedStatus = UnitStatus.AVAILABLE;
    let newCurrentBooking = Math.max(0, unit.currentBooking - 1);

    // if partially booked → check if more slots active
    if (newCurrentBooking > 0 && newCurrentBooking < unit.noOfSlots) {
      updatedStatus = UnitStatus.PARTIALLY_BOOKED;
    } else if (newCurrentBooking >= unit.noOfSlots) {
      updatedStatus = UnitStatus.BOOKED;
    }

    await UnitModel.findByIdAndUpdate(unit._id, {
      currentBooking: newCurrentBooking,
      status: updatedStatus,
      $pull: { Bookings: booking._id },
    });
  }

  return


}



const updateOrganisationSubscription = async () => {
  try {
    const organisations = await OrganisationModel.find({
      disabled: false,
      deleted: false,
      "subscription.status": { $in: [SubscritptionStatus.TRIAL, SubscritptionStatus.ACTIVE] },
    });

    for (const org of organisations) {
      const subscription = org.subscription;

      if (!subscription?.endDate) continue;

      const currentDate = new Date();
      const endDate = new Date(subscription.endDate);

      currentDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate.getTime() - currentDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        org.subscription.status = SubscritptionStatus.EXPIRED;
        org.subscription.trialCompleted = true;
        await org.save();
        console.log(`✅ Subscription expired for: ${org.name}`);
      }
    }

    console.log("🕒 Cron job executed at:", new Date().toLocaleString());
  } catch (error) {
    console.error("❌ Error in updateOrganisationSubscription:", error);
  }
};
