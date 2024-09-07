import { NextRequest } from "next/server";
import { verifySmsToken } from "../twilio";

export async function POST(req: NextRequest) {
  const { phoneNumber, token } = await req.json();
  return verifySmsToken(phoneNumber, token);
}