import React, { useEffect, useState } from "react";
import { contract } from "../client";
import { bytesToString, hexToBytes } from "thirdweb";

const Proposals = () => {
  const totalProposals = 10; // Replace with dynamic total proposals if needed
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create an array of promises for fetching each proposal in parallel
    const fetchProposals = async () => {
      try {
        const proposalPromises = Array.from(
          { length: totalProposals },
          (_, i) => contract // Fetch proposal at index i
        );

        // Wait for all promises to resolve
        const results = await Promise.all(proposalPromises);

        // Decode and transform the results
        const decodedProposals = results.map((proposal: any) => ({
          target: proposal.target,
          description: bytesToString(hexToBytes(proposal.data)), // Assuming description is in bytes
          yesCount: proposal.yesCount,
          noCount: proposal.noCount,
          executed: proposal.executed,
        }));

        setProposals(decodedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setIsLoading(false); // Stop loading indicator
      }
    };

    fetchProposals();
  }, [totalProposals]);

  if (isLoading) {
    return <p>Loading proposals...</p>;
  }

  return (
    <div className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700">
      {proposals.length > 0 ? (
        proposals.map((proposal, index) => (
          <article key={index} className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              Proposal {index + 1}: {proposal.description}
            </h2>
            <p className="text-sm text-zinc-400">Target: {proposal.target}</p>
            <p className="text-sm text-zinc-400">
              Yes Votes: {proposal.yesCount}
            </p>
            <p className="text-sm text-zinc-400">
              No Votes: {proposal.noCount}
            </p>
            <p className="text-sm text-zinc-400">
              Executed: {proposal.executed ? "Yes" : "No"}
            </p>
          </article>
        ))
      ) : (
        <p>No proposals found.</p>
      )}
    </div>
  );
};

export default Proposals;
