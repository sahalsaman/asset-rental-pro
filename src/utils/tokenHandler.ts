
import jwt from "jsonwebtoken";
import { env } from "../../environment";

 export interface IPayload  {
    id: string;
    role: string;
    organisationId:string;
    subscriptionPlan:string;
  };

export function setTokenValue(user:any){
  
  const payload:IPayload = {
    id: user._id,
    role: user.role,
    organisationId:user.organisationId?._id,
    subscriptionPlan:user.organisationId?.subscription?.plan,
  };

  return  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function getTokenValue(request:Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/ARP_Token=([^;]+)/);
  if (!match) return null;

  try {
    return jwt.verify(match[1], env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}