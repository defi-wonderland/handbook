# Internal Reviews 

## Why you should do them

Millions upon millions of dollars flow across the code we write. Millions upon millions may sit in the code we write. In other words, **millions upon millions are entrusted to our code**. 

In the tumultuous chasm of the day to day this aspect may be lost, or it may fade into the back of the mind where it can shrink and disperse and lose its weight. In fact, stowing it away in a nook where it can be forgotten is enough to become lazy. After all, what harm can a lazy pull request review do? What harm can a lazy test do? What harm can implementing something I’m too lazy to understand in-depth do?

In the end, auditors will catch it if there’s any issue, right?

Right?

If you are reading this, you are probably a part of the ecosystem, and you are well aware of how devastating a single bug can be, and how easily it can slip by multiple sets of eyes. Even skilled eyes. Immunefi exists for a reason and complex systems can lead to extremely complex bugs.

But if you happen to be reading while being new to the ecosystem know that [billions have been stolen](https://hacked.slowmist.io/). Billions. Let that sink in.

If you allow us to make one last point before getting to the point, we want to emphasize the open source aspect of the code we write. Everyone can see the logic of our code and anyone can spot a bug if it’s present. Bad actors are aplenty. Some, state-sponsored. There’s no room for error. There’s no room to be lazy.

Critical code should be treated with as much care and thought as possible.

**Critical code should be written with security at its core.**

This last statement is why we are writing this, and why you are reading it. If we were to divide the lifecycle of the creation of a project, we may roughly divide it like this:

- Ideation
- Refinement
- Technical design
- Development
- External Audit
- Deployment

If you go back and reassess how you are currently tackling your projects, at which of those phases would you say security is a core feature?

Most will answer development and external audit. Some will add technical design to the answer. Of course external audit is a given. That’s fine, but the reality is that most projects partially care about security during the development and rarely do during the tech design. We say partially because pull request reviews rarely are as thorough as they should be, development is conditioned by deadlines and only a handful of developers are security freaks.

This is far from perfect, it’s even far from great. This puts an insane amount of responsibility on the external audit because the code delivered to them is not as good as it could be. Suddenly you are relying the success of your protocol, which took many months to build, to two or three people reading through it for two to three weeks without any context, and because the code presented was written to meet a deadline, the auditors find critical issues, and all of a sudden your developers have a lot of fixes to think through and implement.

So, how do you improve this?

Apart from the obvious answer of promoting and ensuring a security-first mindset at all stages of the creation of a project, the other answer is to add layers of protection. One of these layers can be to perform internal reviews. 

The idea is that after the development is done and before delivering the code to external auditors your developers—if you don’t have internal security members—perform a review of the code with the idea of breaking it. This is effective because the attacking mindset tends to be different from the building mindset. This also allows the reviewers to see the whole picture of the protocol, and not only the sections they worked on. This tends to lead to a code of a higher quality, with less bugs, and lower probability of being successfully attacked.

Not only that, but it eliminates a lot of issues auditors would have had to waste time finding and writing down in their reports, which can lead to them having more time to find more intricate bugs.

To close this section we want to focus on the economical value of this.

Deadlines exist. Money is not infinite. The perfect processes are common sense, but the reality of things is that perfect processes tend to take more time than protocols tend to have. However, when it comes to security, in this ecosystem, the potential cost of not caring about it is too large. 

Audits are expensive. If an audit returns critical findings that break the protocol, it may entail having to pay for a subsequent audit. Here you lost both time and money. **Moreover, if you deploy the protocol and someone exploits it, the cost is absolute**. The reputation of the protocol is ruined. Well the protocol itself is ruined, which means people will become unemployed and probably have a stain in their resume. But most importantly, the users lost their money.

We will close with a question:

**Is sparing a month or two of time to enhance security worth the reduced risk of being exploited?**

I hope you answered yes.

## Our Process

Before diving into Wonderland’s internal review process, we want to make a point to emphasize how serious it is for us to have as many ramparts as possible in order to avoid producing exploitable code.

Our internal reviews are treated as if the code we are reviewing is the code we are going to launch. When we do them, it doesn’t matter if an external audit is scheduled, we will review it and try to break it as if no external audit or extra layer of security existed. It’s of utmost importance for us that this process is not done lazily. It must be done with the intention to shred the protocol to pieces and shed light to as many issues as possible.

Moreover, if the external audit finds a critical issue, we write internal post-mortems for them as if the protocol we built was hacked. This allows us to reflect on why that bug made it into our code, which often reveals issues in our processes, and spotting flaws leads to improvements. 

Critical bugs are severe, even if they are caught before making it into production, and they should be treated with the utmost importance and never be ignored. 

If you are not learning from mistakes of this caliber, you are wasting an enormous opportunity to grow and improve.

With that being said, we now dive into our internal review process, first with a summary, and then we go in-depth.   

The process is as follows: after the code of a project developed by Wonderland is frozen, it enters the Internal Review phase. In this phase, it undergoes a thorough review by two or more members from Wonderland's Security Team. The people assigned will, for a variable period of time, try to find as many bugs and issues as they can, as well as point out improvements to the code, places where best practices were not followed, and so on. They will then pour everything that was found into a report for the team of Developers to assess and fix. After every fix is implemented, a new review round is completed by the Security Team to confirm the fixes. This continues until the code is deemed correct and no fixes / changes are necessary.

After this stage, the revised code is given to external auditors.

This ensures we produce the best quality code we can before we provide it to the external auditors. Polished code tends to be easier to audit, and with bugs stripped out, we remove low-hanging fruits that can waste external auditors’ time. This leads to a heavily reviewed and high quality final product.

### Effectiveness

The vast majority of our Internal Reviews have found multiple bugs of different severity. They have proven to be fantastic to improve the quality and safety of the products we deliver. If you are in doubt as to whether this is a good process to add to your company, try it. If you don’t have people focused exclusively in security, it can work as well since the security mindset is different from the development mindset. This means that the same people that built the protocol can still find issues in it if they switch to an attacking mindset.

### In-depth

Wonderland's Security Team is comprised of people who have been developing in the ecosystem for years, have completed our Internal Security Onboarding, and have shown interest and skill in securing code. However, because we always strive to have two or more people performing the internal reviews, and we build a multitude of projects at the same time, Internal Reviews can overlap and availability can be scarce.

For this reason, early coordination is crucial. As soon as the Tech Design for a given project is finished the Developer leading that project communicates with the Security Lead to provide rough estimations on the amount of code that will be produced, and when it will be frozen. An important note is that no code is written before the Tech Design is approved.

The Security Lead will then calculate how many days of review are required based on the estimated amount of code and its complexity, and reserve a tentative slot of time for that project's Internal Review. This is then added to the Tech Design after the end of the Development Phase in two new sections: Internal Review, and Review Fixes. This is important as it will help the Partner define when to book the external audit appointment.

Moreover, the Security Lead will inform the COO about the new Internal Review, and, at times, ask for certain members of the Security Team to join the review as they may have experience with similar protocols.

The COO will then confirm availability and assign that slot of time to the Reviewers.

All of this is tracked in an internal Notion that details the scheduled Internal Reviews to perform, with their start and end date, the lines of code and the complexity score of the protocol to review for easy lookup. This file also contains Report Templates for each Reviewer to complete while performing the review. Once the reports by the different Reviewers are completed, they are unified into a single one for the team of Developers to have an easier time digesting and tracking the findings. Lastly, there's a section that describes the issues found in the dynamics external to the code when performing the Internal Review so we can improve them in the future. These dynamics can be anything like miscalculations in the days required to review the code, slow communication between Reviewers and Developers, last minute changes and so on.

We strive for the Internal Review process to be as good as possible, as it's crucial in determining the quality of the code we produce.

**And our aim is to always deliver the best code we can produce.**

### Estimation Calculation

Our current method of calculation is far from fancy, but it errs on the side of safety: We establish a base number of lines of code a Reviewer can check in a day, and then lower or increase it depending on the complexity of the protocol. Let's follow this example:

- Protocol complexity: Medium
- Number of source lines of code in scope: 3000
- Expected Pace: 170 lines of code a day
- Review Duration: 3000 / 170 = 18 days + 5 days for fixes + 4 days review of fixes.

If the code were to be complex, we would reduce the expected pace to 120 a day. If it were simple, we would raise it to 200 a day. This may sound slow, and it is, but that number comprises the more intangible aspects like performing tests to prove and probe bugs, understanding the interactions of the entire protocol, knowing those hundred lines won't be read once but many times to ensure proper grasp, and so on. It's a way of estimating pace and it should not be taken at face value. It's not like the Reviewer will read 170 lines of code and call it a day. 

Complexity is often tied to our knowledge of similar systems (or even the same system if we have performed previous reviews), the size of the codebase, or the familiarity with the concepts of language used. A protocol that utilizes heavy math or ZK will rank higher in the complexity scale than one that does simple staking.

In terms of review of fixes, this is often the hardest to estimate, but 1 day per 750 lines of code is what we go for. 

The fixes themselves are hard to estimate as we can't know how severe the findings will be until we find them, but a week tends to be a good starting point. This will then be adjusted once the Internal Review is done and the reports completed.

### Best Practices for Fixes

Fixes are a crucial aspect of the internal review. They have the job of mitigating bugs as well as not introducing new ones. Because of this, they should be treated with care, and following them should be as simple as possible for the internal reviewer.

The way we ensure this is by having the Developers of the project being reviewed:

- Create a branch where all the fixes will be applied
- Separate every fix in a separate commit, whose name should indicate what reported issue it’s fixing.
    - As an example, if the report found a Medium and called it [M-0] Wrong initialization in `someContract`, the commit should say: “fix: [M-0] changing initialization in someContract”

This allows the reviewers to quickly grasp the fix applied to an issue in isolation. However, the reviewer should review the fixes as a whole as well to ensure no combination of fixes introduced a new issue.