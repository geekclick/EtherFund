// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(
        uint256 minimum,
        string memory name,
        string memory description,
        string memory image,
        uint256 target
    ) public {
        address newCampaign = address(
            new Campaign(minimum, msg.sender, name, description, image, target)
        );
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    string public campaignName;
    string public campaignDescription;
    string public imageUrl;
    uint256 public targetToAchieve;
    address[] public contributors;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager, "Only manager can call this function.");
        _;
    }

    constructor(
        uint256 minimum,
        address creator,
        string memory name,
        string memory description,
        string memory image,
        uint256 target
    ) {
        manager = creator;
        minimumContribution = minimum;
        campaignName = name;
        campaignDescription = description;
        imageUrl = image;
        targetToAchieve = target;
    }

    function contribute() public payable {
        require(
            msg.value > minimumContribution,
            "Contribution must be greater than minimum."
        );

        contributors.push(msg.sender);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        require(
            approvers[msg.sender],
            "Must be an approver to approve requests."
        );
        require(
            !requests[index].approvals[msg.sender],
            "Cannot approve request twice."
        );

        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        require(
            requests[index].approvalCount > (approversCount / 2),
            "Must have more than 50% approvals."
        );
        require(!requests[index].complete, "Request must not be complete.");

        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string memory,
            string memory,
            string memory,
            uint256
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            campaignName,
            campaignDescription,
            imageUrl,
            targetToAchieve
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
