"use client";

import { useState } from "react";
import { useSocialConnect } from "./SocialConnect/useSocialConnect";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Query: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { lookupOdisId } = useSocialConnect();
  const [resolved, setResolved] = useState<string | undefined | null>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const phone = form.phone.value;
    console.log("Phone", phone);
    const network = form.network.value;
    console.log("Network", network);

    const odisIdentifier = await lookupOdisId(phone);
    console.log("ODIS Identifier", odisIdentifier);

    const options = {
      provider: "http://localhost:8545", // Example provider URL
    };
    const ensAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Static ENS registry address for local testnet
    const provider = new ethers.providers.JsonRpcProvider(options.provider, {
      chainId: 31337,
      name: "localhost",
      ensAddress: ensAddress,
    });

    const shortId = odisIdentifier.slice(2, 34); // NOTE: ethers doesn't support ens names longer than 63 bytes
    console.log(`shortId: ${shortId}`);
    const ensPhoneNumberName = `${shortId}.${network}.soco.eth`;
    console.log(`ensPhoneNumberName: ${ensPhoneNumberName}`);
    const resolver = await provider.getResolver(ensPhoneNumberName);
    if (resolver) {
      const ethAddress = await resolver.getAddress();
      console.log(`resolver address ${resolver.address}`);
      console.log(`eth address ${ethAddress}`);
      setResolved(ethAddress);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Lookup an ENS phone number</span>
          </h1>
          {resolved !== "" && (
            <span className="block text-2xl font-bold">
              {resolved ? `Resolved Address: ${resolved}` : "No address found"}
            </span>
          )}
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-200 mt-16 px-8 py-12">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <label htmlFor="ens-suffix" className="block text-sm font-medium">
                .soco.eth
              </label>
            </div>
            <div>
              <label htmlFor="network" className="block text-sm font-medium">
                Network
              </label>
              <select
                id="network"
                name="network"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option>optimism</option>
                <option>zircuit</option>
                <option>mantle</option>
                <option>datalake</option>
                <option>celo</option>
                <option>file</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Query
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Query;