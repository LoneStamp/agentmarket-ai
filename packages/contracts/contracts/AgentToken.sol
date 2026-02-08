// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title AgentToken
 * @dev ERC20 token for AgentMarket AI platform
 */
contract AgentToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**18; // 1 Million tokens
    
    event TokensBurned(address indexed burner, uint256 amount);
    
    constructor() ERC20("AgentToken", "AGENT") Ownable(msg.sender) {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
    
    /**
     * @dev Burns tokens for buyback mechanism
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Allows owner to mint additional tokens if needed
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
