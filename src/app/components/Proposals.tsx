import React, { useEffect, useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../client";
import { bytesToString, hexToBytes } from "thirdweb";
import { prepareContractCall, sendTransaction } from "thirdweb";

const Proposals = () => {
  const totalProposals = 10;
  const account = useActiveAccount();
  const [proposals, setProposals] = useState<any[]>([]);
  let i = 1;

  const { data, isPending } = useReadContract({
    contract,
    method:
      "function proposals(uint256) view returns (address target, bytes data, uint256 yesCount, uint256 noCount, bool executed)",
    params: [BigInt(i)],
  });
  const decodedProposalData = data?.[1]
    ? bytesToString(hexToBytes(data?.[1]))
    : undefined;
  console.log(data ? data : "No data");

  const voteyes = async (i: number, yesvote: boolean) => {
    if (!account) {
      console.error("No active account found");
      return;
    }
    try {
      // Send the transaction directly using sendTransaction
      const transaction = await prepareContractCall({
        contract,
        method: "function castVote(uint256 proID, bool vote)", // Simplified method name
        params: [BigInt(i), yesvote], // Pass proposal ID and vote
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      console.log("Transaction successful!", transaction); // Log the result
    } catch (error) {
      console.error("Error casting vote:", error); // Handle any errors
    }
  };
  const voteno = async (i: number, novote: boolean) => {
    if (!account) {
      console.error("No active account found");
      return;
    }
    try {
      // Send the transaction directly using sendTransaction
      const transaction = await prepareContractCall({
        contract,
        method: "function castVote(uint256 proID, bool vote)", // Simplified method name
        params: [BigInt(i), novote], // Pass proposal ID and vote
      });
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      console.log("Transaction successful!", transaction); // Log the result
    } catch (error) {
      console.error("Error casting vote:", error); // Handle any errors
    }
  };

  return (
    <div className="flex justify-between items-center border border-zinc-800 p-8 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700">
      <article>
        <h2 className="text-lg font-semibold mb-2">{decodedProposalData}</h2>
        <p className="text-sm text-zinc-400">
          yes counts {data?.[2].toString()}
        </p>
        <p className="text-sm text-zinc-400">
          no counts {data?.[3].toString()}
        </p>
      </article>
      <div className="flex flex-col gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => voteyes(i, true)}
        >
          yes vote
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => voteno(i, false)}
        >
          No vote
        </button>
      </div>
    </div>
  );
};

export default Proposals;
