import { predictionMarketContract } from "@/constants/contracts";
import { useReadContract } from "thirdweb/react";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { MarketCardSkeleton } from "./skeletonCard";

interface MarketCardProps {
    index: number;
    filter: 'active' | 'pending' | 'resolved'; 
}

// market interface
interface Market {
    question: string;
    optionA: string;
    optionB: string;
    endTime: number;
    totalOptionAShare: number;
    totalOptionBShare: number;
    resolved: boolean;
}

//shares balance
interface sharesBalance {
    opttionAShare: bigint;
    opttionBShare: bigint;
}

export default function MarketCard({index, filter}: MarketCardProps) {
    // get market data
    const { data: marketData, isLoading: isLoadingMarket } = useReadContract({
        contract: predictionMarketContract,
        method: "function getMarket(uint256) view returns (string question, string optionA, string optionB, uint256 endTime, uint256 totalOptionAShare, uint256 totalOptionBShare, bool resolved)",
        params: [BigInt(index)]
    });

    // parse the market
    const market: Market | undefined = marketData ? { 
        question: marketData[0],
        optionA: marketData[1],
        optionB: marketData[2],
        endTime: marketData[3],
        outcome: marketData[4],
        totalOptionAShare: marketData[5],
        totalOptionBShare: marketData[6],
        resolved: marketData[7]
    } : undefined;

    // get sares balance
    const { data: sharesBalanceData } = useReadContract({
        contract: predictionMarketContract,
        method: "function getSharesBalance(uint256 _marketId, address _user) view returns (uint256 opttionAShare, uint256 opttionBShare)",
        params: [BigInt(index), account?.address as string]
    });

    const sharesBalance: SharesBalance | undefined = sharesBalanceData ? {
        opttionAShare: sharesBalanceData[0],
        opttionBShare: sharesBalanceData[1]
    } : undefined;  

    // check if the market is expired
    const isExpired = new Date(Number(market?.endTime) * 1000) < new Date();
    // check if the market is resolved
    const isResolved = market?.resolved;

    // check if the market should be shown
    const shouldShow = () => {
        if (!market) return false;
        
        swtich (filter) {
            case 'active':
                return !isExpired;
            case 'pending':
                return !isResolved && isExpired;
            case 'resolved':
                return isResolved && isExpired;
            default:
                return true;  
            }
    };

    // if the market should not be shown, return null
    if (!shouldShow()) {
        return null;
    }

    return (
        <Card key={index} className="flex flex-col">
            {isLoadingMarketData ? (
                //Card Skeleotn Component
                <MarketCardSkeleton />
            ) : (
                <>
                <CardHeader>
                    <CardTitle>{market?.question}</CardTitle>
                </CardHeader>
                <CardContent>
                    {market && (
                        // Market Resolved component
                        <></>   
                    )}
                    {new Date(Number(market?.endTime) * 1000) < new Date() && (
                        // Market Resolved Component}
                        <></>
                    ) : (
                        //Market Pending component
                    )
                ) : (
                    // Market Buy Interface
                    <></>
                )}
                </CardContent>
                <CardFooter>
                    {market && sharesBalance && (
                        //Market share Component
                        <></>
                    )}
                </CardFooter>
            </>
        )}
        </Card>

    );
}    