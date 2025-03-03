import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const predictionMarketContractAddress = "";
export const tokenContractAddress = "";

export const predictionMarketContract = getContract({
    client: client,
    chain: baseSepolia,
    address: predictionMarketContractAddress
});

export const tokenContract = getContract({
    client: client,
    chain: baseSepolia,
    address: tokenContractAddress
});

