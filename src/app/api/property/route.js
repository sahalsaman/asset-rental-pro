import { NextResponse } from "next/server";
import PropertyModel from "../../../../models/Property";
import connectMongoDB from "../../../../database//db";


export async function GET() {
    try {
        await connectMongoDB()
        const properties = await PropertyModel.find();
        return NextResponse.json(properties);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch properties", details: err }, { status: 500 });
    }
}

// POST - Add a new property
export async function POST(request) {

    await connectMongoDB()
    const body = await request.json();
    console.log(body);
    try {
        const property = await PropertyModel.create(body);
        return NextResponse.json({ message: "Property added", property }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to add property", details: err }, { status: 400 });
    }
}

// PUT - Update property by id (pass id as query param)
export async function PUT(request) {

    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB()
    const body = await request.json();

    if (!id) {
        return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }

    try {
        const updated = await PropertyModel.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json({ message: "Property updated", updated });
    } catch (err) {
        return NextResponse.json({ error: "Failed to update property", details: err }, { status: 400 });
    }
}

// DELETE - Delete property by id (pass id as query param)
export async function DELETE(request) {

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing property ID" }, { status: 400 });
    }

    try {
        await connectMongoDB()
        await PropertyModel.findByIdAndDelete(id);
        return NextResponse.json({ message: "Property deleted" });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete property", details: err }, { status: 500 });
    }
}
