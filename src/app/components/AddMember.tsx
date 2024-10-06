import React from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "../client";

const AddMember = () => {
  const { mutate: sendTransaction } = useSendTransaction();
  const [_newMember, setNewMember] = React.useState("");
  console.log(_newMember);
  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function addMember(address _newMember)",
      params: [_newMember],
    });
    sendTransaction(transaction);
  };
  return (
    <div>
      <input
        onChange={(e) => setNewMember(e.target.value)}
        type="text"
        className="border border-gray-300 rounded-md p-2 m-2"
        id="newMember"
        name="newMember"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onClick}
      >
        Add Member
      </button>
    </div>
  );
};

export default AddMember;
