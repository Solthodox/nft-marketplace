// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
pragma solidity ^0.8.17;

contract Collection1 is ERC721URIStorage {
    uint256 public counter;

    constructor() ERC721("Collection1", "C1") {}

    function mint(string memory uri) public {
        counter++;
        _mint(msg.sender, counter);
        _setTokenURI(counter, uri);
    }
}
