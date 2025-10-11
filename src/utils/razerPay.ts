import Razorpay from 'razorpay';  // Or use axios for API calls
import { razorpay_config } from './config';

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

export async function generateRazorpayLinkForInvoice(invoiceId: string, amount: number, name: string) {
  try {
    const options = {
      amount: amount * 100,  // In paise (e.g., 5000 → 500000)
      currency: 'INR',
      receipt: invoiceId,
      //   notes: { customer: name, due_date: dueDateStr },  // From your function
      description: `Payment for invoice ${invoiceId}`,
      customer: { name },
      notify: { sms: false, email: false },
      reminder_enable: true,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-callback`,  // Webhook for verification
    };

    const paymentLink = await razorpay.paymentLink.create(options);
    return paymentLink.short_url;  // e.g., "https://rzp.io/i/abc123xyz" (HTTPS, dynamic)
  } catch (error) {
    console.error('Razorpay link error:', error);
    throw error;
  }
}