const Campaign = artifacts.require("Campaign");

module.exports = function (deployer) {
    // Example parameters, replace with actual values or variables
    const minimum = 100; // Example minimum contribution
    const creator = "0x1234567890123456789012345678901234567890"; // Example creator address
    const name = "Campaign Name";
    const description = "Campaign Description";
    const image = "https://example.com/image.jpg"; // Example image URL
    const target = 1000; // Example target amount

    deployer.deploy(Campaign, minimum, creator, name, description, image, target);
};
