"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FullscreenLoader } from "@/components/Loader";
import { statusColorMap } from "@/utils/contants";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPayments = async () => {
    const res = await apiFetch("/api/payment");
    const data = await res.json();
    setPayments(data || []);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredOrgs = payments?.filter((org: any) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrgs.length / itemsPerPage);

  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { label: "Home", href: "/owner" },
    { label: "Payments" },
  ];

  if (!payments) return <FullscreenLoader />;

  return (
    <div className="p-5 md:pt-10 md:px-32 mb-10">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Payments</h1>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search payment..."
          className="border px-3 py-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      {paginatedOrgs.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left">Subcription Type & Status</th>
                <th className="px-4 py-3 text-left">Bookings & Balance</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrgs.map((org) => (
                <tr key={org._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p>{org.name}</p>
                    <p className="text-xs">{org.address || "—"}</p>
                  </td>

                  <td className="px-4 py-3">
                    <p> {org.owner?.firstName || "—"}
                      {" " + org.owner?.lastName || "—"}</p>
                    <p className="text-xs"> {org.owner?.countryCode || "—"}
                      {" " + org.owner?.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p> {org.subscription?.plan || "—"} -
                      {" " + org.subscription?.unitPrice || "—"}</p>
                    <div>  <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColorMap[org.subscription?.status ?? ""] || "bg-gray-100 text-gray-800"
                      }`}>
                      {org.subscription?.status}
                    </span>
                    </div>
                  </td>
                  <td className="px-4 py-3"></td>

                  <td className="px-4 py-3">
                    {org.deleted ? (
                      <span className="text-red-500 font-medium">Deleted</span>
                    ) : org.disabled ? (
                      <span className="text-yellow-600 font-medium">Disabled</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button className="px-3 py-1 text-sm bg-black text-white rounded">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-5">
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
