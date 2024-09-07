"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address  } from "~~/components/scaffold-eth";
import { AddressInput } from "./EnsEntry";
import { useState } from "react";


import { useEnsAddress } from 'wagmi'
import { useState } from "react";
// import { normalize } from 'viem/ens'


function ResolveENS({ ensName }) {
  console.log("Renders");
  const { data: address, isLoading, error } = useEnsAddress({
    name: ensName
    // , chainId: 11155111
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error resolving ENS: {error.message}</div>;
  return <div>{ensName} resolves to: {address}</div>;
}


const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [ensName, setENS] = useState("");
  const [ensNameInput, setEnsNameInput] = useState("");

  const [address, setAddress] = useState("");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Social ENS</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <form>
            <label>Enter your Phone number:
              <input
                type="text"
                value={ensNameInput}
                onChange={(event) => setEnsNameInput(event.target.value)}
                />
            </label>
            .soco.eth {"    "}
            {/* <input type="submit" onSubmit={(event) =>  setENS (event.value } /> */}
            <input type="button" value="Submit" onClick={(event) =>  {
              setENS(ensNameInput);
              }} />
          </form>

          { ensName && <ResolveENS ensName={ensName} /> } 
          {/* <ResolveENS ensName="soco.eth" /> */}

          <p className="text-center text-lg">
            Register and check phone numbers of ENS users in a privacy preserving way.
          </p>
        </div>

          <AddressInput onChange={setAddress} value={address} placeholder="Input your address" />
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">

        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            {/* <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
