import connectMongoDB from "@/../database/db";
import UserModel from "@/../models/User";
import { NextResponse } from "next/server";
import { getTokenValue } from "@/utils/tokenHandler";
import { UserRoles } from "@/utils/contants";

export async function POST(request) {
    try {
        await connectMongoDB();
        const user = getTokenValue(request);

        // Verify authorized requester
        if (!user || user.role !== UserRoles.ADMIN) {
            return NextResponse.json({ message: "Unauthorized. Only admins can create admin credentials." }, { status: 401 });
        }

        const body = await request.json();
        const { username, password, firstName, lastName, phone, countryCode, email } = body;

        // Validation
        if (!username || !password || !firstName || !phone || !countryCode) {
            return NextResponse.json({ message: "Missing required fields: username, password, firstName, phone, countryCode" }, { status: 400 });
        }

        // Existence checks
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return NextResponse.json({ message: "Username already exists" }, { status: 409 });
        }

        const existingPhone = await UserModel.findOne({ phone });
        if (existingPhone) {
            return NextResponse.json({ message: "Phone number already exists" }, { status: 409 });
        }

        // Create New Admin User
        const newAdmin = await UserModel.create({
            username,
            password, // Consistent with existing plain-text password comparison in admin-login
            firstName,
            lastName: lastName || "",
            phone,
            countryCode,
            email: email || "",
            role: UserRoles.ADMIN,
            otpVerified: true,
            disabled: false,
            deleted: false
        });

        return NextResponse.json({
            message: "Admin credentials created successfully",
            data: { username: newAdmin.username, id: newAdmin._id }
        }, { status: 201 });

    } catch (err) {
        console.error("Error creating admin credentials:", err);
        return NextResponse.json({ message: "Failed to create admin credentials", error: err.message }, { status: 500 });
    }
}
