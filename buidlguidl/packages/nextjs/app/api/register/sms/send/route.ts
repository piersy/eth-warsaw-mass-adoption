import { NextRequest, NextResponse } from "next/server";
import { sendSmsVerificationToken } from "../twilio";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();
    console.log("POST /api/register/sms/send", phoneNumber);
    const res = await sendSmsVerificationToken(phoneNumber);
    return NextResponse.json(res);
  } catch (error: any) {
    console.log(error.message);
  }
}