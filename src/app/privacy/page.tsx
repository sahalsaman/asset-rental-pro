"use client";

import { app_config } from "@/utils/app-config";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router=useRouter()
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 md:py-20 md:px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Privacy Policy</h1>
        <p className="mb-4 text-gray-600">
          At <strong>{app_config?.APP_NAME}</strong>, your privacy is our priority. This Privacy Policy
          explains how we collect, use, and protect your personal data when you use our
          platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <p className="text-gray-600 mb-3">
          We may collect personal details such as your name, email, phone number, and
          property details when you register or interact with our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>To create and manage your account</li>
          <li>To facilitate property listings, bookings, and payments</li>
          <li>To send important updates and notifications</li>
          <li>To improve our services through analytics</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Data Security</h2>
        <p className="text-gray-600 mb-3">
          We use industry-standard encryption and access controls to protect your data from
          unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Your Rights</h2>
        <p className="text-gray-600 mb-3">
          You can request access, correction, or deletion of your data at any time by
          contacting our support team.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Updates to This Policy</h2>
        <p className="text-gray-600 mb-3">
          We may update this Privacy Policy from time to time. Please review it periodically
          for any changes.
        </p>

        <p className="mt-10 text-gray-600">
          For any privacy-related questions, contact us at{" "}
          <a href="mailto:info@webcos.co" className="text-green-700 underline">
            info@webcos.co
          </a>
          .
        </p>
      </div>
    </main>
  );
}
