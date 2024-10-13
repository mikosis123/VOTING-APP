"use client";
import React, { useEffect, useState } from "react";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { contract } from "../client";
import { bytesToString, hexToBytes, stringToBytes } from "thirdweb";
import { prepareContractCall } from "thirdweb";

const ExecutedProposals = () => {
  const account = useActiveAccount();
  const [proposals, setProposals] = useState<any[]>([]);
  const [newProposal, setNewProposal] = useState("");
  const { mutate: sendTransaction } = useSendTransaction();
  const RemoveProposal = async (proId: number) => {
    if (!account) {
      console.error("No active account found");
      return;
    }

    try {
      // Prepare the contract call to delete the proposal
      const transaction = await prepareContractCall({
        contract,
        method: "function deleteProposal(uint256 proID)",
        params: [BigInt(proId)],
      });

      // Send the transaction and handle the result
      sendTransaction(transaction, {
        onSuccess: (txResult) => {
          console.log("Proposal removed successfully", txResult);

          // Update the proposals list in the state after successful removal
          setProposals((prevProposals) =>
            prevProposals.filter((proposal) => proposal.id !== proId)
          );
        },
        onError: (error) => {
          console.error("Failed to remove proposal:", error);
        },
      });
    } catch (error) {
      console.error("Error preparing or sending transaction:", error);
    }
  };

  // Fetch the proposals from the contract
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getProposals() view returns ((address target, bytes data, uint256 yesCount, uint256 noCount, bool executed, bool isDeleted)[])",
    params: [],
  });

  // Decode proposal data when it's fetched
  useEffect(() => {
    if (data) {
      const decodedProposals = data.map((proposal: any) => ({
        ...proposal,
        decodedData: proposal.data
          ? bytesToString(hexToBytes(proposal.data))
          : "No Data",
      }));
      setProposals(decodedProposals);
    }
  }, [data]);

  // Encode the new proposal data into hex
  const encodedData = stringToBytes(newProposal);
  const hexEncodedData = `0x${Buffer.from(encodedData).toString(
    "hex"
  )}` as `0x${string}`;

  const onClick = async () => {
    if (!account?.address) {
      console.error("No account connected");
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "function NewProposal(address proposal, bytes data)",
        params: [account.address, hexEncodedData],
      });

      // Send the transaction
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

  return (
    <div className="relative min-h-screen w-full bg-slate-950 pb-10">
      <div className=" inset-0 h-screen py-8 bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
        {isPending ? (
          <p>Loading proposals...</p>
        ) : (
          proposals
            .filter((proposal) => proposal.executed && !proposal.isDeleted) // Only show executed proposals
            .map((proposal, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-[80%] mx-auto border border-zinc-800 p-8  rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
              >
                <article>
                  <h2 className="text-lg font-semibold mb-2">
                    {proposal.decodedData}
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Yes counts: {proposal.yesCount.toString()}
                  </p>
                  <p className="text-sm text-zinc-400">
                    No counts: {proposal.noCount.toString()}
                  </p>
                  <p className="text-sm text-zinc-400">
                    Executed: {proposal.executed.toString()}
                  </p>
                  <p className="text-sm text-zinc-400">
                    delated: {proposal.isDeleted.toString()}
                  </p>
                </article>
                <div className="flex flex-col gap-4">
                  <button
                    className="bg-gray-500  text-white font-bold py-2 px-4 rounded"
                    onClick={() => {}}
                  >
                    no longer on vote (excuted)
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => RemoveProposal(index)}
                  >
                    remove the proposal
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ExecutedProposals;
