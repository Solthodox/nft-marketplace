// SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EasyNFT is ERC20 {
    constructor() ERC20("EasyNFT", "ENFT") {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
