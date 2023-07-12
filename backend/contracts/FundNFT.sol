// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract FundNFT is
    ERC721URIStorage,
    ERC721Enumerable,
    ERC721Pausable,
    Ownable
{
    // EVENT
    event fundNFTMinted(address _from, uint _tokenId, uint nftType);

    // ajouter un mapping pour savoir qui a minté quoi ?

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
    }

    // VARIABLES
    uint256 public constant MAX_SUPPLY = 75;
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
        nftConfs[nftType.PLUS].max = 30;
        nftConfs[nftType.PREMIUM].max = 4;
        nftConfs[nftType.VIP].max = 1;

        // set amount
        /*
            40 NFT CLASSIC : 1%
            30 NFT PLUS : 2.5%
            4 NFT PREMIUM : 5%
            1 NFT VIP : 10%
        */
        // frontend will divise by 1000
        nftConfs[nftType.CLASSIC].amount = amountAsked * 10;
        nftConfs[nftType.PLUS].amount = amountAsked * 25;
        nftConfs[nftType.PREMIUM].amount = amountAsked * 50;
        nftConfs[nftType.VIP].amount = amountAsked * 100;
    }

    modifier checkSupply(nftType _type, uint _amount) {
        require(
            nftConfs[_type].number < nftConfs[_type].max,
            "Maximum supply reached"
        );
        require(_amount * 1000 >= nftConfs[_type].amount, "Not enaugh paid");
        _;
    }

    function safeMintClassic(
        address to,
        uint amount,
       string memory uri
    ) public onlyOwner checkSupply(nftType.CLASSIC, amount) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
         nftConfs[nftType.CLASSIC].number++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit fundNFTMinted(to, tokenId, uint(nftType.CLASSIC));
    }

    function safeMintPlus(
        address to,
        uint amount,
        string memory uri
    ) public onlyOwner checkSupply(nftType.PLUS, amount) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        nftConfs[nftType.PLUS].number++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit fundNFTMinted(to, tokenId, uint(nftType.PLUS));
    }

    function safeMintPremium(
        address to,
        uint amount,
        string memory uri
    ) public onlyOwner checkSupply(nftType.PREMIUM, amount) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        nftConfs[nftType.PREMIUM].number++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit fundNFTMinted(to, tokenId, uint(nftType.PREMIUM));
    }

    function safeMintVIP(
        address to,
        uint amount,
        string memory uri
    ) public onlyOwner checkSupply(nftType.VIP, amount) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        nftConfs[nftType.VIP].number++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit fundNFTMinted(to, tokenId, uint(nftType.VIP));
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @notice  .Get different prices of NFT
     * @dev     .Have to devise price with 100
     */
    function getPrices() external view returns (uint, uint, uint, uint) {
        return (
            nftConfs[nftType.CLASSIC].amount,
            nftConfs[nftType.PLUS].amount,
            nftConfs[nftType.PREMIUM].amount,
            nftConfs[nftType.VIP].amount
        );
    }
    
    function getNumberNFTMinted() external view returns (uint, uint, uint, uint) {
        return (
            nftConfs[nftType.CLASSIC].number,
            nftConfs[nftType.PLUS].number,
            nftConfs[nftType.PREMIUM].number,
            nftConfs[nftType.VIP].number
        );
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

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
