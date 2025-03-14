import { tokenContractAddress } from "@/constants/contracts";
import { NextResponse } from "next/server";

const {
    BACKEND_WALLET_ADDRESS,
    ENGINE_URL,
    THIRDWEB_SECRET_KEY,
} = process.env;
 
async function checkTransactionStatus(queueId: string) : Promise<boolean> {
    const statusResponce = await fetch(`${ENGINE_URL}/transaction/status/${queueId}`, {
        headers: {
        Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
        },
    });

    if (statusResponce.ok) {
        const statusData = await statusResponce.json();
        return statusData.reuslts.status === "mined";
    }
    return false;
}

async function pollTransactionStatus(queueId: string, maxAttempt: 15, interval: 3000): Promise<boolean> {
    for (let attempt = 0; attempt < maxAttempt; attempt++) {
        const isMined = await checkTransactionStatus(queueId);
        if (isMined) return true;
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    return false;
}

export async function POST(request: Request) {
    if (
        !BACKEND_WALLET_ADDRESS ||
        !ENGINE_URL ||
        !THIRDWEB_SECRET_KEY
    ) {
        throw 'Server misconfigure, did you forgot to add a ".env.local" file?';
    }

    const { address } = await request.json();

    const resp = await fetch(
        `${ENGINE_URL}/contract/84532/${tokenContractAddress}/erc20/mint-to`,
        {
            method: "POST",
            headers: {
                "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
                Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "toAddress": address as string,
                "amount": "100",
        }),
        }
    );

    if (resp.ok) {
        const data = await resp.json();
        const queueId = data.results.queueId;
        const isMined = await pollTransactionStatus(queueId);

        if (isMined) {
            return NextResponse.json({ message: "Transaction mined successfully!", queueId });
        } else {
            return NextResponse.json({ message: "Transaction not mined within the timeout period", queueId }, { status: 500 });
        }
    } else {
        const errorText = await resp.text();
        console.error("[DEBUG] not OK", errorText);
        return NextResponse. json({ message: "Failed to initiate transaction", error: errorText }, { status: 500 });
    }

}