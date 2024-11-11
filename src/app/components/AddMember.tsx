import React, { useEffect } from "react";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { contract } from "../client";

const AddMember = () => {
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const [_newMember, setNewMember] = React.useState("");
  const [_name, setName] = React.useState("");
  console.log(_newMember);
  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function addMember(address _newMember, string _name)",
      params: [_newMember, _name],
    });
    sendTransaction(transaction);

    setName("");
  };
  useEffect(() => {
    setNewMember(account?.address || ""); // set empty string if account.address is undefined
  }, [account]);

  return (
    <div className="flex items-center justify-center">
      {/* <input
        onChange={(e) => setNewMember(e.target.value)}
        type="text"
        className="border text-black border-gray-300 rounded-md p-2 m-2"
        placeholder="address"
        id="newMember"
        name="newMember"
      /> */}
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="border text-black border-gray-300 rounded-md p-2 m-2"
        id="isname"
        placeholder="name"
        name="isname"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onClick}
      >
        register
      </button>
    </div>
  );
};

export default AddMember;
