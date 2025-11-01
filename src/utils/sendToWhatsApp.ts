import axios from 'axios';
import { env } from '../../environment';
import { PaymentRecieverOptions } from './contants';

const config = {
  WHATSAPP_TOKEN: env?.WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: env?.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_SYSTEM_USER_TOKEN: env.WHATSAPP_SYSTEM_USER_TOKEN
}

function formatPhone(phone: string): string {
  return phone.replace(/^\+/, '').replace(/\s|-/g, '');  // e.g., "+91 98765 43210" → "919876543210"
}


export async function sendOTPText(
  countryCode: string,
  phone: string,
  otp: string,
  userName?: string
) {
  try {
    const formattedPhone = formatPhone(`${countryCode}${phone}`);
    const url = `https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "text",
      text: {
        preview_url: false,
        body: `🔐 Hi ${userName || "User"},\n\nYour verification OTP is: *${otp}*\nIt expires in 5 minutes. Please do not share it.`,
      },
    };

    const headers = {
      Authorization: `Bearer ${config.WHATSAPP_SYSTEM_USER_TOKEN}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });

    console.log("✅ WhatsApp OTP sent:", response.data);
    return {
      success: true,
      messageId: response.data?.messages?.[0]?.id || null,
    };
  } catch (error: any) {
    console.error("❌ WhatsApp OTP send error:", error?.response?.data || error.message);
    return {
      success: false,
      error: error?.response?.data?.error?.message || error.message,
    };
  }
}


export async function sendInvoiceToWhatsAppWithPaymentUrl(booking: any, amount: number, invoiceId: string, paymentLink: any,
  dueDate: Date) {
  try {
    const formattedPhone = formatPhone("91" + booking?.whatsappNumber);  // Ensure correct format
    const url = `https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const dueDateStr = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });


    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: `📄 Hi ${booking?.fullName},\n\nInvoice #${invoiceId}\nDue: ${dueDateStr}\nAmount: ₹${amount}\n\nPayment appreciated! Pay here: ${paymentLink}`
        }
      },
      { headers: { Authorization: `Bearer ${config?.WHATSAPP_SYSTEM_USER_TOKEN}`, "Content-Type": "application/json" } }
    );

    console.log("WhatsApp message sent successfully:", response.data);
    return { success: true, messageId: response.data.messages?.[0]?.id };
  } catch (error: any) {
    console.error("WhatsApp send error:", error?.response?.data || error?.message);
    if (error?.response?.data?.error?.code === 131030) {
      console.warn("Add recipient phone to whitelist in Meta Business Manager.");
    }
    return {
      success: false,
      error: error?.response?.data?.error || error?.message,
      code: error?.response?.data?.error?.code
    };
  }
}



export async function sendInvoiceToWhatsAppWithSelfBank(
  booking: any,
  amount: number,
  invoiceId: string,
  bankDetail: any,
  dueDate: Date
) {
  try {
    if (!booking?.whatsappNumber) throw new Error("Booking WhatsApp number missing.");
    if (!bankDetail) throw new Error("Bank details not provided.");

    const formattedPhone = formatPhone("91" + booking.whatsappNumber);
    const url = `https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    // 🧩 Build dynamic payment message
    let paymentMessage = "";

    const dueDateStr = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    switch (bankDetail?.paymentRecieverOption) {
      case PaymentRecieverOptions.BANK:
        paymentMessage = `🏦 *Bank Transfer Details:*
Account Name: ${bankDetail?.accountHolderName}
Account No: ${bankDetail?.value}
IFSC: ${bankDetail?.ifsc || "N/A"}
Bank: ${bankDetail?.bankName || "N/A"}
Branch: ${bankDetail?.branch || "N/A"}`;
        break;

      case PaymentRecieverOptions.UPIPHONE:
        paymentMessage = `📱 *Pay via UPI Phone:*
UPI Number: ${bankDetail?.upiPhoneCountryCode || "+91"} ${bankDetail?.value}
Account Name: ${bankDetail?.accountHolderName}`;
        break;

      case PaymentRecieverOptions.UPIID:
        paymentMessage = `💳 *Pay via UPI ID:*
UPI ID: ${bankDetail?.value}
Account Name: ${bankDetail?.accountHolderName}`;
        break;

      case PaymentRecieverOptions.UPIQR:
        paymentMessage = `📸 *Scan this QR to pay:*
QR Link: ${bankDetail?.value}
Account Name: ${bankDetail?.accountHolderName}`;
        break;

      default:
        paymentMessage = `Payment details not available.`;
    }

    // 🧾 Final message body
    const messageBody = `📄 *Hi ${booking?.fullName || "Customer"},*

Invoice #${invoiceId}
Due Date: ${dueDateStr}
Amount: ₹${amount}

${paymentMessage}

Thank you!`;

    // 🚀 Send message via WhatsApp Cloud API
    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: { body: messageBody },
      },
      {
        headers: {
          Authorization: `Bearer ${config.WHATSAPP_SYSTEM_USER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp message sent successfully:", response.data);
    return { success: true, messageId: response.data?.messages?.[0]?.id };
  } catch (error: any) {
    console.error("❌ WhatsApp send error:", error?.response?.data || error.message);
    if (error?.response?.data?.error?.code === 131030) {
      console.warn("⚠️ Add recipient phone number to WhatsApp Business 'Test numbers' list.");
    }
    return {
      success: false,
      error: error?.response?.data?.error || error.message,
      code: error?.response?.data?.error?.code,
    };
  }
}



