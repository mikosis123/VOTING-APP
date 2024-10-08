"use client";
import { useReadContract, useSendTransaction } from "thirdweb/react";
import { contract } from "./client";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import { useActiveAccount, useWalletBalance } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import Proposals from "./components/Proposals";
import AddMember from "./components/AddMember";
import { prepareContractCall, stringToBytes } from "thirdweb";
import { useState } from "react";
import { Buffer } from "buffer";
import Nav from "./components/Nav";
export default function Home() {
  const account = useActiveAccount();
  const chain = defineChain(11155111); // Assuming this is Sepolia testnet.
  const [newProposal, setNewProposal] = useState("");
  const { mutate: sendTransaction } = useSendTransaction();
  const { data: balance, isLoading: isBalanceLoading } = useWalletBalance({
    client,
    chain: chain,
    address: account?.address,
  });

  const encodedData = stringToBytes(newProposal);
  const hexEncodedData = `0x${Buffer.from(encodedData).toString(
    "hex"
  )}` as `0x${string}`;
  console.log(hexEncodedData); // Already returns `bytes`

  const onClick = async () => {
    if (!account?.address) {
      console.error("No account connected");
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "function NewProposal(address proposal, bytes data)",
        params: [account.address, hexEncodedData], // Pass address and encoded data
      });

      sendTransaction(transaction, {
        onSuccess: (txResult) => {
          console.log("Transaction successful!", txResult);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
        },
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
    }
  };

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
              <input
                value={newProposal}
                onChange={(e) => setNewProposal(e.target.value)}
                type="text"
                className="border border-gray-300 rounded-md p-2 m-2"
                id="proposal"
                name="proposal"
                placeholder="Enter proposal data"
              />

              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={onClick}
                // Disable button while sending
              >
                Creating Proposal
              </button>

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

                <Proposals />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
