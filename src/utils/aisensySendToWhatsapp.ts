import axios from "axios";
import { env } from "../../environment"; // Must include AISENSY_API_KEY

function formatPhone(phone: string): string {
  return phone.replace(/^\+/, "").replace(/\s|-/g, ""); // e.g., "+91 98765 43210" → "919876543210"
}

export async function aisensySendOTPText(
  countryCode: string,
  phone: string,
  otp: string,
  userName?: string
) {
  try {
    const formattedPhone = formatPhone(`${countryCode}${phone}`);

    const url = "https://backend.aisensy.com/campaign/t1/api/v2/sendTemplateMessage";

    const payload = {
      apiKey: env.AISENSY_API_KEY, // from environment file
      // campaignName: "OTP Delivery", // any custom name
      destination: formattedPhone, // WhatsApp number with country code
      userName: userName || "User",
      templateName: "otp_message_1", // must match approved template name in AiSensy
      parameters: [otp], // pass template params in order
    };

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ WhatsApp OTP sent via AiSensy:", response.data);

    return {
      success: true,
      message: response.data?.message || "OTP sent successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("❌ AiSensy OTP send error:", error?.response?.data || error.message);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
}
