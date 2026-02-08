export const MARKETPLACE_ABI = [
  "function agentCount() view returns (uint256)",
  "function agents(uint256) view returns (address owner, string metadata, uint256 price, uint256 earnings, bool active, uint256 totalSales, uint256 rating, uint256 ratingCount)",
  "function registerAgent(string calldata metadata, uint256 price) returns (uint256)",
  "function payAgent(uint256 id) payable",
  "function withdrawEarnings(uint256 id)",
  "function toggleAgent(uint256 id)",
  "function updatePrice(uint256 id, uint256 newPrice)",
  "function rateAgent(uint256 id, uint256 rating)",
  "function getOwnerAgents(address owner) view returns (uint256[])",
  "function getAgent(uint256 id) view returns (address, string, uint256, uint256, bool, uint256, uint256)",
  "event AgentRegistered(uint256 indexed id, address indexed owner, uint256 price)",
  "event AgentPurchased(uint256 indexed id, address indexed buyer, uint256 amount)",
  "event EarningsWithdrawn(address indexed owner, uint256 amount)"
] as const;

export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
] as const;

export const MARKETPLACE_ADDRESS = (process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '') as `0x${string}`;
export const TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '') as `0x${string}`;
