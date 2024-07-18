import { ethers } from "ethers";
import CampaignFactory from "./build/contracts/CampaignFactory.json";
import Campaign from "./build/contracts/Campaign.json";

// Reusable function to connect to MetaMask
async function connectToMetaMask() {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return { provider, signer };
    } else {
        throw new Error("MetaMask is not installed.");
    }
}

// Function to interact with CampaignFactory and Campaign contracts
async function addCampaign() {
    const { provider, signer } = await connectToMetaMask();

    // CampaignFactory contract address
    const factoryAddress = "YOUR_FACTORY_CONTRACT_ADDRESS";
    const factoryAbi = CampaignFactory.abi;

    const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, signer);

    // Create a new campaign
    const tx = await factoryContract.createCampaign(
        ethers.utils.parseUnits("0.1", "ether"), // minimum contribution
        "My Campaign", // name
        "This is a test campaign", // description
        "https://example.com/image.jpg", // image URL
        ethers.utils.parseUnits("10", "ether") // target amount
    );
    await tx.wait();

    // Get the deployed campaigns
    const deployedCampaigns = await factoryContract.getDeployedCampaigns();
    console.log("Deployed Campaigns:", deployedCampaigns);

    // Interact with a specific campaign
    const campaignAddress = deployedCampaigns[0]; // Replace with the desired campaign address
    const campaignAbi = Campaign.abi;

    const campaignContract = new ethers.Contract(campaignAddress, campaignAbi, signer);

    // Get campaign summary
    const summary = await campaignContract.getSummary();
    console.log("Campaign Summary:", summary);

    // Contribute to the campaign
    const contributeTx = await campaignContract.contribute({
        value: ethers.utils.parseUnits("0.2", "ether")
    });
    await contributeTx.wait();

    // Create a spending request (as manager)
    const createRequestTx = await campaignContract.createRequest(
        "Buy supplies",
        ethers.utils.parseUnits("1", "ether"),
        "0xRecipientAddress"
    );
    await createRequestTx.wait();

    // Approve a spending request (as contributor)
    const requestIndex = 0; // Replace with the actual request index
    const approveRequestTx = await campaignContract.approveRequest(requestIndex);
    await approveRequestTx.wait();

    // Finalize a spending request (as manager)
    const finalizeRequestTx = await campaignContract.finalizeRequest(requestIndex);
    await finalizeRequestTx.wait();
}

// Execute the main function
export { connectToMetaMask, addCampaign }
