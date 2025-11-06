import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "../../environment";
import { UserRoles } from "@/utils/contants";


export function middleware(request: NextRequest) {
  const token = request.cookies.get("ARP_Token")?.value;

  if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));

  try {
    const decoded:any = jwt.verify(token, env.JWT_SECRET);

    const role = decoded.role;

    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/admin") && role !== UserRoles.ADMIN)
      return NextResponse.redirect(new URL("/login", request.url));
    if (pathname.startsWith("/owner") && role !== UserRoles.OWNER)
      return NextResponse.redirect(new URL("/login", request.url));
    if (pathname.startsWith("/user") && role !== UserRoles.USER)
      return NextResponse.redirect(new URL("/login", request.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/user/:path*"],
};
