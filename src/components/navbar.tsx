"use client";

import { ConnectButton, lightTheme } from "thirdweb/react";
import { client } from "@/app/client";
import { baseSepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
import { tokenContractAddress } from "@/constants/contracts";

export function Navbar() {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Simple Predicition Market</h1>
            <div className="flex items-center gap-2">

                <ConnectButton client={client} theme={lightTheme()} chain={baseSepolia} connectButton={{ label: "Sign In" }} wallets={[inAppWallet()]}
                accountAbstraction={{
                    chain: baseSepolia,
                    sponsorGas: true,
                }}
                detailsButton={{
                    displayBalanceToken: {
                        [baseSepolia.id]: tokenContractAddress
                    }
                }}
                
                />
            </div>
        </div> 
    )
}