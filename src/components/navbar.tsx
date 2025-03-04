"use client";

import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { baseSepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets";
import { tokenContractAddress } from "@/constants/contracts";
import { useState } from "react";
import { Loader2 } from "lucide-react";


export function Navbar() {
    const account = useActiveAccount();
    const [isClaiming, setIsClaiming] = useState(false);

    const handleClaimTokens = async () => {
        setIsClaiming(true);
        try {
            const resp = await fetch("/api/claimToken", {
                method: "POST",
                body: JSON.stringify({ address: account?.address }),
            });

            if (!resp.ok) { 
                throw new Error("Failed to claim tokens");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Simple Predicition Market</h1>
            <div className="flex items-center gap-2">

                {account && (
                    <button onClick={handleClaimTokens} disabled={isClaiming} variant="outline">
                        {isClaiming ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Claiming...
                            </>
                        ) : ("Claim tokens")}
                    </button>
                )}

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