"use client";
import React, { useEffect, useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../client";
import { bytesToString, hexToBytes } from "thirdweb";
import { prepareContractCall, sendTransaction } from "thirdweb";

const Proposals = () => {
  const totalProposals = 10;
  const account = useActiveAccount();
  const [proposals, setProposals] = useState<any[]>([]);
  const [newProposal, setNewProposal] = useState("");

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

  return (
    <div>
      {isPending ? (
        <p>Loading proposals...</p>
      ) : (
        proposals.map((proposal, index) => (
          <div
            key={index}
            className="flex justify-between items-center border border-zinc-800 p-8 mt-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
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
          </div>
        ))
      )}
    </div>
  );
};

export default Proposals;
