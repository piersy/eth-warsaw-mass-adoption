// Import necessary modules and types
import { NextRequest, NextResponse } from "next/server";
import { AuthenticationMethod } from "@celo/identity/lib/odis/query";
import { JsonRpcProvider, Wallet } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { RPC } from "~~/app/SocialConnect/utils";

export async function POST(req: NextRequest) {
  // Parse the request body to extract necessary parameters
  const { identifier, account, identifierType } = await req.json();

  // Create a new wallet instance using the private key and JSON RPC provider
  const wallet = new Wallet(process.env.ISSUER_PRIVATE_KEY as string, new JsonRpcProvider(RPC));

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet, {
    authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
    rawKey: process.env.DEK_PRIVATE_KEY as string,
  });

  // Register the on-chain identifier using the issuer instance
  const receipt: string = await issuer.registerOnChainIdentifier(identifier, identifierType, account as string);

  return NextResponse.json({ receipt });
}
