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

  const { data: ownerAddress, isPending: isOwnerPending } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  return (
    <div className="  h-[100%]  bg-slate-950">
      <div className=" inset-0 h-[100%]  bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
        <main className="p-4 pb-10  flex items-center justify-center container max-w-screen-lg mx-auto">
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

            <div className="flex justify-center ">
              <ConnectButton client={client} />
            </div>

            {account && (
              <div className="mt-10">
                <AddMember />
                <p className="mt-2 text-blue-400 ">
                  please add your wallet address and name to be a member
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
