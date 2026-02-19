"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function BookingRedirect() {
    useEffect(() => {
        redirect("/business/bookings/overview");
    }, []);

    return null;
}
