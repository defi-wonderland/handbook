# Note selection algorithm

When you decide to withdraw funds from a privacy pool, your wallet faces a crucial decision. Which of your private [notes](./notes.md) should it use to fund it? Picking them randomly or simply using the oldest ones can leak information and compromise your privacy. The Note Selection Algorithm is designed to solve this problem. It intelligently selects a combination of notes to protect your onchain privacy above all else.

This algorithm works in conjunction with the **[batch withdrawal](./batch-withdrawal.md)** mechanism, which allows spending multiple notes in a single transaction.

This is fundamentally a difficult balancing act. Formally, it's a c**onstrained multi objective combinatorial optimization** problem. It's **combinatorial** because for each note, we make a discrete choice to either use it or not. It's **constrained** because the chosen notes must sum up to the required withdrawal amount and it's **multi objective** because we must balance competing goals like maximizing privacy, minimizing transaction cost, and maintaining the future health of the wallet.

Since finding a perfect solution is computationally infeasible, our algorithm uses an heuristic. To understand why a perfect solution is out of reach, imagine your wallet holds 20 different notes. For any withdrawal, you could use any combination of those notes. The number of possible combinations is $2^{20}$, which is over a million. A modern wallet could easily hold more notes, and the number of combinations grows exponentially. It is impossible to check every single one in real time. This is why we must use an intelligent shortcut. It generates several candidate solutions, scores them against a set of privacy principles and selects the one that offers the best possible balance.

### Hiding in the crowd, the anonymity set

The core of our privacy model is the **anonymity set**. This is the crowd of other users in the pool you can hide amongst. To make intelligent choices, we need a map of this crowd. The chart below is a representative visualization of the anonymity set's landscape. It plots different deposit amounts against the size of the crowd available at that specific value.

![Anonymity set](/img/diagrams/anonymity_set.png)

This chart immediately reveals a few key truths. A high anonymity set means your transaction is just one of many identical ones, making it difficult to trace. As you move toward the long tail of the distribution where the anonymity set shrinks, your transaction becomes an outlier, making it far easier to link.

The distribution is dominated by a massive peak at the standard **0.1 ETH** amount, which sits firmly in the **secure range**. This confirms that using common, standard amounts is critical for privacy. A "high-liquidity plateau" exists in this secure range, where the anonymity set remains high. An ideal withdrawal strategy will ensure all its outputs land within this zone to maximize privacy. As you move into the **medium secure range** and eventually the **insecure range**, the privacy guarantees decay rapidly.

### How the Heuristic Works

Because the problem is NP-hard, we use a **multistrategy greedy heuristic**. We run several simple note selection algorithms in parallel, each with a different bias, and then pick the best overall result.

First, the algorithm generates a small set of **candidate strategies**.

- The **Greedy Large** generator finds the single smallest note that can cover the entire withdrawal. This is optimized for low gas cost.
- The **Dust Aggregation** generator combines the user's smallest notes. This is good for cleaning up the wallet.
- The ***Sanitizer*** generator attempts to fund the withdrawal using only the user's "unhealthy" notes, breaking them down into standard sized bites. This improves the quality of assets in the wallet.
- The ***Anchor Sanitizer*** generator is a powerful hybrid strategy. It intelligently combines both healthy and unhealthy notes to find an optimal balance, sanitizing bad assets while preserving the best ones.

Next, each candidate strategy is scored against eight distinct objective functions that mathematically represent our privacy principles. Since the raw scores have different scales, we use **a normalization** to scale each score to a `[0, 1]` range. This normalization is dynamic, done on the fly relative to the candidate pool for that specific withdrawal.

Finally, the normalized scores are combined into a single `Score` using a weighted sum. The algorithm then deterministically chooses the candidate with the lowest final score.

The weights in this final calculation are tuned to reflect the model's core principles. The highest importance is given to functions that measure the onchain privacy footprint of the transaction. The next highest priority is assigned to functions that promote longterm wallet health, such as cleaning up bad notes and preserving good ones. Secondary factors like gas cost and note age serve as crucial tie breakers but do not override the primary mission of privacy and wallet health.

### A note selection example

The algorithm is built around a few core invariants that define a "good" withdrawal plan.

The highest priority is resisting the creation of identifiable **value patterns**. This means favoring withdrawal chunks that land in the most crowded parts of the anonymity set.

A less obvious but equally important principle is to actively improve the long term **wallet health**. The main idea is to always try to spend your 'unhealthiest' notes first, those with the smallest anonymity sets. By taking partial withdrawals or 'bites' from these bad notes, we can consolidate them into new, healthier notes with better privacy.

![Example note selection](/img/diagrams/example_note.png)

For example, imagine your wallet holds notes of `[1.0, 0.5, 0.4, 0.25, 0.15]` and you want to withdraw `0.6 ETH`. A naive strategy might just spend the 1.0 ETH note. Our *sanitizer heuristic*, however, might choose to take bites from the the four unhealthy notes, especially if they are the least private ones. This achieves the withdrawal while simultaneously cleaning up the wallet. A key feature that enables this is that a batch withdrawal can combine notes from many different source accounts, breaking the link that all inputs must originate from a single user identity.

Finally, while privacy is paramount, the algorithm also considers cost. It seeks to minimize the number of input notes to reduce transaction gas fees.

### A warning on behavior

Strong privacy requires your actions to blend in with the crowd. Our model incorporates **behavioral anonymity** by analyzing the historical patterns of all withdrawals from the pool.

By analyzing this data, we can define a threshold that marks a withdrawal amount as "statistically rare". Any request exceeding this value places the user in a small minority of the largest withdrawals ever made, making them a potential outlier.

If a user attempts to withdraw an amount greater than this calculated threshold, the wallet should display a prominent warning. It should explain that this action is highly unusual and could make their transaction more distinguishable, regardless of how well the input notes are selected. This empowers the user to make an informed decision about their behavioral footprint.