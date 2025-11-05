import { NextResponse } from "next/server";

// ✅ GET: Webhook verification (for Meta setup)
export async function GET(req) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.WHATSAPP_API_WEBHOOK_TOKEN; // set in .env.local

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.warn("❌ Verification failed");
    return new NextResponse("Forbidden", { status: 403 });
  }
}

// ✅ POST: Handle incoming messages/events
export async function POST(req) {
  console.log("📩 Incoming WhatsApp webhook POST...");
  try {
    const body = await req.json();
    console.log("🌐 Webhook Body:", JSON.stringify(body, null, 2));

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          // ✅ Handle incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              console.log("💬 Received message:", message);

              const from = message.from; // sender number
              const text = message.text?.body || null;

              console.log(`👉 From: ${from} | Message: ${text}`);
              // TODO: Save to DB or send auto-reply here
            }
          }

          // ✅ Handle message status updates (sent, delivered, read)
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log("📦 Message status update:", status);
              // TODO: update message status in DB
            }
          }
        }
      }
      return NextResponse.json({ success: true }, { status: 200 });
    }

    console.warn("⚠️ Unrecognized webhook body:", body);
    return new NextResponse("No valid content", { status: 404 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}