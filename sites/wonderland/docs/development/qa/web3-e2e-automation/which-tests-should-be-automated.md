# Decide which tests should be automated

Understanding **what to automate** (and what not to) is one of the most critical decisions in a test automation strategy. The main factors to consider for this decision are outlined below. For more details, watch the full talk [“Which Tests Should We Automate”](https://www.youtube.com/watch?v=VL-_pnICmGY&ab_channel=SauceLabs) by Angie Jones.

- **Risk:**
    - Probability (frequency of use by customer)
    - Impact (if broken, what’s the impact to users)
- **Value:**
    - Distinctness (does this test provide new info?)
    - Induction to action (how quickly would this failure be fixed?)
- **Cost-efficiency:**
    - Quickness (how quickly can the test be scripted?)
    - Ease (how easy will it be to script the test?)
- **History:**
    - Similar to weak areas (volume of historical failure in related areas)
    - Frequency of breaks (volume of historical failures for this test)
    