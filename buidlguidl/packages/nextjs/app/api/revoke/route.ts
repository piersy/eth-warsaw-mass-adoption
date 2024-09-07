// Import necessary modules and types
import { NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Wallet } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { CELO_RPC_URL } from "~~/app/SocialConnect/utils";

export async function POST(req: NextRequest) {
  // Parse the request body to extract necessary parameters
  const { identifier, account, identifierType } = await req.json();

  // Create a new wallet instance using the private key and JSON RPC provider
  const wallet = new Wallet(process.env.ISSUER_PRIVATE_KEY as string, new JsonRpcProvider(CELO_RPC_URL));

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet);

  // Deregister (revoke) the on-chain identifier using the issuer instance
  const receipt: string = await issuer.deregisterOnChainIdentifier(identifier, identifierType, account as string);

  return NextResponse.json({ receipt });
}
