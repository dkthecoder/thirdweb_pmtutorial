import { useReadContract } from "thirdweb/react";
import { Navbar } from "./navbar";
import { predictionMarketContract } from "@/constants/contracts";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

export default function PredictionMarketDashboard() {
    const { data: marketCount, isLoading: isLoadingMarketCount } = useReadContract({
        contract: predictionMarketContract,
        method: "function marketcount() view returns (uint256)",
        params: []
    });

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow container mx-auto p-4">
                <Navbar/>
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid w-full grid-col-3">
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="pending">Pending Resolution</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}