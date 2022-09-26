// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract Marketplace is ERC721, Ownable {
    event newMarketItem(address indexed seller, address contractAddress, uint256 tokenId);
    event itemSold(uint256 marketItemId, indexed address buyer);
    error TransferError();

    using Counters for Counters.Counter;
    Counters.Counter private _itemCount;
    Counters.Counter private _mintCount;
    
    uint256 public constant MINTING_PRICE = 1 * 10**16;
    mapping(uint256 => Offer[]) private _auctionBids;
    mapping (address=>uint256) private _ethBalances;
    marketItem[] private _marketItems;

    modifier ownsAsset(uint256 marketItemId){
        address seller = _marketItems[marketItemId -1]; 
        require(msg.sender==seller,"msg.sender!=seller");
        _;
    }

    constructor() ERC721URIStorage("EasyNFT", "NFT"){}

    struct Offer{
        address contractAddress;
        uint256 bid;
        address a;
    }

    struct marketItem {
        uint256 itemId;
        address seller;
        address contractAddress;
        uint256 tokenId;
        uint256 price;
        bool sold;
        uint256 deadline;
    }

    function newMarketItem(
        address contractAddress,
        uint256 tokenId,
        uint256 price,
        uint256 deadline
    ) external {
        require(IERC721.getApproved(msg.sender, address(this),tokenId),"ERC721 not approved");
        Counters.increment(_itemCount);
        _marketItems.push(marketItem(
            Counters.current(_itemCount),
            msg.sender,
            contractAddress,
            tokenId,
            price,
            false,
            deadline
        ));
        emit newMarketItem(msg.sender, contractAddress, Counters.current(_itemCount))
    }

    function buy(uint256 marketItemId) external payable {
        marketItem memory item = _marketItems[marketItemId -1];
        require(block.timestamp>=item.deadline);
        require(msg.value>=item.price);
        IERC721(item.contractAddress).safeTransferFrom(item.seller, msg.sender);
        _marketItems[marketItemId -1].sold = true;
        emit itemSold(uint256 marketItemId, msg.sender);
        

    }

    function closeAuction(uint256 marketItemId, address offeror) external ownsAsset(marketItemId){
        uint256 item = _marketItems[marketItemId -1];
        IERC721(item.contractAddress).safeTransferFrom(msg.sender, msg.sender, item.tokenId);

        
    }

    function bid(address tokenAddress,uint256 marketItemId, uint256 amount) external {
        require(IERC20(tokenAddress).allowance(msg.sender, address(this))>=amount,"Insufficient ERC20 allowance");
        _auctionBids[marketItemId].push(Offer(tokenAddress,amount, msg.sender));
        
    }

    function getBids(uint256 marketItemId) external view returns(Offer[] memory){
        return _auctionBids[marketItemId];
    }

    function mint(string memory uri) external payable {
        require(msg.value>=MINTING_PRICE,"Must pay minting price");
        Counters.increment(_mintCount);
        _mint(msg.sender, Counters.current(_mintCount));
        _setTokenURI(Counters.current(_mintCount), uri);

    }
}
