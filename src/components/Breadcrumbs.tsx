"use client";

import { Home } from "lucide-react";
import Link from "next/link";

export default function Breadcrumbs({ items }:{ items: any }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-gray-600 mb-2">
      <ol className="flex ">
        {items.map((item:any, idx:any) => (
          <li key={idx} className="flex items-center">
            {idx !== items.length - 1 ? (
              <Link href={item.href} className="hover:text-blue-600">
                {item.label==="Home" ? <Home className="w-5 h-5"/> : item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-800">{item.label}</span>
            )}
            {idx !== items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
