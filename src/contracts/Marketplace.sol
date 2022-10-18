// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is ERC721URIStorage, Ownable {
    // EVENTS
    event NewMarketItem(
        address indexed seller,
        address contractAddress,
        uint256 tokenId
    );
    event itemSold(uint256 marketItemId, address indexed buyer);
    error TransferError();

    //COUNTERS
    using Counters for Counters.Counter;
    Counters.Counter private _itemCount;
    Counters.Counter private _mintCount;

    // GLOBAL VARIABLES
    uint256 public constant MINTING_PRICE = 10**16;
    address public NATIVE_TOKEN;

    // DATA STORAGE
    mapping(uint256 => Offer[]) private _auctionBids;
    marketItem[] private _marketItems;

    /**
    @notice Restricts access to token owner
     */
    modifier ownsAsset(uint256 marketItemId) {
        address seller = _marketItems[marketItemId - 1].seller;
        require(msg.sender == seller, "msg.sender!=seller");
        _;
    }

    constructor(address _nativeTokenAddress) ERC721("EasyNFT", "NFT") {
        NATIVE_TOKEN = _nativeTokenAddress;
    }

    // STRUCTS
    struct Offer {
        uint256 bid;
        address offeror;
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

    // Fetch all market items

    function getMarketItems() public view returns (marketItem[] memory) {
        return _marketItems;
    }

    /**
    @notice Put an NFT on sale
    @param tokenId: id of token to be sold
    @param price: price asked for it
    @param deadline: time offer expires
    */
    function newMarketItem(
        address contractAddress,
        uint256 tokenId,
        uint256 price,
        uint256 deadline
    ) external {
        require(
            IERC721(contractAddress).getApproved(tokenId) == address(this),
            "ERC721 not approved"
        );
        Counters.increment(_itemCount);
        _marketItems.push(
            marketItem(
                Counters.current(_itemCount),
                msg.sender,
                contractAddress,
                tokenId,
                price,
                false,
                deadline
            )
        );
        emit NewMarketItem(
            msg.sender,
            contractAddress,
            Counters.current(_itemCount)
        );
    }

    /**
    @notice Buy an item from the marketplace
    @param marketItemId: id of item to buy
     */
    function buy(uint256 marketItemId) external payable {
        marketItem memory item = _marketItems[marketItemId - 1];
        // require(block.timestamp >= item.deadline, "Expired");
        IERC20(NATIVE_TOKEN).transferFrom(msg.sender, item.seller, item.price);
        IERC721(item.contractAddress).safeTransferFrom(
            item.seller,
            msg.sender,
            item.tokenId
        );
        _marketItems[marketItemId - 1].sold = true;
        emit itemSold(marketItemId, msg.sender);
    }

    /**
    @notice Owner accepts offer for its market item
    @param marketItemId : if of the item to buy
    @param offerIndex: the index of the offer to accept
     */

    function closeAuction(uint256 marketItemId, uint256 offerIndex)
        external
        ownsAsset(marketItemId)
    {
        marketItem memory item = _marketItems[marketItemId - 1];
        Offer memory offer = _auctionBids[marketItemId][offerIndex];
        IERC721(item.contractAddress).safeTransferFrom(
            msg.sender,
            offer.offeror,
            item.tokenId
        );
        IERC20(NATIVE_TOKEN).transferFrom(
            offer.offeror,
            item.seller,
            offer.bid
        );
        emit itemSold(item.tokenId, offer.offeror);
    }

    /**
    @notice Function to make a new offer to a certain item
     */
    function bid(uint256 marketItemId, uint256 amount) external {
        require(
            IERC20(NATIVE_TOKEN).allowance(msg.sender, address(this)) >= amount,
            "Insufficient ERC20 allowance"
        );
        _auctionBids[marketItemId].push(Offer(amount, msg.sender));
    }

    /**
    @notice Fetch all the offers made to a certain item
     */
    function getBids(uint256 marketItemId)
        external
        view
        returns (Offer[] memory)
    {
        return _auctionBids[marketItemId];
    }

    /**
    @notice Function to create an NFT from the marketplace itself
     */

    function mint(string memory uri) external payable {
        require(msg.value >= MINTING_PRICE, "Must pay minting price");
        Counters.increment(_mintCount);
        _mint(msg.sender, Counters.current(_mintCount));
        _setTokenURI(Counters.current(_mintCount), uri);
    }
}
