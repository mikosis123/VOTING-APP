import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
const secretKey = process.env.NEXT_PUBLIC_TEMPLATE_SECRET_KEY;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
  secretKey: secretKey,
});

export const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x2Db79C297Ed7AC8cFF25432b97daa41033152E04",
  // abi: [
  //   {
  //     inputs: [
  //       {
  //         internalType: "address[]",
  //         name: "_members",
  //         type: "address[]",
  //       },
  //     ],
  //     stateMutability: "nonpayable",
  //     type: "constructor",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "newMember",
  //         type: "address",
  //       },
  //     ],
  //     name: "MemberAdded",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "proID",
  //         type: "uint256",
  //       },
  //     ],
  //     name: "ProposalCreated",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "proID",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "bool",
  //         name: "success",
  //         type: "bool",
  //       },
  //     ],
  //     name: "ProposalExecuted",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "uint256",
  //         name: "proID",
  //         type: "uint256",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "voter",
  //         type: "address",
  //       },
  //     ],
  //     name: "VoteCast",
  //     type: "event",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "address",
  //         name: "proposal",
  //         type: "address",
  //       },
  //       {
  //         internalType: "bytes",
  //         name: "data",
  //         type: "bytes",
  //       },
  //     ],
  //     name: "NewProposal",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "address",
  //         name: "_newMember",
  //         type: "address",
  //       },
  //     ],
  //     name: "addMember",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "proID",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "bool",
  //         name: "vote",
  //         type: "bool",
  //       },
  //     ],
  //     name: "castVote",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "proID",
  //         type: "uint256",
  //       },
  //     ],
  //     name: "executeProposal",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "address",
  //         name: "",
  //         type: "address",
  //       },
  //     ],
  //     name: "members",
  //     outputs: [
  //       {
  //         internalType: "bool",
  //         name: "",
  //         type: "bool",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "owner",
  //     outputs: [
  //       {
  //         internalType: "address",
  //         name: "",
  //         type: "address",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "uint256",
  //         name: "",
  //         type: "uint256",
  //       },
  //     ],
  //     name: "proposals",
  //     outputs: [
  //       {
  //         internalType: "address",
  //         name: "target",
  //         type: "address",
  //       },
  //       {
  //         internalType: "bytes",
  //         name: "data",
  //         type: "bytes",
  //       },
  //       {
  //         internalType: "uint256",
  //         name: "yesCount",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "uint256",
  //         name: "noCount",
  //         type: "uint256",
  //       },
  //       {
  //         internalType: "bool",
  //         name: "executed",
  //         type: "bool",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  // ],
});
