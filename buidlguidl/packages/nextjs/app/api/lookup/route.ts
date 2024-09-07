// Import necessary modules and types
import { NextRequest, NextResponse } from "next/server";
import { AuthenticationMethod } from "@celo/identity/lib/odis/query";
import { JsonRpcProvider, Wallet } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { RPC } from "~~/app/SocialConnect/utils";

// Define the response type for the lookup function
export type LookupResponse = {
  accounts: string[]; // Array of account addresses
  obfuscatedId: string; // Obfuscated identifier
};

export async function GET(req: NextRequest) {
  // Create a new wallet instance using the private key and JSON RPC provider
  const wallet = new Wallet(process.env.ISSUER_PRIVATE_KEY as string, new JsonRpcProvider(RPC));

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet, {
    authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
    // Use the recommended authentication method to save on ODIS quota
    // For steps to set up DEK, refer to the provided GitHub link - https://github.com/celo-org/social-connect/blob/main/docs/key-setup.md
    rawKey: process.env.DEK_PRIVATE_KEY as string,
  });

  // Extract the identifier and its type from the request query
  const { identifier, identifierType } = await req.json();

  // Define the issuer addresses under which to perform the lookup
  // In this example, we are using our own issuer's address
  // However, SocialConnect allows looking up under other issuers by providing their addresses
  const issuerAddresses = [wallet.address];

  // Perform the lookup using the issuer instance
  const lookupResponse: LookupResponse = await issuer.lookup(identifier, identifierType, issuerAddresses);

  // Return the lookup response with a 200 status code
  return NextResponse.json(lookupResponse);
}
