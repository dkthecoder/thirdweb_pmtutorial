import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";

export function Navbar() {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Simple Predicition Market</h1>
            <div className="flex items-center gap-2">
                <ConnectButton
                client={client}/>
            </div>
        </div>
    )
}