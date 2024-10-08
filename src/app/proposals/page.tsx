"use client";
import React, { useEffect, useState } from "react";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { contract } from "../client";
import { bytesToString, hexToBytes, stringToBytes } from "thirdweb";
import { prepareContractCall, sendTransaction } from "thirdweb";

const Proposals = () => {
  const account = useActiveAccount();
  const [proposals, setProposals] = useState<any[]>([]);
  const [newProposal, setNewProposal] = useState("");
  const { mutate: sendTransactionon } = useSendTransaction();
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getAllProposals() view returns ((address target, bytes data, uint256 yesCount, uint256 noCount, bool executed)[])",
    params: [],
  });

  useEffect(() => {
    if (data) {
      const decodedProposals = data.map((proposal: any) => {
        return {
          ...proposal,
          decodedData: proposal.data
            ? bytesToString(hexToBytes(proposal.data))
            : "No Data",
        };
      });
      setProposals(decodedProposals);
    }
  }, [data]);

  const castVote = async (proposalId: number, vote: boolean) => {
    if (!account) {
      console.error("No active account found");
      return;
    }

    try {
      const transaction = await prepareContractCall({
        contract,
        method: "function castVote(uint256 proID, bool vote)",
        params: [BigInt(proposalId), vote],
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      console.log("Transaction successful!", transactionHash);
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };
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

      sendTransactionon(transaction, {
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
  const excute = async (proID: number) => {
    const transaction = await prepareContractCall({
      contract,
      method: "function executeProposal(uint256 proID)",
      params: [BigInt(proID)],
    });
    const { transactionHash } = await sendTransaction({
      transaction,
      account,
    });
  };
  return (
    <div>
      <div className="flex justify-center item-center py-4">
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
      </div>
      {isPending ? (
        <p>Loading proposals...</p>
      ) : (
        proposals.map((proposal, index) => (
          <div
            key={index}
            className="flex justify-between items-center w-[80%] mx-auto border border-zinc-800 p-8 mt-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
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
                Excuted: {proposal.executed.toString()}
              </p>
            </article>
            <div className="flex flex-col gap-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => castVote(index, true)}
              >
                Yes Vote
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => castVote(index, false)}
              >
                No Vote
              </button>
            </div>
            {account?.address === proposal.target && (
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => excute(index)}
              >
                Excute proposal
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Proposals;
