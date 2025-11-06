
import { NextResponse } from "next/server";
import axios from "axios"; // 1. Added missing axios import
import { env } from "../../../../../environment";

const PHONE_NUMBER_ID = env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_TOKEN = env.WHATSAPP_SYSTEM_USER_TOKEN

export async function GET(request, { params }) {
    
    const messageBody = "Hello there from the rentities";

    try {

        // const bookings = await BookingModel.findById(params.id)

        const recipientNumber = '918547929822';

        const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

        const res = await axios.post(url, {
            messaging_product: "whatsapp",
            to: recipientNumber,
            type: "text",
            text: { body: messageBody }
        }, {
            headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
        });

        return NextResponse.json(res.data, { status: 200 });

    } catch (err) {
        console.error("WhatsApp API Error:", err.response?.data || err.message);

        return NextResponse.json(
            {
                message: "Failed to send WhatsApp message",
                details: err.message,
                api_response: err.response?.data // Include API error details if available
            },
            { status: err.response?.status || 500 }
        );
    }
}

