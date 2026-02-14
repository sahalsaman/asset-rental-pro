"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function BookingsRedirect() {
    useEffect(() => {
        redirect("/business/bookings/overview");
    }, []);

    return null;
}
