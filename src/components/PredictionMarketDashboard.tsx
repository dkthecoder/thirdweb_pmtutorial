import { useReadContract } from "thirdweb/react";
import { Navbar } from "./navbar";
import { predictionMarketContract } from "@/constants/contracts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { MarketCardSkeleton } from "./skeletonCard";

export default function PredictionMarketDashboard() {
    const { data: marketCount, isLoading: isLoadingMarketCount } = useReadContract({
        contract: predictionMarketContract,
        method: "function marketcount() view returns (uint256)",
        params: []
    });

    const skeletonCards = Array.from({ length: 6 }, (_, index) => (
        <MarketCardSkeleton key={index} />
    ));

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow container mx-auto p-4">
                <Navbar/>
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-col-3">
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="pending">Pending Resolution</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                        {
                            isLoadingMarketCount ? (

                             <TabsContent value="active" className="mt-6">
                                <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    { skeletonCards }
                                </div>
                            </TabsContent>
                            ) : (
                                <>

                                <TabsContent value="active" className="mt-6">
                                    <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {Array.from({ length: Number(marketCount) }, (_, index) => (
                                            <></>
                                        ))}
                                    </div>
                                </TabsContent>  

                                <TabsContent value="pending" className="mt-6">
                                    <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {Array.from({ length: Number(marketCount) }, (_, index) => (
                                            <></>
                                        ))}
                                    </div>
                                </TabsContent>  

                                <TabsContent value="resolved" className="mt-6">
                                    <div className="grid grid-col-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {Array.from({ length: Number(marketCount) }, (_, index) => (
                                            <></>
                                        ))}
                                    </div>
                                </TabsContent>  
                                
                                </>
                            )}

                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}