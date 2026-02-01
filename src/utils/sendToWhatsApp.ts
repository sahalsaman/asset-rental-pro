import axios from 'axios';
import { env } from '../../environment';
import { app_config } from '../../app-config';
import crypto from 'crypto';

const config = {
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
    const url = `https://bot.wabis.in/api/v1/whatsapp/send/template`;

    const params = new URLSearchParams();
    params.append("apiToken", config.WHATSAPP_SYSTEM_USER_TOKEN);
    params.append("phone_number_id", config.WHATSAPP_PHONE_NUMBER_ID);
    params.append("phone_number", formattedPhone);
    params.append("template_id", "308500");
    params.append("templateVariable-otp-1", otp);
    params.append("templateVariable-otp-2", otp);

    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

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


export async function sendInvoiceToWhatsApp(booking: any, amount: number, invoiceId: string,
  dueDate: Date) {
  try {
    const formattedPhone = formatPhone(`${booking?.userId.countryCode}${booking?.userId.phone}`);
    const url = `https://bot.wabis.in/api/v1/whatsapp/send/template`;

    const dueDateStr = dueDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const paymentLink = app_config.PUBLIC_BASE_URL + "/user/payment/" + booking.code

    const params = new URLSearchParams();
    params.append("apiToken", config.WHATSAPP_SYSTEM_USER_TOKEN);
    params.append("phone_number_id", config.WHATSAPP_PHONE_NUMBER_ID);
    params.append("phone_number", formattedPhone);
    params.append("template_id", "308578");
    params.append("templateVariable-tenantName-1", `${booking?.userId?.firstName} ${booking?.userId?.lastName}`);
    params.append("templateVariable-InvoiceId-2", invoiceId);
    params.append("templateVariable-amount-3", amount.toString());
    params.append("templateVariable-dueDate-4", dueDateStr);
    params.append("templateVariable-paymentUrl-5", paymentLink);
    params.append("templateVariable-paymentUrl-6", booking?.code);
    // params.append("templateVariable-6", propertyName);

    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

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





