"use client";

import { useSocialConnect } from "../SocialConnect/useSocialConnect";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useAsyncEffect } from "use-async-effect";
import { useState } from "react";

const Register: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { register, sendVerifySms } = useSocialConnect();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const phone = form.phone.value;
    const success = await sendVerifySms(phone);
    if (success) {
      const token = prompt("Enter the verification token sent to your phone");
      if (token) {
        const registered = await register(phone, token);
        if (registered) {
          alert("Phone number registered successfully");
        } else {
          alert("Failed to register phone number, registration may already exist");
        }
      } else {
        alert("Verification token not provided");
      }
    } else {
      alert("Failed to send verification token");
    }
  };

  const [resolved, setResolved] = useState<string | undefined | null>("");

  useAsyncEffect(async () => {
  // Assuming options is defined somewhere in the code
    const options = {
      provider: "http://127.0.0.1:8545", // Example provider URL
    };
    const ensAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example ENS registry address
    const provider = new ethers.providers.JsonRpcProvider(options.provider, {
      chainId: 31337,
      name: "localhost",
      ensAddress: ensAddress,
    });

    // const abc = await provider.resolveName("test1.soco.eth");
    let resolver = await provider.getResolver("test1.soco.eth");
    if (resolver) {
      let ethAddress = await resolver.getAddress();
      let content = await resolver.getContentHash();
      let email = await resolver.getText('email');
      console.log(`resolver address ${resolver.address}`);
      console.log(`eth address ${ethAddress}`);
      console.log(`content ${content}`);
      console.log(`email ${email}`);
      setResolved(ethAddress);
    }
    // throw new Error("test");
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Register your phone number</span>
          </h1>
      <span className="block text-2xl font-bold">
        {resolved}
      </span>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-200 mt-16 px-8 py-12">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
              <input type="tel" id="phone" name="phone" placeholder="12345" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium">Address</label>
              <input type="text" id="address" name="address" placeholder="0x2C302520E6B344d8396BF3011862046287ef88c7" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="network" className="block text-sm font-medium">Network</label>
              {/* <input type="text" id="network" name="network" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /> */}
              <select id="network" name="network">
                <option value="op">OP</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
