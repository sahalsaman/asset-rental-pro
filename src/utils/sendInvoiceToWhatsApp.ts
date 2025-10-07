import axios from 'axios';  
import { whatsapp_config } from './config';
import { generateRazorpayLink } from './razerPay';
// Helper: Format phone for WhatsApp (international, no +)
function formatPhone(phone: string): string {
  return phone.replace(/^\+/, '').replace(/\s|-/g, '');  // e.g., "+91 98765 43210" → "919876543210"
}

export async function sendInvoiceToWhatsApp(phone: string, invoiceId: string, amount: number, name: string) {
  try {
    const formattedPhone = formatPhone("918547929822");  // Ensure correct format
    const url = `https://graph.facebook.com/v20.0/${whatsapp_config?.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const today = new Date();
    const dueDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    dueDate.setHours(0, 0, 0, 0);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Generate dynamic Razorpay link (uncomment when implemented)
    const paymentLink = await generateRazorpayLink(invoiceId, amount, name);
    // const paymentLink = `https://rzp.io/i/abc123xyz`;  // Placeholder for testing

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: formattedPhone,  // Use formatted phone
        type: "text",
        text: {
          body: `📄 Hi ${name},\n\nInvoice #${invoiceId}\nDue: ${dueDateStr}\nAmount: ₹${amount}\n\nPayment appreciated! Pay here: ${paymentLink}`
        }
      },
      { headers: { Authorization: `Bearer ${whatsapp_config?.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
    );

    console.log("WhatsApp message sent successfully:", response.data);
    return { success: true, messageId: response.data.messages?.[0]?.id };
  } catch (error: any) {
    console.error("WhatsApp send error:", error?.response?.data || error?.message);
    // Specific handling for 131030
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


