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
        uint requestId;
        uint creationTime;
        uint amountAsked;
        bool isAccepted;
        string description;
        FundStatus status;
        uint projectId;
        Vote vote;
    }

    FundRequest[] private fundRequests;

    mapping(uint => mapping(address => uint)) public investorsVoteWeight;
    mapping(uint => mapping(address => bool)) public investorsVotes;

    constructor() {
    }

    function addDao( uint projectId,
        uint requestId,
        uint amount,
        string memory description) public{
        FundRequest memory fundRequest;
        fundRequest.requestId = requestId;
        fundRequest.creationTime = block.timestamp;
        fundRequest.amountAsked = amount;
        fundRequest.isAccepted = false;
        fundRequest.description = description;
        fundRequest.status = FundStatus.inProgress;
        fundRequest.projectId = projectId;

        fundRequests.push(fundRequest);
    }

    function getFundRequestDetails(uint requestId) public view returns(uint, uint256, string memory, uint256, bool, uint){
         require(
            requestId < fundRequests.length,
            "Fund request id dont exist"
        );
        return (
            fundRequests[requestId].projectId,
            fundRequests[requestId].amountAsked,
            fundRequests[requestId].description,
            fundRequests[requestId].creationTime,
            fundRequests[requestId].isAccepted,
            uint (fundRequests[requestId].status))    
        ;
    }


        // create a function for voting for a fund request
    function voteForFundRequest(
        uint requestId,
        bool vote
    ) external payable {
        require(
            requestId < fundRequests.length,
            "Fund request id dont exist"
        );
        require(
            fundRequests[requestId].status ==
                FundStatus.inProgress,
            "Fund request is not in progress"
        );
        require(
            fundRequests[requestId].isAccepted == false,
            "Fund request is already accepted"
        );
  
        require(
            investorsVotes[requestId][msg.sender] == false,
            "You already vote for this fund request"
        );

        if(vote == false){
            fundRequests[requestId].vote.no++;
        } else {
            fundRequests[requestId].vote.yes++;
        }

        investorsVotes[requestId][msg.sender] = true;
    }   

    function addInvestorVoteWeight(uint projectId, address investor, uint weight) external {
        investorsVoteWeight[projectId][investor] += weight;
    } 
}