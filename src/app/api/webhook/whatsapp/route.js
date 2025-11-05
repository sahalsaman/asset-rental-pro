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
     console.log("POST................");
  try {
    const body = await req.json();
     console.log("body................",body);
     
    if (body.object) {
     console.log("body.object...............",body.object);
      const entry = body.entry?.[0];
     console.log("entry...............",entry);
      const changes = entry?.changes?.[0];
     console.log("changes...............",changes);
      const message = changes?.value?.messages?.[0];

      if (message) {
        console.log("📩 Received WhatsApp message:", message);

        const from = message.from; // sender phone number
        const text = message.text?.body;

        // You can now reply or handle it as you wish
        // Example: save message to DB, send auto-reply, etc.
      }

      return NextResponse.json({ status: "received" }, { status: 200 });
    }

    return new NextResponse("No content", { status: 404 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
