# Solidity

## Part 1: Staking Reward Calculation

You are presented with a staking system where users stake tokens and receive rewards based on their stake and the time they remain staked. The key variables are:

- $R(u,a,b)$: Rewards for user $u$ between time $a$ and $b$.
- $L(t)$: Total staked tokens in the system at a time $t$.
- $I(u,t)$: Tokens staked by user $u$ at time $t$.

Rewards are distributed based on the proportion of tokens staked by each user, relative to the total staked amount over time. 

### The challenge

Given the following smart contract, analyze how the reward calculation problem is addressed. Specifically:

1. Explain the role of the key variables and functions in the contract.
2. Identify how the contract ensures accurate reward distribution over time, taking into account changes in staked amounts.
3. Discuss any edge cases or potential risks you find in the implementation.

Here is the contract:

```solidity
pragma solidity ^0.5.16;

import "openzeppelin-solidity-2.3.0/contracts/math/SafeMath.sol";
import "openzeppelin-solidity-2.3.0/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity-2.3.0/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity-2.3.0/contracts/utils/ReentrancyGuard.sol";

// Inheritance
import "./interfaces/IStakingRewards.sol";
import "./RewardsDistributionRecipient.sol";
import "./Pausable.sol";

contract StakingRewards is IStakingRewards, RewardsDistributionRecipient, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IERC20 public rewardsToken;
    IERC20 public stakingToken;
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public rewardsDuration = 7 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _owner,
        address _rewardsDistribution,
        address _rewardsToken,
        address _stakingToken
    ) public Owned(_owner) {
        rewardsToken = IERC20(_rewardsToken);
        stakingToken = IERC20(_stakingToken);
        rewardsDistribution = _rewardsDistribution;
    }

    /* ========== VIEWS ========== */

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable().sub(lastUpdateTime).mul(rewardRate).mul(1e18).div(_totalSupply)
            );
    }

    function earned(address account) public view returns (uint256) {
        return _balances[account].mul(rewardPerToken().sub(userRewardPerTokenPaid[account])).div(1e18).add(rewards[account]);
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(uint256 amount) external nonReentrant notPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function notifyRewardAmount(uint256 reward) external onlyRewardsDistribution updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward.div(rewardsDuration);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(rewardsDuration);
        }

        uint balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance.div(rewardsDuration), "Provided reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(rewardsDuration);
        emit RewardAdded(reward);
    }

    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        require(tokenAddress != address(stakingToken), "Cannot withdraw the staking token");
        IERC20(tokenAddress).safeTransfer(owner, tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    function setRewardsDuration(uint256 _rewardsDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "The previous rewards period must be complete before changing the duration for the new period"
        );
        rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(rewardsDuration);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);
}
```

### **What to Submit**

1. A detailed explanation addressing the three questions above.
2. Highlight any assumptions or observations you make while analyzing the contract.
3. Provide suggestions (if applicable) for improvements to the reward calculation logic.

## Part 2: Standing on the Shoulders of Giants

This section should emphasize **studying canonical contracts that shaped DeFi** and understanding how they influenced the ecosystem.

1. **Start with the [OpenZeppelin Library](https://www.openzeppelin.com/contracts)** documentation as the foundation.
2. Explore influential contracts:
   * [Synthetix Staking](https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol)
   * [UniswapV2 Pair](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol)
   * [Gnosis Safe Multisig](https://github.com/safe-global/safe-smart-account/tree/main/contracts)
   * [Sushi MasterChef](https://github.com/sushiswap/sushiswap/blob/archieve/canary/contracts/MasterChef.sol)

The main idea is for you to:

* Clone the repositories of these protocols.
* Explore their codebases, focusing on the **specific contracts** highlighted above.
* Be able to explain **why they are implemented this way** and **how they work**.
* Produce notes and deliver a **short (live) presentation on one contract of your choice**.

### Core Concepts to Understand

* [**ERC-4626**](https://erc4626.info/) (Vault standard)
* [**EIP-1559**](https://eips.ethereum.org/EIPS/eip-1559) (Ethereum fee market change)
* [**ERC-4337**](https://www.erc4337.io/) (Account abstraction)
* Opcodes: **[CREATE, CREATE2, CREATE3,](https://blog.solichain.com/the-ultimate-guide-to-create-create2-and-create3-cc6fe71c6d40) [CREATEX](https://github.com/pcaversaccio/createx?tab=readme-ov-file)**

## Part 3: Batch Swapper (Assignment)

Build a batch swapper contract that aggregates many users’ deposits of an ERC20 token, performs a single swap for the entire batch, and lets depositors withdraw their share of the output token. The goal is to practice safe ERC20 accounting, access control, and defensive Solidity design while keeping the mechanics simple.

Create a swapper contract that will collect deposits, swap them all at once and allow depositors to withdraw their token.

Why would this be useful? Let's say swapping DAI to WETH costs around 10 and making an ERC20 transfer costs 20. If I would have friends, and my "friends" would want to exchange DAI to ETH as well, a way to save some money would be transferring our DAI to one person that we all trust, he/she would make the swap, and then transfer the respective ETH to each one of us.

This contract aims to allow this functionality while removing the trust assumption in a person. For example, many people would be able to provide DAI, then one single good person (will improve this later) would call a swap function and make the swap for everyone. After this, each person would be able to withdraw their respective ETH.

### Definition of Done

- Has a `fromToken` and a `toToken` property that can be both set in the constructor.

- Has a `provide(amount)` function that will take the amount of the `fromToken` from the function caller.

- Has a swap function that will exchange all provided tokens into the `toToken`

- Has a withdraw function that allows the user that provided the tokens to withdraw the toTokens that he should be allowed to withdraw.

` Make sure the user can withdraw their `fromToken` before in case they were not yet swapped

- Governor (deployer) will need to provide `toToken` liquidity

- Include unit and integration tests

For the sake of simplicity: We can assume a 1 to 1 relationship between `fromToken` and `toToken`. Also there should be enough unit tests and the swap function should be integration tested with a fork of mainnet. Check the [solidity onboarding knowledge base](https://handbook.wonderland.xyz/docs/development/solidity/onboarding/knowledge-base).

### **How to Submit Your Work**
- Commit your work to your assigned **GitHub repository** with clear, incremental commits. See [Git Practices](/docs/processes/github/git-practices.md).
- Include a README with design choices and exact commands to run unit and fork tests.
- Ensure the repo is self-contained for reviewers to run tests end-to-end.

## 🍀 Good luck!