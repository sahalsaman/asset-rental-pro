import axios from 'axios';
import { env } from '../../environment';
import { app_config } from '../../app-config';
import crypto from 'crypto';

const config = {
  WHATSAPP_TOKEN: env?.WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID: env?.WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_SYSTEM_USER_TOKEN: env.WHATSAPP_SYSTEM_USER_TOKEN
}

function formatPhone(phone: string): string {
  return phone.replace(/^\+/, '').replace(/\s|-/g, '');  // e.g., "+91 98765 43210" → "919876543210"
}

function generateShortCode(otp: string, phone: string): string {
  const hash = crypto.createHash('md5').update(phone + otp).digest('hex');
  return hash.substring(0, 10).toUpperCase(); // Max 10 chars
}


export async function sendOTPText(
  countryCode: string,
  phone: string,
  otp: string,
  userName?: string
) {

  try {
    const formattedPhone = formatPhone(`${countryCode}${phone}`);
    const shortCode = generateShortCode(otp, formattedPhone);
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
    const payload = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "template",
      template: {
        name: "otp",
        language: { code: "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: otp }
            ]
          },
          {
            type: "button",
            index: 0,
            sub_type: "url",
            parameters: [
              { type: "text", text: shortCode }  // ← REQUIRED
            ]
          }
        ]
      }
    };
    // const payload = {
    //   messaging_product: "whatsapp",
    //   to: formattedPhone,
    //   type: "template",
    //   template: {
    //     name: "hello_world",
    //     language: { code: "en_US" },
    //   }
    // };
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


export async function sendInvoiceToWhatsAppWithPaymentUrl(booking: any, amount: number, invoiceId: string,
  dueDate: Date) {
  try {
    const formattedPhone = formatPhone("91" + booking?.whatsappNumber);  // Ensure correct format
    const url = `https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const dueDateStr = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const paymentLink = app_config.PUBLIC_BASE_URL + "/user/payment/" + booking?.code

    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "template",
        template: {
          name: "invoice_reminder",
          language: { code: "en" },
          components: [
            {
              type: "header",
              parameters: [
                { type: "text", text: booking?.fullName || "Customer" }
              ]
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: invoiceId },              // {{2}}
                { type: "text", text: amount.toFixed(2) },       // {{3}}
                { type: "text", text: dueDateStr },              // {{4}}
                { type: "text", text: paymentLink },             // {{5}}
                { type: "text", text: "Rentities" }              // {{6}} — your app or company name
              ]
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [
                { type: "text", text: paymentLink }  // Pay Now button URL
              ]
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${config?.WHATSAPP_SYSTEM_USER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
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





