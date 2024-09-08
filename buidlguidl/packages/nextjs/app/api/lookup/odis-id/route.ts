import { NextRequest, NextResponse } from "next/server";
import { Wallet, ethers } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { CELO_RPC_URL } from "~~/app/SocialConnect/utils";

export type LookupOdisIdResponse = {
  obfuscatedId: string; // Obfuscated identifier
};

export async function POST(req: NextRequest) {
  // Create a new wallet instance using the private key and JSON RPC provider
  console.log(`CELO_RPC_URL: ${CELO_RPC_URL}`);
  const wallet = new Wallet(
    process.env.ISSUER_PRIVATE_KEY as string,
    new ethers.providers.JsonRpcProvider(CELO_RPC_URL, {
      chainId: 44787,
      name: 'celo-alfajores',
    }),
  );

  // console.log(`wallet.address: ${wallet.address}`);
  // console.log(`wallet.privateKey: ${wallet.privateKey}`);
  // console.log(`wallet.provider: ${wallet.provider}`);

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet);

  // Extract the identifier and its type from the request query
  const { identifier, identifierType } = await req.json();

  // Perform the lookup using the issuer instance
  const odisId = await issuer.getObfuscatedId(identifier, identifierType);

  return NextResponse.json({ obfuscatedId: odisId });
}
