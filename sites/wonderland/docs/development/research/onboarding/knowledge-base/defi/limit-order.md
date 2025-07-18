---
id: limit-order
title: Limit Order Books
description: Understanding the mechanics and importance of limit order books in financial markets
sidebar_label: Limit Order Books
---

# Limit Order Books

Limit order books serve as the foundation of modern financial markets, enabling buyers and sellers to interact in a structured manner. While financial professionals may find the concept intuitive, many people, including retail investors, lack a clear understanding of how order books facilitate trading.

This article aims to provide an overview of limit order books, from basic concepts to advanced mechanics. It also introduces some key terminology and market behaviours. Apart from that, we encourage you to read the resources at the end of the article.

## The Role of Markets

A functional market requires both buyers and sellers. Whether at a farmers' market or a stock exchange, transactions occur when both parties agree on a price. Financial exchanges consolidate all trading activity in a centralized location, enabling two fundamental processes:

1. **Liquidity Provision**
2. **Price Discovery**

### Liquidity

Liquidity refers to how easily an asset can be bought or sold without significantly affecting its price.

For example, during the PlayStation 5 shortage, the limited supply (low liquidity) caused prices to rise as demand exceeded availability. Similarly, in financial markets, a stock with low liquidity can experience drastic price fluctuations when traders buy or sell in large quantities.

From a seller's perspective, liquidity is crucial as well. If there are too few buyers, the seller may need to reduce prices to attract demand. Highly liquid markets ensure price stability and efficient trading.

### Price Discovery

Price discovery is the process by which an asset's market price is determined.

Consider a customer at a market looking to buy tomatoes. To find the best deal, they compare prices from different vendors. Similarly, in financial markets, price discovery occurs as buyers and sellers place orders at varying prices, leading to a consensus price.

An ideal market structure ensures that all participants have equal access to price information, reducing **information asymmetry**, where one side has an advantage over the other. Limit order books help achieve this transparency.

## Structure of a Limit Order Book

A limit order book compiles all buy and sell orders for a given security. Each order typically consists of:

- **Side:** Buy or Sell
- **Quantity:** Number of units to be traded
- **Limit Price:** Maximum price a buyer is willing to pay or minimum price a seller is willing to accept
- **Submission Time:** The time at which the order was placed

### **Bid and Ask Orders**

Orders are categorized into two groups:

- **Bid Orders (Buy Side):** Represent buyers and are sorted from the highest to the lowest price.
- **Ask Orders (Sell Side):** Represent sellers and are sorted from the lowest to the highest price.

A market participant placing a **buy limit order at \$150 for 1,000 shares** will wait until a seller is willing to trade at that price. Meanwhile, a seller placing a **sell limit order at \$152 for 2,000 shares** will wait for a buyer at that price.

### **Tick Size and Lot Size**

- **Tick Size:** The minimum price increment between order levels (e.g., \$0.01 or \$0.10).
- **Lot Size:** The minimum number of units required per order (e.g., 100 shares per lot).

These constraints ensure uniformity in order placement.

### **Order Book Visualization**

Order books are displayed in different formats, such as:

1. **Vertical View (Ladder Format):** Orders are arranged from highest to lowest prices.
2. **Side-by-Side View:** Buy and sell orders are displayed separately, with the best prices at the top.

A typical order book example can be:

| Price Level | Bid Quantity | Ask Quantity |
| --- | --- | --- |
| 152 |  | 2000 |
| 151 |  | 1500 |
| 150 | 1000 |  |
| 149 | 1800 |  |

In this case, the **best bid** (highest buy order) is 150, and the **best ask** (lowest sell order) is 151. The difference between these two prices is called the **bid-ask spread**.

## **Order Matching and Execution**

### **Price/Time Priority**

Orders in the book are ranked using **price/time priority**:

1. Orders at better prices have higher priority.
2. If multiple orders exist at the same price, the earliest one is prioritized.

For example:

| Order ID | Side | Price Level | Quantity | Submission Time |
| --- | --- | --- | --- | --- |
| A | Buy | 150 | 500 | 10:00:05 |
| B | Buy | 150 | 1000 | 10:00:10 |

Order A has higher priority over Order B because it was placed earlier.

### **Types of Orders**

We will find different types of orders, such as:

1. **Limit Orders:**
    - Define a maximum (buy) or minimum (sell) price.
    - Can be **passive** (resting in the book) or **aggressive** (executing immediately).
2. **Market Orders:**
    - Execute immediately at the best available price.
    - May experience **slippage** if liquidity is low.
3. **Stop Orders:**
    - Become active once a trigger price is reached.
    - Commonly used for risk management (e.g., stop-loss orders).

### **Trade Execution Example**

Consider an order book with the following levels:

| Price Level | Bid Quantity | Ask Quantity |
| --- | --- | --- |
| 151 |  | 1500 |
| 150 | 1000 |  |

If a **market buy order** for 2000 shares is placed:

- 1500 shares executed at 151 USD
- 500 shares execute at 152 USD —next available price
- The average execution price (VWAP) is:

[(1500 x 151) + (500 x 152)] / 2000 

## **Market Participants and Trading Strategies**

### **Liquidity Providers and Market Makers**

- **Market Makers:** Continuously place bid and ask orders to facilitate liquidity.
- **Liquidity Takers:** Execute trades against existing orders, removing liquidity.

Market makers earn profits by capturing the **bid-ask spread**.

### **Order Visibility**

- **Hidden Orders:** Do not appear in public order books but execute normally.
- **Iceberg Orders:** Display only a small portion of the total order to prevent price manipulation.

### **Auctions in Traditional Markets**

Stock exchanges conduct **opening and closing auctions** to establish fair prices when markets open or close. During auctions:

- Orders accumulate but do not execute immediately.
- A theoretical **Indicative Equilibrium Price (IEP)** is calculated.
- The book **"uncrosses"**, matching orders at a single opening price.

For example:

| Price Level | Bid Quantity | Ask Quantity |
| --- | --- | --- |
| 103 | 1200 | 1500 |
| 102 | 1800 |  |

An auction might determine the open price as 103, maximizing traded volume. 

## **Market Data and Depth Analysis**

### **Levels of Market Data**

- **Level 1 (L1):** Shows only the best bid and ask prices.
- **Level 2 (L2):** Displays aggregated quantities at multiple price levels.
- **Level 3 (L3):** Provides full details of individual orders at each level.

### **Market Impact and Depth Charts**

Large market orders can **move prices** due to insufficient liquidity. Traders analyze **depth charts** to assess liquidity:

- **Thicker books (higher depth):** More liquidity, less price impact.
- **Thinner books (lower depth):** Higher volatility and price slippage.

# Resources

https://www.machow.ski/posts/2021-07-18-introduction-to-limit-order-books/

https://arxiv.org/html/2402.17359v1