"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function FinancesRedirect() {
    useEffect(() => {
        redirect("/business/revenue");
    }, []);

    return null;
}
