"use client";
import React, { useEffect } from "react";
import { client } from "../client"; // Ensure client is properly set up elsewhere
import {
  ConnectButton,
  useWalletBalance,
  useActiveAccount,
} from "thirdweb/react";
import { defineChain } from "thirdweb";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import useRouter

const chain = "ethereum"; // Define your chain, e.g., 'ethereum', 'polygon', etc.

const Nav = () => {
  const pathname = usePathname(); // Get the current router object
  const account = useActiveAccount(); // Get the connected account
  const { data, isLoading } = useWalletBalance({
    client,
    chain: defineChain(11155111),
    address: account?.address,
  });

  return (
    <nav className="bg-gray-700 text-white py-2 px-6 border-gray-500">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            voting app
          </span>
        </Link>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-blue-500 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            <li>
              <Link
                href="/"
                className={`py-2 px-3 text-xl ${
                  pathname === "/" ? "text-blue-500" : "text-gray-200"
                } rounded md:bg-transparent md:hover:text-blue-500  md:p-0 dark:text-white md:dark:text-blue-500`}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/proposals"
                className={`block py-2 px-3 text-xl ${
                  pathname === "/proposals" ? "text-blue-500" : "text-gray-200"
                } rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Proposals
              </Link>
            </li>
            <li>
              <Link
                href="/members"
                className={`block py-2 px-3 text-xl ${
                  pathname === "/members" ? "text-blue-500" : "text-gray-200"
                } rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Members
              </Link>
            </li>
            <li>
              <Link
                href="/excutedproposals"
                className={`block py-2 px-3 text-xl ${
                  pathname === "/excutedproposals"
                    ? "text-blue-500"
                    : "text-gray-200"
                } rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent`}
              >
                Executed Proposals
              </Link>
            </li>
          </ul>
        </div>
        <div className="my-auto p-2">
          <ConnectButton
            connectButton={{
              label: "Connect Wallet",
              className: "bg-white text-blue-700 px-4 py-2 rounded-md",
              style: {
                borderRadius: "10px",
                padding: "10px 20px",
              },
            }}
            client={client}
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
