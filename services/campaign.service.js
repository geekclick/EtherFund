import { campaignABI, factoryABI, factoryAddress } from "@/constants";
import { ethers } from "ethers";

export const createNewCampaign = async (signer, data, router, setError) => {
    try {
        console.log(factoryAddress)
        const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);

        const tx = await factoryContract.createCampaign(
            ethers.utils.parseUnits(data.minimumContribution, "ether"),
            data.campaignName,
            data.description,
            data.imageUrl,
            ethers.utils.parseUnits(data.target, "ether")
        );

        await tx.wait();
        router.push("/");
    } catch (err) {
        setError(err.message);
        console.log(err);
    }
}

export const fetchCampaigns = async (signer, setCampaigns) => {
    console.log(factoryAddress)
    console.log(factoryABI)
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);
    const deployedCampaigns = await factoryContract.getDeployedCampaigns();
    const campaignSummaries = await Promise.all(
        deployedCampaigns.map(async (address) => {
            const campaignContract = new ethers.Contract(address, campaignABI, signer);
            const summary = await campaignContract.getSummary();
            return {
                address,
                minimumContribution: summary[0].toString(),
                balance: summary[1].toString(),
                requestsCount: summary[2].toString(),
                approversCount: summary[3].toString(),
                manager: summary[4],
                name: summary[5],
                description: summary[6],
                imageUrl: summary[7],
                target: summary[8].toString(),
            };
        })
    );
    console.log(campaignSummaries)
    setCampaigns(campaignSummaries);
};

export const handleContribute = async (signer, campaignAddress, contributionAmount) => {
    try {
        const campaignContract = new ethers.Contract(campaignAddress, campaignABI, signer);

        // Convert contribution amount to wei (1 ETH = 10^18 wei)
        const amountInWei = ethers.utils.parseEther(contributionAmount);

        // Call contribute function
        const tx = await campaignContract.contribute({
            value: amountInWei,
        });

        // Wait for transaction receipt
        await tx.wait();
        alert("Contribution successful!");
    } catch (error) {
        console.error("Error contributing:", error);
        alert("Error contributing to the campaign.");
    }
};

export const fetchRequests = async (signer, campaignAddress, setRequests) => {
    try {
        const campaignContract = new ethers.Contract(campaignAddress, campaignABI, signer);

        // Get total number of requests
        const count = await campaignContract.getRequestsCount();
        // setRequestsCount(count.toNumber());
        const requestsCount = count.toNumber();
        // Fetch details of each request
        const requestsData = await Promise.all(
            Array.from({ length: requestsCount }, (_, index) => {
                return campaignContract.getRequest(index);
            })
        );

        setRequests(requestsData);
    } catch (error) {
        console.error("Error fetching requests:", error);
    }
};