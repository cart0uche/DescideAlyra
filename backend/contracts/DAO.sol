// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;
import "hardhat/console.sol";

/**
 * @author  Hafid Saou
 * @title   DAO contract
 * @notice  This contract is used to manage DAO
 */
contract DAO {

    struct Vote {
        uint yes;
        uint no;
        uint yesWeight;
        uint noWeight;
        uint totalVoters;
        uint voted;
        bool isAccepted;
    }

    enum FundStatus {
        inProgress,
        closed,
        claimed
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

    address private factoryAddress;
    FundRequest[] private fundRequests;

    mapping(uint => mapping(address => uint)) private investorsVoteWeight;
    mapping(uint => uint) private totalVoteWeight;
    mapping(uint => mapping(address => bool)) private investorsVotes;
    mapping(uint => uint) private investorByProject;

    constructor() {
    }

    function setFactoryAddress(address _factoryAddress) external {
        factoryAddress = _factoryAddress;
    }

    modifier onlyFactory() {
        require(
            msg.sender ==
                factoryAddress,
            "Caller is not factory"
        );
        _;
    }

    /**
     * @notice  Add a DAO
     * @param   projectId  Project identifier.
     * @param   requestId  Request identifier.
     * @param   amount  Amount asked.
     * @param   description  Description of the request.
     */
    function addDao( uint projectId,
        uint requestId,
        uint amount,
        string memory description) external onlyFactory{
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

    /**
     * @notice   Get the request details
     * @param   requestId  Request identifier.
     */
    function getFundRequestDetails(uint requestId) public view onlyFactory returns(uint, uint256, string memory, uint256, bool, uint){
         require(
            requestId < fundRequests.length,
            "Id dont exist"
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

    
    /**
     * @notice  Vote for a fund request
     * @param   requestId  Request identifier.
     * @param   projectId  Project identifier.
     * @param   vote  Vote (true or false)
     * @param   investor  Address of the investor.
     */
    function voteForFundRequest(
        uint requestId,
        uint projectId,
        bool vote,
        address investor
    ) external payable onlyFactory{
        require(
            requestId < fundRequests.length,
            "Id dont exist"
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
            investorsVotes[requestId][investor] == false,
            "You already vote for this fund request"
        );

        require(block.timestamp < fundRequests[requestId].creationTime + 30 days, "Fund request is expired");
 
        fundRequests[requestId].vote.voted ++;
        if(vote == false){
            fundRequests[requestId].vote.no++;
            fundRequests[requestId].vote.noWeight += investorsVoteWeight[projectId][investor];
        } else {
            fundRequests[requestId].vote.yes++;
            fundRequests[requestId].vote.yesWeight += investorsVoteWeight[projectId][investor];
        }

        investorsVotes[requestId][investor] = true;
    }   

    /**
     * @notice  Add a vote weight for an investor
     * @param   projectId  Project identifier.
     * @param   investor  Address of the investor.
     * @param   weight  Weight of the vote.
     */
    function addInvestorVoteWeight(uint projectId, address investor, uint weight) external onlyFactory{
        // count the number of investor for a project
        if(investorsVoteWeight[projectId][investor] == 0)
        {
            investorByProject[projectId] ++;
        }  
        investorsVoteWeight[projectId][investor] += weight;
        totalVoteWeight[projectId] += weight;
      
    } 

    /**
     * @notice  Close a fund request
     * @param   requestId  Request identifier.
     */
    function closeFundRequest(uint requestId) external onlyFactory returns(uint, bool){
        require(
            requestId < fundRequests.length,
            "Id dont exist"
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

        if (totalVoteWeight[fundRequests[requestId].projectId] != 0){
            if (100 * fundRequests[requestId].vote.yesWeight / totalVoteWeight[fundRequests[requestId].projectId] > 80){
                fundRequests[requestId].isAccepted = true;
            } else {
                fundRequests[requestId].isAccepted = false;
            }
        } else {

            fundRequests[requestId].isAccepted = false;
        }       

        fundRequests[requestId].status = FundStatus.closed;

        return (fundRequests[requestId].amountAsked, fundRequests[requestId].isAccepted);
    }

    
    /**
     * @notice  Get the vote result
     * @param   requestId  Request identifier.
     */
    function getVoteResult(uint requestId) external view onlyFactory returns(Vote memory){
        require(
            requestId < fundRequests.length,
            "Id dont exist"
        );
        Vote memory vote = fundRequests[requestId].vote;
        vote.totalVoters = investorByProject[fundRequests[requestId].projectId];
        vote.isAccepted = fundRequests[requestId].isAccepted;
        return (vote);
    }

    /**
     * @notice  Determine if a researcher can claim funds
     * @param   requestId  Request identifier.
     */
    function shouldClaimFunds(uint requestId) external view onlyFactory returns(uint) {
        require(
            requestId < fundRequests.length,
            "Id dont exist"
        );
        require(
            fundRequests[requestId].status ==
                FundStatus.closed,
            "Fund request is not closed"
        );
        require(
            fundRequests[requestId].isAccepted == true,
            "Fund request is not accepted"
        );

        return fundRequests[requestId].amountAsked;
    }

    
    /**
     * @notice  Claim funds
     * @param   requestId  Request identifier.
     */
    function claimFunds(uint requestId) external onlyFactory {
        require(
            requestId < fundRequests.length,
            "Id dont exist"
        );
        require(
            fundRequests[requestId].status ==
                FundStatus.closed,
            "Fund request is not closed"
        );
        require(
            fundRequests[requestId].isAccepted == true,
            "Fund request is not accepted"
        );

        fundRequests[requestId].status = FundStatus.claimed;
    }   
}