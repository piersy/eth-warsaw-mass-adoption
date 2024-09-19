"use client";

import { useState } from "react";
import { useSocialConnect } from "./SocialConnect/useSocialConnect";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { GetENSNameFromOdisId } from "./api/identifiers";

const Lookup: NextPage = () => {
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

    const ensPhoneNumberName = GetENSNameFromOdisId(odisIdentifier, network);

    // const onchainId = utils.keccak256(utils.toUtf8Bytes(ensPhoneNumberName))
    // console.log(`onchainId: ${onchainId}`);
    const resolver = await provider.getResolver(ensPhoneNumberName);
    if (resolver) {
      console.log(`resolver address ${resolver.address}`);
      const ethAddress = await resolver.getAddress();
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
                placeholder="+12345678910"
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
              {/* <input type="text" id="network" name="network" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /> */}
              <select id="network" name="network">
                <option>celo</option>
                <option>op</option>
                <option>zircuit</option>
                <option>file</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Lookup
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Lookup;
