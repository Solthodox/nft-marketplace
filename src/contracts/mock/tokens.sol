// SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;
import "@openzpepelin/contracts/token/ERC20/ERC20.sol";

contract A is ERC20 {
    constructor() ERC20("AA", "A") {}
}

contract B is ERC20 {
    constructor() ERC20("BB", "B") {}
}

contract C is ERC20 {
    constructor() ERC20("CC", "C") {}
}

contract D is ERC20 {
    constructor() ERC20("DD", "D") {}
}

contract E is ERC20 {
    constructor() ERC20("EE", "E") {}
}
