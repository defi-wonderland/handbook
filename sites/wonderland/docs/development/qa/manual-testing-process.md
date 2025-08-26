# Manual testing process

As testing is always context-dependent and Web3 development tends to have relatively short lifecycles, we use an easy-to-implement and flexible approach.

## 1. Test analysis

Read and analyze all available documents that serves as the **test basis** (business process flows, functional specifications, technical designs, user interface mock-ups, user stories, use cases) to gain a comprehensive understanding of the project and to get the **test conditions**. These are specific aspects or functionalities that can be verified by test cases; they represent what we want to verify through testing.

## 2. Test design

Create a testing charter listing all the test conditions along with their corresponding test cases. This approach combines **scripted and exploratory testing**, providing guidelines for manual testing and a balanced coverage. It provides an efficient use of time, avoiding the need to write very detailed step-by-step test cases. It also ensures all planned requirements are checked and also helps uncover unexpected issues, edge cases, or usability flaws.

Here is a [testing charter template](https://www.notion.so/Testing-charter-template-2459a4c092c7801baa24d9f00becd801?pvs=21) that defines the purpose, scope, and focus areas of a specific testing session, ensuring testers remain aligned on objectives while encouraging creativity and critical thinking.

## 3. Test prioritization and execution

Apply **test case prioritization** to decide which tests should be executed first. This prioritization should be based on factors like risk, business value, impact of failure, frequency of use, or other aspects that are considered important. In addition, straightforward flows through a feature (where everything works as expected with valid actions and inputs) should always be executed first. Only once these **happy paths** are passed with no bugs found, it’s time to proceed with **negative and destructive testing**.

## 4. Providing evidence

All tests should include their respective **evidence** (screenshots, videos, transaction links) for both passed and failed cases, including those executed during exploratory testing sessions.

## 5. Covering possible coverage gaps

To support test coverage we use a [list of common test checks for dApps](https://www.notion.so/Common-test-checks-for-dApps-1fb9a4c092c780e7bb00cfdc14aee633?pvs=21), to identify possible missing aspects. It should be completed as much as possible, excluding any items that do not apply to the project.

## 6. Bug reporting

Raise complete **bug reports** to ensure that bugs can be understood, reproduced, and fixed efficiently by the development team, thus saving time. For this purpose we use a complete and concise bug report template in Linear. Each report should include details such as: test environment (app version, OS, browser, wallet), the test case/testing session in which the bug was found, steps to reproduce, expected result, actual result and supporting evidence.

## 7. Traceability

**Traceability** between bugs and test conditions is essential for maintaining control over the testing process. It allows us to track the origin, impact, and coverage of each issue, ensuring that they are properly understood, resolved, and verified through retesting. It also contributes to better quality control and accountability in the testing process. For example, if many bugs originate from a single test condition, it may indicate a complex or high-risk area where testing efforts should be concentrated.

Here is a [traceability table template](https://www.notion.so/Traceability-table-template-2459a4c092c780dd8518cd59d8b7a595?pvs=21) that can be used to ensure clear alignment between requirements, test conditions, test cases, and defects throughout the software testing lifecycle.
