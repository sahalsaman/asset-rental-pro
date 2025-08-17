
import jwt from "jsonwebtoken";

export function setTokenValue(user:any){
  const payload = {
    id: user._id,
    role: user.role,
    organisationId:user.organisationId
  };

  return  jwt.sign(payload, process.env.JWT_SECRET ?? "arp_userTokenKey", {
    expiresIn: "7d",
  });
}

export function getTokenValue(request:Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/ARP_Token=([^;]+)/);
  if (!match) return null;

  try {
    return jwt.verify(match[1], process.env.JWT_SECRET ?? "arp_userTokenKey");
  } catch (err) {
    return null;
  }
}