import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "../../environment";


export function middleware(request: NextRequest) {
  const token = request.cookies.get("ARP_Token")?.value;

  if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET??env.JWT_SECRET);

    const role = decoded;

    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/admin") && role !== "admin")
      return NextResponse.redirect(new URL("/login", request.url));
    if (pathname.startsWith("/owner") && role !== "owner")
      return NextResponse.redirect(new URL("/login", request.url));
    if (pathname.startsWith("/user") && role !== "user")
      return NextResponse.redirect(new URL("/login", request.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/user/:path*"],
};
