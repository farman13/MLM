export const mlmContractAddress = "0xYOUR_CONTRACT_ADDRESS";

export const mlmABI = [
    {
        inputs: [{ internalType: "address", name: "_referrer", type: "address" }],
        name: "registerUser",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];
