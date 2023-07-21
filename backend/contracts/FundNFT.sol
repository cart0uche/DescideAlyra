// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";

/**
 * @author  Hafid Saou
 * @title   FundNFT contract
 * @notice  This contract is used to mint NFTs for the Fundraising
 */

contract FundNFT is
    ERC721URIStorage,
    ERC721Enumerable,
    ERC721Pausable,
    Ownable
{
    //ENUM
    enum nftType {
        CLASSIC,
        PLUS,
        PREMIUM,
        VIP
    }

    // STRUCT
    struct nftConf {
        uint number;
        uint max;
        uint amount;
        uint weight;
        string label;
    }

    // VARIABLES
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    mapping(nftType => nftConf) nftConfs;


    constructor(
        string memory _tokenName,
        string memory _symbol,
        uint amountAsked        
    ) ERC721(_tokenName, _symbol) {

        // set max supply for each type of NFT
        nftConfs[nftType.CLASSIC].max = 40;
        nftConfs[nftType.PLUS].max = 10;
        nftConfs[nftType.PREMIUM].max = 4;
        nftConfs[nftType.VIP].max = 1;
        
        /*
            40 NFT CLASSIC : 1% -> 40%
            10 NFT PLUS : 3% -> 30%
            4 NFT PREMIUM : 5% -> 20%
            1 NFT VIP : 10% -> 10%
        */
        // set amount for each type of NFT
        // frontend will divise by 1000
        nftConfs[nftType.CLASSIC].amount = amountAsked * 10;
        nftConfs[nftType.PLUS].amount = amountAsked * 30;
        nftConfs[nftType.PREMIUM].amount = amountAsked * 50;
        nftConfs[nftType.VIP].amount = amountAsked * 100;

        nftConfs[nftType.CLASSIC].label = "CLASSIC";
        nftConfs[nftType.PLUS].label = "PLUS";
        nftConfs[nftType.PREMIUM].label = "PREMIUM";
        nftConfs[nftType.VIP].label = "VIP";

        nftConfs[nftType.CLASSIC].weight = 10;
        nftConfs[nftType.PLUS].weight = 25;
        nftConfs[nftType.PREMIUM].weight = 50;
        nftConfs[nftType.VIP].weight = 100;
    }

    /**
     * @notice  Get label of NFT type
     * @param   typeNFT  Type of NFT (0, 1, 2, 3)
     * @return  string  Label of NFT type
     */
    function labelTypeNFT(uint typeNFT) internal view returns (string memory) {
        return nftConfs[nftType(typeNFT)].label;
    }

    /**
     * @notice  Mint NFT for a project with a type of NFT (0, 1, 2, 3) and a price 
     * @param   to  Investor address
     * @param   amount  Amount paid by investor
     * @param   projectTitle  Project title used for NFT metadata
     * @param   projectImageUrl  Project image url used for NFT metadata
     * @param   typeNFT  Type of NFT (0, 1, 2, 3)
     */
    function safeMint(
        address to,
        uint amount,
       string memory projectTitle,
       string memory projectImageUrl,
       uint typeNFT
    ) external onlyOwner {
        // check that typeNft is correct
        require(
            typeNFT == uint(nftType.CLASSIC) ||
            typeNFT == uint(nftType.PLUS) ||
            typeNFT == uint(nftType.PREMIUM) ||
            typeNFT == uint(nftType.VIP),
            "NFT type not exist"
        );
        require(
            nftConfs[nftType(typeNFT)].number < nftConfs[nftType(typeNFT)].max,
            "Maximum supply reached"
        );
        require(amount * 1000 >= nftConfs[nftType(typeNFT)].amount, "Not enaugh paid");

        bytes memory uri = abi.encodePacked(
            '{',
                '"name": "', projectTitle, '",',
                '"image": "ipfs://', projectImageUrl, '",', // Ajout d'une virgule manquante
                '"attributes": [',
                    '{',
                        '"trait_type": "type", "value": "',  labelTypeNFT(typeNFT), '"',
                    '}', // Ajout d'une virgule manquante
                ']',
            '}'
        );

        string memory dataURI = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(uri)
            )
        );

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
         nftConfs[nftType(typeNFT)].number++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, dataURI);
      
    }
    
    /**
     * @notice  Before transfer NFT, check if it's possible
     * @param   from  Address of sender
     * @param   to  Address of receiver
     * @param   tokenId  Id of NFT
     * @param   batchSize  Number of NFT to transfer
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @notice   Get different prices of NFT
     * @dev     Have to devise price by 1000
     * @return  uint  Price of NFT CLASSIC
     * @return  uint  Price of NFT PLUS
     * @return  uint  Price of NFT PREMIUM
     * @return  uint  Price of NFT VIP
     */
    function getPrices() external view onlyOwner returns (uint, uint, uint, uint) {
        return (
            nftConfs[nftType.CLASSIC].amount,
            nftConfs[nftType.PLUS].amount,
            nftConfs[nftType.PREMIUM].amount,
            nftConfs[nftType.VIP].amount
        );
    }
    
    /**
     * @notice  Get number of NFT minted
     * @return  uint  Number of NFT CLASSIC minted
     * @return  uint  Number of NFT PLUS minted
     * @return  uint  Number of NFT PREMIUM minted
     * @return  uint  Number of NFT VIP minted
     */
    function getNumberNFTMinted() external view onlyOwner returns (uint, uint, uint, uint) {
        return (
            nftConfs[nftType.CLASSIC].number,
            nftConfs[nftType.PLUS].number,
            nftConfs[nftType.PREMIUM].number,
            nftConfs[nftType.VIP].number            
        );
    }

    /**
     * @notice  Get weight of NFT
     * @param   _type  Type of NFT (0, 1, 2, 3)
     * @return  uint  Weight of NFT
     */
    function getWeight(uint _type) external view onlyOwner  returns (uint) {
        return nftConfs[nftType(_type)].weight; 
    }

    // The following functions are overrides required by Solidity.

    /**
     * @notice  Burn NFT
     * @param   tokenId  Id of NFT
     */
    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    /**
     * @notice  Get token URI
     * @param   tokenId  Id of NFT
     * @return  string  Token URI
     */
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
