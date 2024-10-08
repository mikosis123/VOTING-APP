"use client";
import { useReadContract } from "thirdweb/react";
import { contract } from "./client";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import AddMember from "./components/AddMember";

import { useState } from "react";

export default function Home() {
  const account = useActiveAccount();
  const chain = defineChain(11155111); // Assuming this is Sepolia testnet.

  const { data: balance, isLoading: isBalanceLoading } = useWalletBalance({
    client,
    chain: chain,
    address: account?.address,
  });

  const { data: ownerAddress, isPending: isOwnerPending } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: members, isPending: isMembersPending } = useReadContract({
    contract,
    method: "function members(address) view returns (bool)",
    params: [account?.address?.toString() ?? ""],
  });

  return (
    <>
      <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
        <div className="py-20">
          {account ? (
            <header className="flex flex-col items-center mb-20 md:mb-20">
              <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
                Voting for{" "}
                <span className="text-zinc-300 inline-block mx-1"> any </span>
                <span className="inline-block -skew-x-6 text-blue-500">
                  {" "}
                  proposals{" "}
                </span>
              </h1>
            </header>
          ) : (
            <header className="flex flex-col items-center mb-20 md:mb-20">
              <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
                Connect{" "}
                <span className="text-zinc-300 inline-block mx-1"> to </span>
                <span className="inline-block -skew-x-6 text-blue-500">
                  {" "}
                  ur wallet{" "}
                </span>
              </h1>
            </header>
          )}

          <div className="flex justify-center mb-20">
            <ConnectButton client={client} />
          </div>

          {account && (
            <div>
              <AddMember />

              <div className="grid gap-4 justify-center mt-10">
                <p>Wallet Address: {account?.address}</p>

                {isOwnerPending ? (
                  <p>Loading owner address...</p>
                ) : (
                  <p>Owner Address: {ownerAddress?.toString()}</p>
                )}

                {isBalanceLoading ? (
                  <p>Loading wallet balance...</p>
                ) : (
                  <p>
                    Wallet Balance: {balance?.displayValue} {balance?.symbol}
                  </p>
                )}

                {isMembersPending ? (
                  <p>Checking membership status...</p>
                ) : (
                  <p>Is Member: {members ? "Yes" : "No"}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
