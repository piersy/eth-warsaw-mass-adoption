"use client";

import { useSocialConnect } from "../SocialConnect/useSocialConnect";
import type { NextPage } from "next";

const Register: NextPage = () => {
  const { register, sendVerifySms } = useSocialConnect();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const phone = form.phone.value;
    const success = await sendVerifySms(phone);
    if (success) {
      const token = prompt("Enter the verification token sent to your phone");
      if (token) {
        const res = await register(phone, token);
        if (res.success) {
          alert("Phone number registered successfully!");
        } else {
          alert(`Could not register phone number. Registration may already exist. Reason: ${res.error}`);
        }
      } else {
        alert("Verification token not provided");
      }
    } else {
      alert("Failed to send verification token");
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Register your ENS phone number</span>
          </h1>
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
