---
title: Project Lifecycle
sidebar_position: 1
---
# *Immutable code means we have one chance to get it right.*

Our project lifecycle systematically eliminates vulnerabilities at every stage. Each phase, from initial design to final deployment, adds a validation layer. **No assumption goes unverified, no edge case is unexplored.**

Users trust their assets to our code, and we take quality seriously. **Quality is paramount for us**, so we strive to exceed expectations in all aspects of our development process, including writing automated tests, creating comprehensive documentation, implementing effective monitoring systems, and more. Our development process is divided into:

## Idea Draft 🎨 

The foundation of every successful project lies in its initial conception. During this phase, we work closely with partners to understand the project's scope, requirements, and potential challenges. 

Firstly, our Partner Lead and Architect will create a diagram showing the overall project architecture and will estimate the needed time for completion, an estimation that will be further reviewed and specified during the Tech Design phase. By doing this, we can set the project up for success and ensure a smooth and efficient journey towards achieving our shared goals. 

Before proceeding, both parties must review and approve the Idea Draft. This document serves as our north star, ensuring alignment on objectives and expectations throughout the project's lifecycle.

Find the template: [Idea Draft](https://defi-wonderland.notion.site/idea-draft-template?pvs=4)

## Tech Design 📐 

Once the Idea Draft is approved, the Partner Lead, Team Lead and Architect will move on to the Tech Design. This document provides an overview of each contract, external function, and off-chain component, defining how every piece of functionality works and outlining a time estimate. To mitigate risks, we also break the project into smaller milestones—each with its own timeline and deliverables—to keep everyone aligned and help achieve the partner’s goals efficiently.

While the project is still being defined and refined, we begin preparing advanced tests by collecting invariants. This initial collection typically serves as a first draft, since multiple invariants may change during development. Additionally, a member of our internal security team reviews the Tech Design early to identify potential architectural issues before we proceed too far into development. Neither of these processes needs to block the start of development, but we aim to initiate them as soon as our on-chain security team has the necessary availability.

Before moving forward, the Tech Design must be signed by both parties. A Tech Design is valid when it considers all the new, modified or removed functionality in an easily understandable way. This document will explain and justify any added complexity to the system. Moreover, all partner comments will be adequately addressed and marked as resolved.

Find the template here: [Tech Design](https://defi-wonderland.notion.site/tech-design-template?pvs=4)

## Development 👩‍💻 

Wonderland development team is ready and eager to hit the ground running. Throughout the process, we stay in ongoing contact with our partners to ensure everything is on track and to share our progress along the way.

All our partners have a front-row seat to the action through a real-time view of all development tasks on our project management board.

We strive to follow strict [code quality and style guidelines](/development/solidity/coding-style.md) while accommodating our partner’s preferred coding style to the best of our capacity. We will also contribute with suggestions for code-base improvements, even if they exceed the project’s defined scope.

- **More than 100% test coverage:** All agreed test suites from the tech design must be completed. Sometimes, 100% coverage isn’t enough, so we include fuzzing, E2E edge cases, and invariant tests. Here’s an example: https://github.com/allo-protocol/allo-v2/tree/v2.1/test
- **Automated alerts & monitoring dashboards:** Every metric outlined in the tech design is tracked via a dashboard, for example, [Dune](https://dune.com/defi_wonderland/mev-bots) or [Grafana](https://snapshots.raintank.io/dashboard/snapshot/pdIYOBrhqixu0lpidVXH4dsEF1iwclMO?orgId=2). We’ll help set up any required infrastructure if needed, and alerts will be configured to speed up issue response times.
- **Code standards:** We use [custom Solhint rules](https://github.com/solhint-community/solhint-community) to ensure consistent code quality and accurate reviews. The code must comply with the standard linting and code-quality rules in the tech design.
- **Deployment scripts:** Automated deployment scripts ensure precise and reliable deployments to all required networks.
- **NatSpec & comprehensive documentation:** We help the partner’s team fully understand the code by writing [detailed NatSpec](https://github.com/defi-wonderland/hai-core/blob/dev/src/interfaces/ICollateralAuctionHouse.sol) and [documentation](https://docs.letsgethai.com/detailed/intro/hai.html).

**Completion requirements: Before moving forward, the latest revision of the code must be approved by our partner.**


## Advanced Testing Campaign 🧪 

As mentioned before, we take our work seriously. Testing at Wonderland is a continuous process that begins before the first line of code is written and extends throughout the entire development lifecycle. Our testing framework reflects years of experience in securing infrastructure.

During development, each Solidity developer is responsible for writing unit and integration tests. These tests aim to cover all major branches and paths of the logic, ensuring every segment of code works as intended. Meanwhile, integration tests validate how different parts of the system interact, often running on network forks to replicate real-world behavior. This *QA phase* ensures continuous monitoring and improvement of the protocol as it evolves.

Once development is complete, the project undergoes an internal review and more advanced testing, led by a specialized team. This team focuses on invariants, formal verification methods, and advanced fuzzing using tools like Echidna and Medusa. Detailed properties (documented in a `PROPERTIES.md` file) guide this phase to ensure nothing is missed. This step confirms that the system meets higher-level correctness standards and can handle unexpected scenarios—finalizing the testing process before the protocol moves into production.
For further reading on how we do testing, see [Testing Campaign Processes](/testing/campaign-processes.md) and [Unit and Integration Testing](/testing/unit-integration.md).

## Internal Reviews 🔍 

Millions of dollars rely on the security of on-chain code, and history proves even a single oversight can cause devastating losses. At Wonderland, we treat every codebase as critical infrastructure, reinforcing the mantra that security must be present at each phase of development—from ideation, design, and coding, right through to deployment and beyond. We prioritize security by having developers adopt a “break it” mentality in internal reviews, so any potential flaws are discovered before an external audit or public launch. This ensures we don’t lean solely on third-party auditors for final protection and keeps *lazy* code or testing from slipping through.

Our internal review process kicks in once development is finished and the code is *frozen.* A specialized Security Team (or developers who switch to an attacking mindset) meticulously examines the code for bugs, logic flaws, and opportunities to improve best practices and security. If critical issues are found, we conduct internal post-mortems to learn how they went unnoticed, then immediately fix and recheck before delivering the revised code to external auditors. This multi-layered approach—coupled with thoughtful fix management, code-based complexity estimates, and thorough post-review analysis—helps us produce robust and resilient protocols.

For complete details, refer to [Internal Reviews](/security/internal-reviews.md).

Every fix is checked by the testing and security team.


## QA 👀 

Quality is a shared responsibility among all team members, but we have a dedicated QA team because testing independence is important to ensure an unbiased evaluation of the software to be delivered.

Our test planning approach is flexible, depending on the context and on the specific project needs, aiming to make the test execution fast while having good coverage and traceability between requirements and detected bugs. 

Manual testing is performed according to pre-defined processes and documentation, including test planning, analysis, design, execution, and reporting, ensuring thorough validation and verification against the requirements. QA is also supported by automated e2e tests to increase speed and reliability in regression testing.

We apply:

- Testing techniques to make our tests more effective and efficient. We save time while identifying all possible scenarios (including edge cases) thus ensuring no critical functionality is overlooked.
- Out-of-the-box thinking to go beyond basic functionality checks and contribute in creating robust, user-friendly, and high-quality dApps.
- User perspective to test dApps as end-users would, identifying areas where the user experience can be enhanced.

## Emergency Response 🚨 

The Emergency Plan provides a step-by-step guide for handling emergencies (e.g., exploits, active hacks). Partners can immediately report an incident by using the form available in their Partner page on our Notion. The plan also includes a ready-to-use Discord template —https://discord.new/aPnYUdJM6mkc or https://discord.new/CkADqy5aWsAH— for quickly creating a **War Room** where trusted members can coordinate actions in real time.

Once the War Room is set up, a checklist ensures every critical step is covered:

- Assign key roles such as Operations, Strategy Lead, etc
- Gather transaction info
- Identify affected addresses
- Enact short-term measures, like pausing contracts or disabling parts of the frontend

Parallel actions—web changes, external communication, and protocol fixes—run alongside each other, tracked in the war room. Afterward, teams document all findings, transactions, timelines, attacker data, to wrap up the incident, create necessary post-mortem reports, and plan any future improvements.

<div style={{textAlign: "center"}}>
  <img src="/img/project-lifecycle-meme.png" alt="project-lifecycle" width={600} />
</div>
