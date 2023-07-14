// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;
import "hardhat/console.sol";

contract DAO {

    struct Vote {
        uint yes;
        uint no;
    }

    enum FundStatus {
        inProgress,
        ended
    }

    struct FundRequest {
        uint id;
        uint creationTime;
        uint amountAsked;
        bool isAccepted;
        string description;
        FundStatus status;
        uint projectId;
        Vote vote;
    }

    FundRequest[] private fundRequests;

    constructor() {
    }

    function addDao( uint projectId,
        uint requestId,
        uint amount,
        string memory description) public{
        FundRequest memory fundRequest;
        fundRequest.id = requestId;
        fundRequest.creationTime = block.timestamp;
        fundRequest.amountAsked = amount;
        fundRequest.isAccepted = false;
        fundRequest.description = description;
        fundRequest.status = FundStatus.inProgress;
        fundRequest.projectId = projectId;

        fundRequests.push(fundRequest);
    }

    function getFundRequestDetails(uint requestId) public view returns(uint, uint256, string memory, uint256, bool, uint){
        return (
            fundRequests[requestId].projectId,
            fundRequests[requestId].amountAsked,
            fundRequests[requestId].description,
            fundRequests[requestId].creationTime,
            fundRequests[requestId].isAccepted,
            uint (fundRequests[requestId].status))    
        ;
    }

/*
        // create a function for voting for a fund request
    function voteForFundRequest(
        uint fundRequestId,
        uint vote
    ) external payable {
        require(
            fundRequestId < fundRequestLists.length,
            "Fund request id dont exist"
        );
        require(
            fundRequestLists[fundRequestId].status ==
                FundStatus.inProgress,
            "Fund request is not in progress"
        );
        require(
            fundRequestLists[fundRequestId].isAccepted == false,
            "Fund request is already accepted"
        );
        require(
           vote == 0 || vote == 1,
            "Vote should be 0 or 1"            
        );
        require(
            FundNFT(researchProjects[fundRequestLists[fundRequestId].projectId].fundNFT).balanceOf(msg.sender) > 0,
            "You need to buy NFT to vote"
        );
        require(
            investorsVotes[fundRequestId][msg.sender] == false,
            "You already vote for this fund request"
        );
        // check if investor buy NFT


        fundRequestLists[fundRequestId].isAccepted = true;
        researchProjects[fundRequestLists[fundRequestId].projectId]
            .status = ResearchProjectStatus.ended;
        fundRequestLists[fundRequestId].status = FundStatus.ended;

    }

    */
}