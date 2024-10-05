import React, { useEffect, useState } from "react";
import { useReadContract } from "thirdweb/react";
import { contract } from "../client";
import { bytesToString, hexToBytes } from "thirdweb";

const Proposals = () => {
  const [proposalCount, setProposalCount] = useState<number | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);

  return (
    <div className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700">
      <article>
        <h2 className="text-lg font-semibold mb-2">{}</h2>
        <p className="text-sm text-zinc-400">{}</p>
        <p>Target: {proposals.target}</p>
        <p>Description: {proposal.description}</p>
        <p>Yes Votes: {proposal.yesCount}</p>
        <p>No Votes: {proposal.noCount}</p>
        <p>Executed: {proposal.executed ? "Yes" : "No"}</p>
      </article>
    </div>
  );
};

export default Proposals;
