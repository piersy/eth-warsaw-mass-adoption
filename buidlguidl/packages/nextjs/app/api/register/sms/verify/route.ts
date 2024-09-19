import { NextRequest, NextResponse } from "next/server";
import { verifySmsToken } from "../twilio";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";
import { Wallet, ethers, utils } from "ethers";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { CELO_RPC_URL } from "~~/app/SocialConnect/utils";
import { GetENSNameFromOdisId } from "~~/app/api/identifiers";

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
    new ethers.providers.JsonRpcProvider({
      url: CELO_RPC_URL,
      skipFetchSetup: true 
    },{
      chainId: 44787,
      name: 'celo-alfajores',
    })
  );

  // Create a new instance of the SocialConnectIssuer
  const issuer = new SocialConnectIssuer(wallet);

  const odisId = await issuer.getObfuscatedId(identifier, IdentifierPrefix.PHONE_NUMBER);
  const ensPhoneNumberName = GetENSNameFromOdisId(odisId);

  // const onchainId = utils.formatBytes32String(ensPhoneNumberName);

  // console.log(`onchainId: ${onchainId}`);

  const nameHash = utils.keccak256(utils.toUtf8Bytes(ensPhoneNumberName));
  console.log("nameHash", nameHash);

  // Register the on-chain identifier using the issuer instance
  const receipt: string = await issuer.registerOnChainIdentifier(nameHash, address as string);

  return NextResponse.json({ receipt });
}
