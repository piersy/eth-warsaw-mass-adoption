// Import necessary modules and types
import { NextRequest, NextResponse } from "next/server";
import { Wallet, ethers } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { CELO_RPC_URL } from "~~/app/SocialConnect/utils";

// Define the response type for the lookup function
export type LookupResponse = {
  accounts: string[]; // Array of account addresses
  obfuscatedId: string; // Obfuscated identifier
};

export async function POST(req: NextRequest) {
  // Create a new wallet instance using the private key and JSON RPC provider
  const wallet = new Wallet(
    process.env.ISSUER_PRIVATE_KEY as string,
    new ethers.providers.JsonRpcProvider({
      url: CELO_RPC_URL,
      skipFetchSetup: true 
    },{
      chainId: 44787,
      name: 'celo-alfajores',
    }),
  );

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet);

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
