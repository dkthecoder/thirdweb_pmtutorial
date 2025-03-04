import { predictionMarketContract, predictionMarketContractAddress, tokenContract } from "@/constants/contracts";
import { Loader2 } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { prepareContractCall, readContract, toWei } from "thirdweb";
import { approve } from "thirdweb/extensions/erc20";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button } from "./ui/button";

interface MarketBuyInterfaceProps {
    marketId: number;
    market: {
        question: string;
        optionA: string;
        optionB: string;
    };
}   

// Type aliases for better readability
type BuyingStep = "initial" | "allowance" | "confirm";
type Option = "A" | "B" | null;

export function MarketBuyInterface({ marketId, market }: MarketBuyInterfaceProps) {
    const account = useActiveAccount();
    const { mutateAsync: mutateTransaction } = useSendAndConfirmTransaction()

    const [isBuying, setIsBuying] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [containerHeight, setContainerHeight] = useState('auto');
    const contentRef = useRef<HTMLDivElement>(null);

    const [selectedOption, setSelectedOption] = useState<Option>(null);
    const [amount, setAmount] = useState(0);
    const [buyingStep, setBuyingStep] = useState<BuyingStep>("initial");
    const [isApproving, setIsApproving] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const {error, setError} = useState<string | null>(null);

    useEffect(() => {
        if (contentRef.current) {
            setTimeout(() => {
                setContainerHeight(`${contentRef.current?.offsetHeight || 0}px`);
            }, 0)
        }
    }, [isBuying, buyingStep, isVisible, error]);

     // Handers for user interactions
    const HandleBuy = (option: 'A' | 'B') => {
        setIsVisible(false);
        setTimeout(() => {
            setIsBuying(true);
            setSelectedOption(option);
            setIsVisible(true);
        }, 200) // Match transaction duraction
    }

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsBuying(false);
            setBuyingStep("initial");
            setSelectedOption(null);
            setAmount(0);
            setError(null);
            setIsVisible(true);
        }, 200)
    }

    // Check if user needs to approve token spending
    const checkApproval = async () => {
        if (amount <=0) {
            setError("Amount must be greater than 0");
            return;
        }
        setError(null);

        try {
            const userAllowance = await readContract({
                contract: tokenContract,
                method: "function allowance(address owner, address spender) view returns (uint256)",
                params: [account?.address as string, tokenContract.address]
            });

            setBuyingStep(userAllowance < BigInt(toWei(amount.toString())) ? "allowance" : "confirm");
            }  catch (error) {
                console.error(error);
            }
    };

    // Handle token approval transaction
    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const tx = await approve({
                contract: tokenContract,
                spender: predictionMarketContractAddress,
                amount: amount
            });
            await mutateTransaction(tx);
            setBuyingStep("confirm");
        } catch (error) {
            console.error(error);
        } finally {
            setIsApproving(false);
        }
    };

    const handleConfirm = async () => {
        if (!selectedOption || amount <= 0) {
            setError("Please select an option and enter an amount");
            return;
        }

        setIsConfirming(true);
        try {
            const tx = await prepareContractCall({
                contract: predictionMarketContract,
                method: "function buyShares(uint256 _marketId, bool _isOptionA, uint256 _amount)",
                params: [BigInt(marketId), selectedOption === "A", BigInt(toWei(amount.toString()))]
            });
            await mutateTransaction(tx);
            handleCancel();
        } catch (error) {
            console.error(error);
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="relative transition-[height] duration-200 ease-in-out overflow-hidden" style={{ height: containerHeight }}>
            <div ref={contentRef} className={cn("w-full transition-all duration-200 ease-in-out", isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                {!isBuying ? (
                    //intiial option selecting buttons
                    <div className="flex justify-between gap-4 mb-4">
                        <button className="flex-1" onClick={() => HandleBuy('A')} aria-label={`Vote ${market.optionA} for "${market.question}"`} disabled={!account}>
                            {market.optionA}
                        </button>
                        <button className="flex-1" onClick={() => HandleBuy('B')} aria-label={`Vote ${market.optionB} for "${market.question}"`} disabled={!account}>
                            {market.optionB}
                        </button>
                    </div>

                    ) : (
                        // Buying interface
                        <div className="flex flex-col mb-4">
                            {buyingStep === "allowance" ? (
                                // approave step
                                <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4">
                                    <h2 className="text-lg font-bold mb-4">Approval Needed</h2>
                                    <p className="mb-4">You need to approve the transaction before proceeding.</p>
                                    <div className="flex justify-end">
                                        <Button className="mb-2" onClick={handleSetApproval} disabled={isApproving}>
                                            {isApproving ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                    Approving...
                                                </>
                                            ) : (
                                                'Set Approval'
                                            )}
                                        </Button>
                                        <Button onClick={handleCancel} className="ml-2" variant="outline" disabled={isApproving}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>

                            ) : buyingStep === "confirm" ? (
                                // confimr step
                                <
                                
                            )                                
                        )
                }
                    
            </div>
        </div>

    );

}
