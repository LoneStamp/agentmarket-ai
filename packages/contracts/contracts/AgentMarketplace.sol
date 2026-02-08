// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AgentMarketplace
 * @dev Decentralized marketplace for AI agents
 */
contract AgentMarketplace is Ownable, ReentrancyGuard {
    
    struct Agent {
        address owner;
        string metadata; // JSON metadata (name, description, type, etc.)
        uint256 price;
        uint256 earnings;
        bool active;
        uint256 totalSales;
        uint256 rating; // Rating out of 100
        uint256 ratingCount;
    }
    
    uint256 public agentCount;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerAgents;
    
    address public treasuryAddress;
    address public buybackAddress;
    
    // Revenue split percentages (out of 100)
    uint256 public constant CREATOR_SHARE = 70;
    uint256 public constant BUYBACK_SHARE = 20;
    uint256 public constant TREASURY_SHARE = 10;
    
    event AgentRegistered(uint256 indexed id, address indexed owner, uint256 price);
    event AgentPurchased(uint256 indexed id, address indexed buyer, uint256 amount);
    event EarningsWithdrawn(address indexed owner, uint256 amount);
    event AgentToggled(uint256 indexed id, bool active);
    event AgentRated(uint256 indexed id, uint256 rating);
    event PriceUpdated(uint256 indexed id, uint256 newPrice);
    
    constructor(address _treasury, address _buyback) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury address");
        require(_buyback != address(0), "Invalid buyback address");
        treasuryAddress = _treasury;
        buybackAddress = _buyback;
    }
    
    /**
     * @dev Register a new AI agent
     */
    function registerAgent(string calldata metadata, uint256 price) external returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        require(bytes(metadata).length > 0, "Metadata cannot be empty");
        
        uint256 agentId = agentCount;
        
        agents[agentId] = Agent({
            owner: msg.sender,
            metadata: metadata,
            price: price,
            earnings: 0,
            active: true,
            totalSales: 0,
            rating: 0,
            ratingCount: 0
        });
        
        ownerAgents[msg.sender].push(agentId);
        agentCount++;
        
        emit AgentRegistered(agentId, msg.sender, price);
        return agentId;
    }
    
    /**
     * @dev Purchase agent service
     */
    function payAgent(uint256 id) external payable nonReentrant {
        require(id < agentCount, "Agent does not exist");
        Agent storage agent = agents[id];
        
        require(agent.active, "Agent not active");
        require(msg.value >= agent.price, "Insufficient payment");
        
        // Calculate splits
        uint256 creatorAmount = (msg.value * CREATOR_SHARE) / 100;
        uint256 buybackAmount = (msg.value * BUYBACK_SHARE) / 100;
        uint256 treasuryAmount = msg.value - creatorAmount - buybackAmount;
        
        // Update agent earnings and stats
        agent.earnings += creatorAmount;
        agent.totalSales++;
        
        // Transfer funds
        payable(buybackAddress).transfer(buybackAmount);
        payable(treasuryAddress).transfer(treasuryAmount);
        
        emit AgentPurchased(id, msg.sender, msg.value);
        
        // Refund excess payment
        if (msg.value > agent.price) {
            payable(msg.sender).transfer(msg.value - agent.price);
        }
    }
    
    /**
     * @dev Withdraw earnings
     */
    function withdrawEarnings(uint256 id) external nonReentrant {
        require(id < agentCount, "Agent does not exist");
        Agent storage agent = agents[id];
        require(agent.owner == msg.sender, "Not the agent owner");
        
        uint256 amount = agent.earnings;
        require(amount > 0, "No earnings to withdraw");
        
        agent.earnings = 0;
        payable(msg.sender).transfer(amount);
        
        emit EarningsWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Toggle agent active status
     */
    function toggleAgent(uint256 id) external {
        require(id < agentCount, "Agent does not exist");
        require(agents[id].owner == msg.sender, "Not the agent owner");
        
        agents[id].active = !agents[id].active;
        emit AgentToggled(id, agents[id].active);
    }
    
    /**
     * @dev Update agent price
     */
    function updatePrice(uint256 id, uint256 newPrice) external {
        require(id < agentCount, "Agent does not exist");
        require(agents[id].owner == msg.sender, "Not the agent owner");
        require(newPrice > 0, "Price must be greater than 0");
        
        agents[id].price = newPrice;
        emit PriceUpdated(id, newPrice);
    }
    
    /**
     * @dev Rate an agent
     */
    function rateAgent(uint256 id, uint256 rating) external {
        require(id < agentCount, "Agent does not exist");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        
        Agent storage agent = agents[id];
        
        // Calculate new average rating (stored as rating * 20 to get 0-100 scale)
        uint256 newRatingSum = (agent.rating * agent.ratingCount) + (rating * 20);
        agent.ratingCount++;
        agent.rating = newRatingSum / agent.ratingCount;
        
        emit AgentRated(id, rating);
    }
    
    /**
     * @dev Get all agents owned by an address
     */
    function getOwnerAgents(address owner) external view returns (uint256[] memory) {
        return ownerAgents[owner];
    }
    
    /**
     * @dev Get agent details
     */
    function getAgent(uint256 id) external view returns (
        address owner,
        string memory metadata,
        uint256 price,
        uint256 earnings,
        bool active,
        uint256 totalSales,
        uint256 rating
    ) {
        require(id < agentCount, "Agent does not exist");
        Agent memory agent = agents[id];
        return (
            agent.owner,
            agent.metadata,
            agent.price,
            agent.earnings,
            agent.active,
            agent.totalSales,
            agent.rating
        );
    }
    
    /**
     * @dev Update treasury address (owner only)
     */
    function updateTreasuryAddress(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid address");
        treasuryAddress = newTreasury;
    }
    
    /**
     * @dev Update buyback address (owner only)
     */
    function updateBuybackAddress(address newBuyback) external onlyOwner {
        require(newBuyback != address(0), "Invalid address");
        buybackAddress = newBuyback;
    }
}
