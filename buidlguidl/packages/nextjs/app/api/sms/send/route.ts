import { NextRequest } from "next/server";
import { sendSmsVerificationToken } from "../twilio";

export async function POST(req: NextRequest) {
  const { phoneNumber } = await req.json();
  return sendSmsVerificationToken(phoneNumber);
}