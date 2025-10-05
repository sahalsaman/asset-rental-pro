"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Terms of Service</h1>
        <p className="mb-4 text-gray-600">
          Welcome to <strong>AssetRentalPro</strong>. By accessing or using our platform,
          you agree to comply with the following terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-600 mb-3">
          By registering or using AssetRentalPro, you confirm that you have read, understood,
          and agreed to these Terms of Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. Use of Service</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>You must be at least 18 years old to use our platform.</li>
          <li>You agree to provide accurate and up-to-date information.</li>
          <li>You may not use our service for illegal or fraudulent activities.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Account Responsibility</h2>
        <p className="text-gray-600 mb-3">
          You are responsible for maintaining the confidentiality of your account credentials
          and all activities under your account.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Limitation of Liability</h2>
        <p className="text-gray-600 mb-3">
          AssetRentalPro is not liable for any indirect, incidental, or consequential damages
          arising from your use of our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Termination</h2>
        <p className="text-gray-600 mb-3">
          We reserve the right to suspend or terminate your account if we detect misuse or
          violation of our policies.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Changes to Terms</h2>
        <p className="text-gray-600 mb-3">
          We may modify these terms at any time. Continued use of the platform means you
          accept the revised terms.
        </p>

        <p className="mt-10 text-gray-600">
          For support or questions, contact us at{" "}
          <a href="mailto:info@webcos.co" className="text-green-700 underline">
            info@webcos.co
          </a>
          .
        </p>

        <div className="mt-10">
          <Link href="/" className="text-green-700 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
