"use client";
import { useReadContract } from "thirdweb/react";
import { contract } from "./client";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";

import Proposals from "./Proposals/page";

export default function Home() {
  const account = useActiveAccount();
  const chain = defineChain(11155111);
  const { data: balance, isLoading } = useWalletBalance({
    client,
    chain: chain,
    address: account?.address,
  });

  const { data, isPending } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });
  const { data: members, isPending: membersIsPending } = useReadContract({
    contract,
    method: "function members(address) view returns (bool)",
    params: [account?.address?.toString() ?? ""],
  });
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
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

        <div className="flex justify-center mb-20">
          <ConnectButton client={client} />
        </div>
        <div className="grid gap-4  justify-center">
          <p>wallet address {account?.address}</p>
          {/* Show loading message while data is being fetched */}
          <p>Owner Address: {data?.toString()}</p>
          <p>
            Wallet balance: {balance?.displayValue} {balance?.symbol}
          </p>
          <p>Members: {members?.toString()}</p>

          <Proposals />
        </div>
      </div>
    </main>
  );
}
