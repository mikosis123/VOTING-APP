"use client";
import React, { useEffect, useState } from "react";
import {
  useActiveAccount,
  useContractEvents,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { contract } from "../client";
import {
  bytesToString,
  hexToBytes,
  prepareEvent,
  stringToBytes,
} from "thirdweb";
import { prepareContractCall, sendTransaction } from "thirdweb";

const Proposals = () => {
  const account = useActiveAccount();
  const [proposals, setProposals] = useState<any[]>([]);
  const [newProposal, setNewProposal] = useState("");
  const { mutate: sendTransactionon } = useSendTransaction();
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getProposals() view returns ((address target, bytes data, uint256 yesCount, uint256 noCount, bool executed, bool isDeleted)[])",
    params: [],
  });
  console.log("data", data);
  const preparedEvent = prepareEvent({
    contract,
    signature: "event VoteCast(uint256 proID, address voter)",
  });
  const { data: event } = useContractEvents({
    contract,
    events: [preparedEvent],
  });
  console.log("event", event);

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
      const transaction = prepareContractCall({
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
  console.log(proposals); // Already returns `bytes`

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
      setNewProposal("");
      sendTransactionon(transaction, {
        onSuccess: (txResult) => {
          console.log("Transaction successful!", txResult);

          setNewProposal("");
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
    // <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
    <div className="relative h-[100%] bg-slate-950">
      <div className="  inset-0   bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
        <div className="flex justify-center items-center py-4">
          <input
            value={newProposal}
            onChange={(e) => setNewProposal(e.target.value)}
            type="text"
            className="border text-gray-900 border-gray-300 rounded-md p-2 m-2"
            id="proposal"
            name="proposal"
            placeholder="Enter proposal data"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onClick}
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
              className="flex justify-between items-center w-[80%] mx-auto border bg-zinc-800 border-zinc-700 p-8 mt-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
            >
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  <span className="text-gray-400">Proposal: </span>
                  {proposal.decodedData}
                </h2>
                <p className="text-sm text-zinc-400 w-1/2">
                  <span>Yes voters:</span> {proposal.yesCount.toString()}
                </p>
                <p className="text-sm text-zinc-400">
                  No voters: {proposal.noCount.toString()}
                </p>
                {/* <p className="text-sm text-zinc-400">
                  Executed: {proposal.executed.toString()}
                </p> */}
              </div>
              <div className="flex flex-col gap-2 ">
                {!proposal.executed ? (
                  <>
                    {" "}
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => castVote(index, true)}
                    >
                      Vote Yes
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => castVote(index, false)}
                    >
                      Vote No
                    </button>
                  </>
                ) : (
                  <p>Proposal already executed</p>
                )}
                {account?.address === proposal.target && !proposal.executed && (
                  <button
                    className="text-blue-300 hover:text-blue-200"
                    onClick={() => excute(index)}
                  >
                    <span>excute proposal</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Proposals;
