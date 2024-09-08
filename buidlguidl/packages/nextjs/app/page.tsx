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
    const odisIdentifier = await lookupOdisId(phone);

    console.log("ODIS Identifier", odisIdentifier);

    const options = {
      provider: "http://127.0.0.1:8545", // Example provider URL
    };
    const ensAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example ENS registry address
    const provider = new ethers.providers.JsonRpcProvider(options.provider, {
      chainId: 31337,
      name: "localhost",
      ensAddress: ensAddress,
    });

    const shortId = odisIdentifier.slice(2, 34); // NOTE: ethers doesn't support ens names longer than 63 bytes
    console.log(shortId);
    const resolver = await provider.getResolver(`${shortId}.file.soco.eth`);
    if (resolver) {
      const ethAddress = await resolver.getAddress();
      const content = await resolver.getContentHash();
      const email = await resolver.getText("email");
      console.log(`resolver address ${resolver.address}`);
      console.log(`eth address ${ethAddress}`);
      console.log(`content ${content}`);
      console.log(`email ${email}`);
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
          <span className="block text-2xl font-bold">{resolved}</span>
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
                <option defaultValue="op">OP</option>
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

// "use client";

// import Link from "next/link";
// import type { NextPage } from "next";
// import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import { Address  } from "~~/components/scaffold-eth";
// import { AddressInput } from "./EnsEntry";
// import { useState } from "react";

// import { useEnsAddress } from 'wagmi'
// import { useState } from "react";
// // import { normalize } from 'viem/ens'

// function ResolveENS({ ensName }) {
//   console.log("Renders");
//   const { data: address, isLoading, error } = useEnsAddress({
//     name: ensName
//     // , chainId: 11155111
//   });

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error resolving ENS: {error.message}</div>;
//   return <div>{ensName} resolves to: {address}</div>;
// }

// const Home: NextPage = () => {
//   const { address: connectedAddress } = useAccount();
//   const [ensName, setENS] = useState("");
//   const [ensNameInput, setEnsNameInput] = useState("");

//   const [address, setAddress] = useState("");

//   return (
//     <>
//       <div className="flex items-center flex-col flex-grow pt-10">
//         <div className="px-5">
//           <h1 className="text-center">
//             <span className="block text-4xl font-bold">Social ENS</span>
//           </h1>
//           <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
//             <p className="my-2 font-medium">Connected Address:</p>
//             <Address address={connectedAddress} />
//           </div>
//           <form>
//             <label>Enter your Phone number:
//               <input
//                 type="text"
//                 value={ensNameInput}
//                 onChange={(event) => setEnsNameInput(event.target.value)}
//                 />
//             </label>
//             .soco.eth {"    "}
//             {/* <input type="submit" onSubmit={(event) =>  setENS (event.value } /> */}
//             <input type="button" value="Submit" onClick={(event) =>  {
//               setENS(ensNameInput);
//               }} />
//           </form>

//           { ensName && <ResolveENS ensName={ensName} /> }
//           {/* <ResolveENS ensName="soco.eth" /> */}

//           <p className="text-center text-lg">
//             Register and check phone numbers of ENS users in a privacy preserving way.
//           </p>
//         </div>

//           <AddressInput onChange={setAddress} value={address} placeholder="Input your address" />
//         <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">

//         <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
//             {/* <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <BugAntIcon className="h-8 w-8 fill-secondary" />
//               <p>
//                 Tinker with your smart contract using the{" "}
//                 <Link href="/debug" passHref className="link">
//                   Debug Contracts
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div>
//             <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
//               <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
//               <p>
//                 Explore your local transactions with the{" "}
//                 <Link href="/blockexplorer" passHref className="link">
//                   Block Explorer
//                 </Link>{" "}
//                 tab.
//               </p>
//             </div> */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
