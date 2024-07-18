import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import factory from "@/smart-contract/factory";
import campaign from "@/smart-contract/campaign";
import useCampaignStore from "@/store/useCampaignStore";
import useSignerStore from "@/store/useSignerStore";

const factoryABI = factory;
const factoryAddress = "0x68a5D6F439A3D9a22A6a729311DFb3A1d9ec5ea0"; // Replace with your deployed factory address
const campaignABI = campaign;

const CampaignList = () => {
    // const [campaigns, setCampaigns] = useState([]);
    const { campaigns, setCampaigns } = useCampaignStore()
    const { signer, setSigner } = useSignerStore()

    useEffect(() => {
        if (signer) {
            const fetchCampaigns = async () => {
                console.log(signer)
                const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
                const factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);
                const deployedCampaigns = await factoryContract.getDeployedCampaigns();

                const campaignSummaries = await Promise.all(
                    deployedCampaigns.map(async (address) => {
                        const campaignContract = new ethers.Contract(address, campaignABI, provider);
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

            console.log(campaigns)
            fetchCampaigns();
        }
    }, []);

    return (
        <div>
            <h1>Deployed Campaigns</h1>
            <ul>

            </ul>
        </div>
    );
};

export default CampaignList;
