import { NextRequest, NextResponse } from "next/server";
import { verifySmsToken } from "../twilio";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";
import { Wallet, ethers } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { CELO_RPC_URL } from "~~/app/SocialConnect/utils";

export async function POST(req: NextRequest) {
  // Verify the SMS token
  const { identifier, token, address } = await req.json();
  const success = await verifySmsToken(identifier as string, token as string);
  if (!success) {
    throw "Failed to verify SMS token";
  }

  // SMS verification successful, register the phone number

  // Create a new wallet instance using the private key and JSON RPC provider
  const wallet = new Wallet(
    process.env.ISSUER_PRIVATE_KEY as string,
    new ethers.providers.JsonRpcProvider(CELO_RPC_URL),
  );

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet);

  const onchainId = await issuer.getObfuscatedId(identifier, IdentifierPrefix.PHONE_NUMBER);

  // Register the on-chain identifier using the issuer instance
  const receipt: string = await issuer.registerOnChainIdentifier(onchainId, address as string);

  return NextResponse.json({ receipt });
}
