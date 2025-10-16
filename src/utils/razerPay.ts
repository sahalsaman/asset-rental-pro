import Razorpay from 'razorpay';  // Or use axios for API calls
import { app_base_config, razorpay_config } from './config';
import axios from "axios";

const razorpay = new Razorpay({
  key_id: razorpay_config.RAZORPAY_KEY_ID,
  key_secret: razorpay_config.RAZORPAY_KEY_SECRET,
});

export async function generateRazorpayLinkForSubscription(amount: number, organisationId: string) {
  try {
    const options = {
      amount: amount * 100,  // In paise (e.g., 5000 → 500000)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: organisationId,
        purpose: "Webcos ARP Suscription Payment"
      }
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay link error:', error);
    throw error;
  }
}

export async function generateRazorpayLinkForInvoice(invoiceId: string, amount: number, name: string, booking: any) {
  try {
    const options = {
      amount: amount * 100,  // In paise (e.g., 5000 → 500000)
      currency: 'INR',
      receipt: invoiceId,
      notes: {
        organisationId: booking?.organisationId.toString(),
        propertyId: booking.propertyId.toString(),
        purpose: "Property Rent/advance"
      },
      description: `Payment for invoice ${invoiceId}`,
      customer: { name },
      notify: { sms: false, email: false },
      reminder_enable: true,
      callback_url: `${app_base_config.PUBLIC_BASE_URL}/api/razerpay-payment-callback`,  // Webhook for verification
    };

    const paymentLink = await razorpay.paymentLink.create(options);
    return paymentLink.short_url;  // e.g., "https://rzp.io/i/abc123xyz" (HTTPS, dynamic)
  } catch (error) {
    console.error('Razorpay link error:', error);
    throw error;
  }
}



export async function razorpayPayout(payoutAmount: number, org: any) {
  try {
    const response = await axios.post(
      "https://api.razorpay.com/v1/payouts",
      {
        account_number: razorpay_config.YOUR_RAZORPAY_VIRTUAL_ACCOUNT,
        fund_account_id: org.fundAccountId,
        amount: payoutAmount * 100,
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        narration: "Daily Rent Settlement",
      },
      {
        auth: {
          username: razorpay_config.RAZORPAY_KEY_ID,
          password: razorpay_config.RAZORPAY_KEY_SECRET,
        },
      }
    );

    console.log("✅ Payout created:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Razorpay payout error:", error.response?.data || error.message);
    throw error;
  }
}



// Fix typings with any (quick) or declare proper interfaces
interface Owner {
  name: string;
  email: string;
  phone: string;
  bankAccountName: string;
  ifsc: string;
  accountNumber: string;
  fundAccountId?: string;
  save: () => Promise<void>;
}


export async function createRazorpayFundAccount(owner: Owner) {
  try {
    // @ts-ignore: 'contacts' is not in typings
    const contact = await razorpay.contacts.create({
      name: owner.name,
      email: owner.email,
      contact: owner.phone,
      type: "vendor",
    });

    const fundAccount = await razorpay.fundAccount.create({
      contact_id: contact.id, 
      account_type: "bank_account",
      bank_account: {
        name: owner.bankAccountName,
        ifsc: owner.ifsc,
        account_number: owner.accountNumber,
      },
    } as any); 


    owner.fundAccountId = fundAccount.id;
    await owner.save();

    return owner;
  } catch (error) {
    console.error("Razorpay fund account creation failed:", error);
    throw error;
  }
}
