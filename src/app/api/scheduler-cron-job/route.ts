import connectMongoDB from "@/../database/db";
import BookingModel from "@/../models/Booking";
import InvoiceModel from "@/../models/Invoice";
import { BookingStatus, InvoiceStatus, RentAmountType, UnitStatus, SubscritptionStatus, SubscritptionPaymentStatus } from "@/utils/contants";
import { sendInvoiceToWhatsAppWithPaymentUrl } from "@/utils/sendToWhatsApp";
import { NextResponse } from "next/server";
import { OrganisationModel, SubscriptionPaymentModel } from "../../../../models/Organisation";
import { calculateDueDate, calculateNextBillingdate } from "@/utils/functions";
import UnitModel from "../../../../models/Unit";

export async function GET() {

  try {
    await connectMongoDB();
    // new invoice generating
    await handleInvoice()
    // send overdue message
    await sendOverdueMessage()
    // daily collected mount payout to organisation

    await handleCheckout()

    await crateOrganisationSubscriptionPayment()

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
  }).populate('organisationId').populate('propertyId').populate('userId');

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

    const invoiceId = `INV-${booking?.code}-${Date.now()}-RENT`;

    let new_amount = booking.amount + carryForwarded
    const newInvoice = await InvoiceModel.create({
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

    });

    let nextBillingDate = calculateNextBillingdate(booking.checkInDate, booking.frequency)
    await BookingModel.findByIdAndUpdate(booking._id, {
      nextBillingDate,
      lastInvoiceId: newInvoice._id
    })
    sendInvoiceToWhatsAppWithPaymentUrl(booking, new_amount, invoiceId, dueDate);

    return
  }
  console.log("cron handle nvoice working.........", new Date());
}

const sendOverdueMessage = async () => {
  const invoices = await InvoiceModel.find({ disabled: false, status: InvoiceStatus.PENDING }).populate({
    path: "bookingId",
    populate: {
      path: "userId",
      model: "User",
    },
  }).populate('propertyId');

  if (invoices.length > 0) {
    for (const invoice of invoices) {
      const dueDate = new Date(invoice.dueDate);
      const today = new Date();

      if (dueDate < today) {
        invoice.status = InvoiceStatus.OVERDUE;
        await invoice.save();
      }
      let booking = invoice?.bookingId

      sendInvoiceToWhatsAppWithPaymentUrl(booking, invoice.amount, invoice.invoiceId, dueDate);

    }
  }
  console.log("cron sendOverdueMessage working.........", new Date());
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


const crateOrganisationSubscriptionPayment = async () => {
  try {
    const today = new Date();
    if (today.getDate() !== 1) {
      console.log("⏩ Not the 1st day of the month — skipping billing.");
      return;
    }

    console.log("🚀 Running Subscription Cron Job...");

    const organisations = await OrganisationModel.find({
      disabled: false,
      deleted: false,
      "subscription.status": SubscritptionStatus.ACTIVE,
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Start & End of this month
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 1);

    for (const org of organisations) {
      const sub = org.subscription;

      if (!sub) continue;

      // 1️⃣ Count invoices created this month
      const noOfBookings = await InvoiceModel.countDocuments({
        organisationId: org._id,
        createdAt: { $gte: monthStart, $lt: monthEnd },
        type: RentAmountType.RENT,
      });

      // 2️⃣ Calculate prices
      const unitPrice = sub.unitPrice;
      const totalPrice = unitPrice * noOfBookings;

      // 3️⃣ Create subscription payment entry
      await SubscriptionPaymentModel.create({
        organisationId: org._id,
        plan: sub.plan,
        status: SubscritptionPaymentStatus.PENDING,
        startDate: monthStart,
        endDate: monthEnd,
        no_of_booking: noOfBookings,
        plan_price: unitPrice,
        total_price: totalPrice,
        paymentMethod: sub.paymentMethod,
      });

      // 4️⃣ Update next billing date
      await OrganisationModel.updateOne(
        { _id: org._id },
        {
          $set: {
            "subscription.lastPaymentDate": now,
            "subscription.nextBillingDate": new Date(currentYear, currentMonth + 1, 1),
            "subscription.numberOfBookings": 0,
          },
        }
      );

      console.log(`✅ Created subscription payment for org: ${org.name}`);
    }

    console.log("🕒 Cron executed at:", new Date().toLocaleString());
  } catch (error) {
    console.error("❌ Cron Error:", error);
  }
}
