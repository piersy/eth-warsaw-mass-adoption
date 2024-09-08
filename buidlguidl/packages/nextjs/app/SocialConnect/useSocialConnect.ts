import { useEffect, useState } from "react";
import { LookupResponse } from "../api/lookup/address-celo/route";
import { LookupOdisIdResponse } from "../api/lookup/odis-id/route";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";
import { useAccount, useWalletClient } from "wagmi";

export const useSocialConnect = () => {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      setConnected(true);
      setAccount(address);
    } else {
      setConnected(false);
      setAccount(null);
    }
  }, [address]);

  // This code defines a function that returns an identifier prefix based on the value of an environment variable.
  // const getIdentifierPrefix = () => {
  //   if (process.env.NEXT_PUBLIC_SOCIAL_CONNECT_PROVIDER === "TWITTER") {
  //     return IdentifierPrefix.TWITTER;
  //   } else if (process.env.NEXT_PUBLIC_SOCIAL_CONNECT_PROVIDER === "GITHUB") {
  //     return IdentifierPrefix.TWITTER;
  //   }
  //   return IdentifierPrefix.TWITTER;
  // };

  const lookupOdisId = async (phoneNumber: string) => {
    if (walletClient) {
      setLoading(true);
      const response = await fetch("/api/lookup/odis-id", {
        method: "POST",
        body: JSON.stringify({
          identifier: phoneNumber,
          identifierType: IdentifierPrefix.PHONE_NUMBER,
        }),
      });
      if (response.status !== 200) {
        throw `Failed to lookup ODIS id. status: ${response.status}, text: ${await response.text()}`;
      }

      const lookupResponse: LookupOdisIdResponse = await response.json();
      return lookupResponse.obfuscatedId;
    } else {
      console.error("Wallet client not found");
      return "";
    }
  };

  // Looks up a Celo address using normal social connect (no ENS)
  const lookupAddress = async (phoneNumber: string) => {
    if (walletClient) {
      setLoading(true);
      const response = await fetch("/api/lookup/address", {
        method: "POST",
        body: JSON.stringify({
          identifier: phoneNumber,
          identifierType: IdentifierPrefix.PHONE_NUMBER,
        }),
      });
      if (response.status !== 200) {
        throw `Failed to lookup address. status: ${response.status}, text: ${await response.text()}`;
      }

      const lookupResponse: LookupResponse = await response.json();
      if (lookupResponse.accounts.length > 0) {
        return lookupResponse.accounts[0];
      }
    } else {
      console.error("Wallet client not found");
      return false;
    }
  };

  const sendVerifySms = async (phoneNumber: string) => {
    if (walletClient) {
      try {
        setLoading(true);
        const response = await fetch("/api/register/sms/send", {
          method: "POST",
          body: JSON.stringify({
            phoneNumber,
          }),
        });

        if (response.status !== 200) {
          throw `Failed to send SMS token. status: ${response.status}, text: ${await response.text()}`;
        }

        const registerResponse = await response.json();

        if (registerResponse.error) {
          console.error(registerResponse.error);
          return false;
        }
        return true;
      } catch (error: any) {
        console.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Wallet client not found");
      return false;
    }
  };

  const register = async (phoneNumber: string, token: string) => {
    if (walletClient) {
      try {
        setLoading(true);
        const response = await fetch("/api/register/sms/verify", {
          method: "POST",
          body: JSON.stringify({
            address: walletClient?.account.address,
            identifier: phoneNumber,
            token,
          }),
        });
        if (response.status !== 200) {
          throw `Failed to reegister attestation. status: ${response.status}, text: ${await response.text()}`;
        }

        const registerResponse = await response.json();

        if (registerResponse.error) {
          console.error(registerResponse.error);
          return false;
        }
        return true;
      } catch (error: any) {
        console.error(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Wallet client not found");
      return false;
    }
  };

  const revoke = async (identifier: string) => {
    if (walletClient) {
      try {
        const response = await fetch("/api/revoke", {
          method: "POST",
          body: JSON.stringify({
            account: walletClient?.account.address,
            identifier: identifier,
            identifierType: IdentifierPrefix.PHONE_NUMBER,
          }),
        });
        if (response.status !== 200) {
          throw `Failed to revoke attestation. status: ${response.status}, text: ${await response.text()}`;
        }

        const deregisterResponse = await response.json();
        if (deregisterResponse.error) {
          console.error(deregisterResponse.error);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    } else {
      console.error("Wallet client not found");
      return false;
    }
  };

  return {
    loading,
    connected,
    account,
    revoke,
    register,
    lookupAddress,
    sendVerifySms,
    lookupOdisId,
  };
};
