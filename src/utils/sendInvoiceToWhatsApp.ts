import axios from "axios";

export async function sendInvoiceToWhatsApp(phone: string, invoiceId: string, amount: number) {
  try {
    const url = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: `📄 Invoice #${invoiceId}\nAmount: ₹${amount}\nPlease pay before due date.`
        }
      },
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
  } catch (error:any) {
    console.error("WhatsApp send error:", error?.response?.data || error?.message);
  }
}
