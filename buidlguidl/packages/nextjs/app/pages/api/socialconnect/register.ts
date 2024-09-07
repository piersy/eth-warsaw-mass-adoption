// Import necessary modules and types
import { AuthenticationMethod } from "@celo/identity/lib/odis/query";
import { JsonRpcProvider, Wallet } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { SocialConnectIssuer } from "~~/app/SocialConnect";
import { RPC } from "~~/app/SocialConnect/utils";

// Define the response type for the register function
// It can either return a receipt or an error message
export type RegisterResponse =
  | {
      receipt: string;
    }
  | {
      error: string;
    };

// Define the default export function 'register' for handling API requests
export default async function register(
  req: NextApiRequest, // Incoming API request
  res: NextApiResponse<RegisterResponse>, // API response
) {
  // Handle different request methods
  switch (req.method) {
    case "POST":
      // Parse the request body to extract necessary parameters
      const { identifier, account, identifierType } = JSON.parse(req.body);

      // Create a new wallet instance using the private key and JSON RPC provider
      const wallet = new Wallet(process.env.ISSUER_PRIVATE_KEY as string, new JsonRpcProvider(RPC));

      // Create a new instance of the SocialConnectIssuer
      const issuer = new SocialConnectIssuer(wallet, {
        authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
        rawKey: process.env.DEK_PRIVATE_KEY as string,
      });

      // Register the on-chain identifier using the issuer instance
      const registerResponse: string = await issuer.registerOnChainIdentifier(
        identifier,
        identifierType,
        account as string,
      );

      // Return the registration response with a 200 status code
      return res.status(200).json({ receipt: registerResponse });

    default:
      // For unsupported request methods, return a 400 status code with an error message
      return res.status(400).json({
        error: "Method not supported",
      });
  }
}
