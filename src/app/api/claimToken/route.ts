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