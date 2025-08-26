# Risk-based testing

Risk-based testing (RBT) is a testing strategy that prioritizes testing efforts according to the level of risk associated with different parts of a system. Risk is assessed by considering the likelihood of defects and the impact those defects could have if they occur, so testing efforts can be focused on the most critical areas.

|  | Low likelihood | Medium likelihood | High likelihood |
| --- | --- | --- | --- |
| High impact | Medium risk | High risk | High risk |
| Medium impact | Low risk | Medium risk | High risk |
| Low impact | Low risk | Low risk | Medium risk |

## **Software Testing Risk Matrix Example**

| Requirement | Risk description | Likelihood | Impact | Risk level |
| --- | --- | --- | --- | --- |
| Sign transactions | Private key or seed phrase gets logged by app or exposed via UI | Medium | High | High |
| Show estimated gas fees | Incorrect gas fee shown leads to failed or expensive transactions | Low | High | Medium |
| UI design | Typos in UI text | Medium | Low | Low |
