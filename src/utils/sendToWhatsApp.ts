import axios from 'axios';
import { env } from '../../environment';
import { PaymentRecieverOptions } from './contants';
// import crypto from 'crypto';

const config = {
  WHATSAPP_TOKEN: env?.WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: env?.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_SYSTEM_USER_TOKEN: env.WHATSAPP_SYSTEM_USER_TOKEN
}

function formatPhone(phone: string): string {
  return phone.replace(/^\+/, '').replace(/\s|-/g, '');  // e.g., "+91 98765 43210" → "919876543210"
}

// function generateShortCode(otp: string, phone: string): string {
//   const hash = crypto.createHash('md5').update(phone + otp).digest('hex');
//   return hash.substring(0, 10).toUpperCase(); // Max 10 chars
// }


export async function sendOTPText(
  countryCode: string,
  phone: string,
  otp: string,
  userName?: string
) {

  try {
    const formattedPhone = formatPhone(`${countryCode}${phone}`);
    // const shortCode = generateShortCode(otp, formattedPhone);
    const url = `https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    // const payload = {
    //   messaging_product: "whatsapp",
    //   to: formattedPhone,
    //   type: "text",
    //   text: {
    //     preview_url: false,
    //     body: `🔐 Hi ${userName || "User"},\n\nYour verification OTP is: *${otp}*\nIt expires in 5 minutes. Please do not share it.`,
    //   },
    // };
    // const payload = {
    //   messaging_product: "whatsapp",
    //   to: formattedPhone,
    //   type: "template",
    //   template: {
    //     name: "otp",
    //     language: { code: "en_US" },
    //     components: [
    //       {
    //         type: "body",
    //         parameters: [
    //           { type: "text", text: otp }
    //         ]
    //       },
    //       {
    //         type: "button",
    //         index: 0,
    //         sub_type: "url",
    //         parameters: [
    //           { type: "text", text: shortCode }  // ← REQUIRED
    //         ]
    //       }
    //     ]
    //   }
    // };
    const payload = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" },
      }
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
): Promise<{ success: boolean; messageId?: string; qrUrl?: string; error?: any }> {
  try {
    if (!booking?.whatsappNumber) throw new Error("Booking WhatsApp number missing.");
    if (!bankDetail) throw new Error("Bank details not provided.");

    const formattedPhone = formatPhone("91" + booking.whatsappNumber);
    const url = `https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    let caption = "";
    let qrUrl: string | null = null;

    const dueDateStr = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // 🔹 Create message caption
    caption = `📄 *Hi ${booking?.fullName || "Customer"},*

Invoice #${invoiceId}
Due Date: ${dueDateStr}
Amount: ₹${amount}`;

    // 🔹 Add payment details
    switch (bankDetail?.paymentRecieverOption) {
      case PaymentRecieverOptions.BANK:
        caption += `

🏦 *Bank Transfer Details:*
Account Name: ${bankDetail?.accountHolderName}
Account No: ${bankDetail?.value}
IFSC: ${bankDetail?.ifsc || "N/A"}
Bank: ${bankDetail?.bankName || "N/A"}
Branch: ${bankDetail?.branch || "N/A"}`;
        break;

      case PaymentRecieverOptions.UPIPHONE:
        caption += `

📱 *Pay via UPI Phone:*
UPI Number: ${bankDetail?.upiPhoneCountryCode || "+91"} ${bankDetail?.value}
Account Name: ${bankDetail?.accountHolderName}`;
        break;

      case PaymentRecieverOptions.UPIID:
        caption += `

💳 *Pay via UPI ID:*
UPI ID: ${bankDetail?.value}
Account Name: ${bankDetail?.accountHolderName}`;
        break;

      case PaymentRecieverOptions.UPIQR:
        caption += `

📸 *Scan this QR to pay:*
Account Name: ${bankDetail?.accountHolderName}`;
        // 🧠 Generate QR as base64 image
        qrUrl = bankDetail?.value
        break;

      default:
        caption += `

Payment details not available.`;
    }

    caption += `

Thank you!`;

    // 🚀 Send WhatsApp message
    const response = await axios.post(
      url,
      qrUrl
        ? {
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "image",
          image: {
            link: qrUrl, // base64 image
            caption: caption,
          },
        }
        : {
          messaging_product: "whatsapp",
          to: formattedPhone,
          type: "text",
          text: { body: caption },
        },
      {
        headers: {
          Authorization: `Bearer ${config.WHATSAPP_SYSTEM_USER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp invoice message sent:", response.data);
    return {
      success: true,
      messageId: response.data?.messages?.[0]?.id,
      qrUrl: qrUrl || undefined,
    };
  } catch (error: any) {
    console.error("❌ WhatsApp send error:", error?.response?.data || error.message);
    return {
      success: false,
      error: error?.response?.data?.error || error.message,
    };
  }
}





