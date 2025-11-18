"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function EnquiryPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  const fetchEnquiries = async () => {
    const res = await apiFetch("/api/enquiry");
    const data = await res.json();

    setEnquiries(Array?.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filtered = enquiries.filter((e:any) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / size);
  const paginated = filtered.slice((page - 1) * size, page * size);

  return (
    <div className="p-5 md:pt-10 md:px-32 mb-10">
      <Breadcrumbs items={[{ label: "Home", href: "/owner" }, { label: "Enquiries" }]} />

      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Enquiries</h1>
      </div>

      {/* Search */}
      <input
        className="border px-3 py-2 rounded mb-4 w-full md:w-1/3"
        placeholder="Search enquiries..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((e:any) => (
              <tr key={e._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                    <p> {e?.name || "—"}</p>
                    <p className="text-xs"> {e?.countryCode || ""}
                      {" " + e?.phone || "—"}</p>
                  </td>
                <td className="px-4 py-3">{e.email || "—"}</td>
                <td className="px-4 py-3">{e.status}</td>
                <td className="px-4 py-3">{e.message}</td>
                <td className="px-4 py-3">
                  <button className="px-3 py-1 bg-black text-white rounded text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-5">
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
