import { NextRequest, NextResponse } from "next/server";
import { verifySmsToken } from "../twilio";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";
import { AuthenticationMethod } from "@celo/identity/lib/odis/query";
import { JsonRpcProvider, Wallet } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { RPC } from "~~/app/SocialConnect/utils";

export async function POST(req: NextRequest) {
  // Verify the SMS token
  const { identifier, token, address } = await req.json();
  const success = await verifySmsToken(identifier as string, token as string);
  if (!success) {
    throw "Failed to verify SMS token";
  }

  // SMS verification successful, register the phone number

  // Create a new wallet instance using the private key and JSON RPC provider
  const wallet = new Wallet(process.env.ISSUER_PRIVATE_KEY as string, new JsonRpcProvider(RPC));

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet, {
    authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
    rawKey: process.env.DEK_PRIVATE_KEY as string,
  });

  const onchainId = await issuer.getObfuscatedId(identifier, IdentifierPrefix.PHONE_NUMBER);

  // Register the on-chain identifier using the issuer instance
  const receipt: string = await issuer.registerOnChainIdentifier(
    onchainId,
    IdentifierPrefix.PHONE_NUMBER,
    address as string,
  );

  return NextResponse.json({ receipt });
}
