/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  11155111: {
    YourContract: {
      address: "0x0fcd2b67f73d0f6a2d8ab3e2167e0b8d151cba4e",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_owner",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "receive",
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "greeting",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "premium",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "setGreeting",
          inputs: [
            {
              name: "_newGreeting",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "totalCounter",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "userGreetingCounter",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "withdraw",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "GreetingChange",
          inputs: [
            {
              name: "greetingSetter",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "newGreeting",
              type: "string",
              indexed: false,
              internalType: "string",
            },
            {
              name: "premium",
              type: "bool",
              indexed: false,
              internalType: "bool",
            },
            {
              name: "value",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
    },
    OffchainResolver: {
      address: "0xb880785961b8fc4630dda03b439d07009464111f",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_url",
              type: "string",
              internalType: "string",
            },
            {
              name: "_signer",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "makeSignatureHash",
          inputs: [
            {
              name: "target",
              type: "address",
              internalType: "address",
            },
            {
              name: "expires",
              type: "uint64",
              internalType: "uint64",
            },
            {
              name: "request",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "result",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "pure",
        },
        {
          type: "function",
          name: "resolve",
          inputs: [
            {
              name: "name",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "data",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "resolveWithProof",
          inputs: [
            {
              name: "response",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "extraData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "signer",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "supportsInterface",
          inputs: [
            {
              name: "",
              type: "bytes4",
              internalType: "bytes4",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "pure",
        },
        {
          type: "function",
          name: "url",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "event",
          name: "NewSigner",
          inputs: [
            {
              name: "signer",
              type: "address",
              indexed: false,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "error",
          name: "ECDSAInvalidSignature",
          inputs: [],
        },
        {
          type: "error",
          name: "ECDSAInvalidSignatureLength",
          inputs: [
            {
              name: "length",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
        {
          type: "error",
          name: "ECDSAInvalidSignatureS",
          inputs: [
            {
              name: "s",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
        },
        {
          type: "error",
          name: "OffchainLookup",
          inputs: [
            {
              name: "sender",
              type: "address",
              internalType: "address",
            },
            {
              name: "urls",
              type: "string[]",
              internalType: "string[]",
            },
            {
              name: "callData",
              type: "bytes",
              internalType: "bytes",
            },
            {
              name: "callbackFunction",
              type: "bytes4",
              internalType: "bytes4",
            },
            {
              name: "extraData",
              type: "bytes",
              internalType: "bytes",
            },
          ],
        },
      ],
      inheritedFunctions: {
        resolve: "contracts/IExtendedResolver.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
