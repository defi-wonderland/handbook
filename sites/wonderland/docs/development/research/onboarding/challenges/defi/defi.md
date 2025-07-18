# DeFi

## Understanding Protocol Dynamics

This challenge consists of three stages, each focused on a key area of DeFi: interest rates in lending protocols, fee dynamics in AMMs, and AMM design comparisons. You’ll analyze, calculate and provide insights into how these protocols function and impact users.

## Stage 1: Interest Rate Analysis in Aave

As we discussed in the knowledge base, lending protocols use dynamic interest rates to balance supply and demand for liquidity. In this stage, your task is to analyze how changing interest rate parameters affect the system. The key parameters of this model include:

- **Base Variable Borrow Rate**: The minimum borrowing rate when utilization is low.
- **`Slope1`**: The rate of increase in borrowing costs as utilization approaches the optimal usage ratio.
- **`Slope2`**: The steep rate of increase when utilization exceeds the optimal usage ratio.
- **Optimal Usage Ratio**: The utilization threshold where borrowing costs transition from slope1 to slope2.

The [**`DefaultReserveInterestRateStrategyV2`**](https://aave.com/docs/developers/smart-contracts/interest-rate-strategy) contract defines how these parameters are applied to calculate interest rates dynamically.

### The Challenge

Using the provided Aave interest rate contract, analyze how changes to interest rate parameters impact the lending system. Specifically:

**Parameter Adjustments:**

- Scenario 1: Increase the `baseVariableBorrowRate` by 1%.
  - What happens to borrowing costs for low-utilisation levels?
- Scenario 2: Double the `variableRateSlope2`.
  - How does this impact borrowers and lenders when utilization exceeds the `optimalUsageRatio`?

**Impact Assessment:**

- Borrowers: How do the changes affect borrowing costs at different utilization levels?
- Lenders: What are the implications for liquidity provider yields (calculated through `currentLiquidityRate`)?
- Protocol: How does protocol revenue (collected fees) change under these scenarios?

**Technical Analysis:**

- **Review the contract** and explain how the following functions are used to calculate interest rates dynamically:
  - `calculateInterestRates`: Adjusts rates based on current liquidity and debt levels.
  - `getVariableRateSlope1` and `getVariableRateSlope2`: Retrieves the slope parameters for variable rates.
  - `getBaseVariableBorrowRate`: Provides the base borrowing cost.

**Deliverables:**

- A visual chart showing the interest rate curve before and after your changes.
- A concise write-up explaining the results of your analysis, including impacts on borrowers, lenders, and the protocol.

### Guidance

- **Read the Contract**: Focus on the `calculateInterestRates` function to understand how the protocol dynamically adjusts rates based on utilization. Pay attention to how `supplyUsageRatio` and `borrowUsageRatio` are calculated and used.
- **Define Assumptions**
  - Example values for `optimalUsageRatio`, `slope1`, and `slope2` can help anchor your analysis.
  - Assume realistic utilization rates (e.g., 50%, 80%, and 100%) to test your scenarios.

## Stage 2: Comparing AMMs — Uniswap V2 vs. Curve StableSwap

We already learned in [How an AMM works](https://handbook.wonderland.xyz/docs/development/research/onboarding/knowledge-base/defi/amm) that AMMs use different curve designs to optimize for specific use cases. The challenge in this stage is to compare the efficiency and behaviour of Uniswap V2 and Curve StableSwap for a stable pair (e.g USDC/DAI) by answering:

1. Swap cost comparison:
   1. Calculate the cost of swapping:
      1. 1000 of USDC/DAI
      2. 10000 of USDC/DAI
   2. Compare these costs on:
      1. Uni V2
      2. StableSwap
   3. Analyze the differences in slippage and swap efficiency for both protocols
2. Liquidity Efficiency:
   1. Analyze how liquidity is distributed along the curve in:
      1. Uniswap V2
      2. StableSwap
   2. Discuss which design is more efficient for stable pairs and why.
3. Scenario Analysis:
   1. Assume the trading volume increases significantly in both protocols. Explain how the behaviour of swap costs and efficiency changes as liquidity is added or removed in:
      1. Uni V2
      2. StableSwap

**Deliverables**

- Cost comparisons: Provide calculations showing the swap cost for $1000 and $10000 transactions in both protocols.
- Visuals: Craft a chart comparing the cost-slippage relationship in Uni V2 and Curve StableSwap
- Write a little report explaining the difference between the two designs.

## Stage 3: Understanding Concentrated Liquidity

The main improvement within UniswapV3 is that of higher capital efficiency via concentrated liquidity. The challenge in this stage is to understand the implications of this adjusted model in isolation (the curve itself) and on its main agents (liquidity providers, swappers).

### **1. Bonding Curve Construction:**

- **Understanding the Uniswap V3 Bonding Curve:**
  - The mathematical structure behind liquidity concentration.
  - How does price move along the curve when liquidity is highly concentrated?
- **Examples of LP Positions:**
  - Single-range position: An LP providing liquidity in a tight price range.
  - Multi-range position: LPs splitting capital across multiple price bands.
  - Wide-range position: LPs covering a broader price spectrum for passive strategies.
- **Aggregating LP Positions:**
  - How different LP positions interact to form the global liquidity curve.
  - Example calculations of how liquidity depth changes based on LP distributions.

### **2. Mathematical Implications:**

- **Price Curve Adjustments:**
  - How concentrated liquidity affects the swap price curve compared to V2.
  - Formula adjustments for slippage and price impact.
- **Capital Efficiency Improvements:**
  - Estimating how much capital is needed in V3 vs. V2 for similar depth.
  - Practical calculations of how liquidity concentration reduces slippage.
- **Napkin Math for Expected Swap Costs:**
  - Approximate trade cost differences between V3 and V2 for various trade sizes.

### **3. Scenario Analysis:**

- **Small vs. Large Trades:**
  - How V3 handles different trade sizes compared to V2.
  - Effect of concentrated liquidity when price approaches LP range limits.
- **Impact on LP Revenue:**
  - Differences in fee earnings for LPs in V3 vs. V2.
  - The tradeoff between higher capital efficiency and the need for active management.
- **Adaptation of Strategies:**
  - How arbitrageurs and market makers adjust their strategies in V3.
  - The potential for dynamic fee adjustments with Uniswap V3’s new features.

### **Deliverables:**

- **Comparison of V3 vs. V2 concentrated liquidity impacts.**
- **Mathematical breakdown of how liquidity depth affects price curves.**
- **Write-up analyzing the impact of Uniswap V3 design on traders and LPs.**
- **Examples of LP positions and methods for aggregating them.**

### **How to Submit Your Work**

- All work for your chosen challenge must be committed to the **GitHub repository** assigned to you during onboarding.
- Structure your commits clearly, with meaningful messages that outline the progress of your work. See [Git Practices](/docs/processes/github/git-practices.md) for reference.
- Ensure your final submission is well-organized, with supporting files, diagrams, or models included as needed.

### **Next Steps**

- Choose one of the above options and approach it with a mix of theoretical analysis, practical evaluation, and creative problem-solving.
- If you need guidance or clarification, reach out! 😊

# 🍀 Good luck!
