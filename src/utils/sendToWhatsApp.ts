import axios from 'axios';  
import { env } from '../../environment';

export const config = {
    WHATSAPP_TOKEN:env?.WHATSAPP_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: env?.WHATSAPP_PHONE_NUMBER_ID,
    SYSTEM_USER_TOKEN:env.SYSTEM_USER_TOKEN
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
      // type: "text",
      // text: {
      //   preview_url: false,
      //   body: `🔐 Hi ${userName || "User"},\n\nYour verification OTP is: *${otp}*\n\nIt expires in 5 minutes. Please do not share it.\n\n– ARP Team`,
      // },
      type: "template",
      template: {
        name: "hello_world", // Your approved template name, e.g., "otp_verification"
        language: { code: "en_US" }, // Language code of the template
        // components: [
        //   {
        //     type: "body",
        //     parameters: [
        //       { type: "text", text: otp }, // OTP code passed as template param
        //       { type: "text", text: userName || "User" } // Optional: parameter with username if your template has placeholders for it
        //     ],
        //   },
        // ],
      },
    };

    const headers = {
      Authorization: `Bearer ${config.SYSTEM_USER_TOKEN}`,
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


export async function sendInvoiceToWhatsAppWithPaymentUrl(booking: any, amount:number,invoiceId: string, paymentLink:any) {
  try {
    const formattedPhone = formatPhone("91"+booking?.whatsappNumber);  // Ensure correct format
    const url = `https://graph.facebook.com/v20.0/${config?.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const today = new Date();
    const dueDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    dueDate.setHours(0, 0, 0, 0);
    const dueDateStr = dueDate.toISOString().split('T')[0];

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
      { headers: { Authorization: `Bearer ${config?.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
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

export async function sendInvoiceToWhatsAppWithSelfBank(booking: any, amount: number,invoiceId: string, bankDetail:any) {
  try {
    const formattedPhone = formatPhone("91"+booking?.whatsappNumber);  // Ensure correct format
    const url = `https://graph.facebook.com/v20.0/${config?.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const today = new Date();
    const dueDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    dueDate.setHours(0, 0, 0, 0);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: formattedPhone, 
        type: "text",
        text: {
          body: `📄 Hi ${booking?.fullName},\n\nInvoice #${invoiceId}\nDue: ${dueDateStr}\nAmount: ₹${amount}\n\nPayment appreciated! Pay here: ${bankDetail}`
        }
      },
      { headers: { Authorization: `Bearer ${config?.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
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

// Optional: Interactive version with buttons (for in-session only; requires user to message first)
// async function sendInteractiveInvoice(phone: string, invoiceId: string, amount: number, name: string, paymentLink: string) {
//   // ... (same setup as above)
//   const formattedPhone = formatPhone(phone);

//   const response = await axios.post(url, {
//     messaging_product: "whatsapp",
//     to: formattedPhone,
//     type: "interactive",
//     interactive: {
//       type: "button",
//       body: {
//         text: `📄 Hi ${name},\n\nInvoice #${invoiceId}\nDue: ${dueDateStr}\nAmount: ₹${amount}\n\nPayment appreciated!`
//       },
//       action: {
//         buttons: [
//           {
//             type: "url",
//             url: paymentLink,  // Direct HTTPS link (e.g., Razorpay)
//             title: "Pay Now"
//           }
//         ]
//       }
//     }
//   }, { headers: { /* ... */ } });

//   // ... (return as above)
// }


