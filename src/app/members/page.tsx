"use client";
import React from "react";
import { useReadContract } from "thirdweb/react";
import { contract } from "../client";

const Members = () => {
  const { data, isPending } = useReadContract({
    contract,
    method:
      "function getAllMembers() view returns ((address memberAddress, string name)[])",
    params: [],
  });

  if (isPending) {
    return <p>Loading members...</p>;
  }

  if (data && data.length > 0) {
    // Filter out repeated members by address or name
    const uniqueMembers = Array.from(
      new Set(
        data.map((member: { memberAddress: string; name: string }) =>
          JSON.stringify(member)
        )
      )
    ).map((memberString) => JSON.parse(memberString));

    return (
      <div className="relative min-h-screen w-full bg-slate-950">
        <div className=" inset-0 h-screen  bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
          <h2>Members List</h2>
          {uniqueMembers.map(
            (
              member: { memberAddress: string; name: string },
              index: number
            ) => (
              <div
                key={index}
                className="flex justify-between items-center w-[80%] mx-auto border border-zinc-800 p-8 mt-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
              >
                <p>Address: {member.memberAddress}</p>
                <p>Name: {member.name}</p>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return <div>No members found.</div>;
};

export default Members;
