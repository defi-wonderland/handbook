# Locator strategy

Choosing the right **locator strategy** is crucial for building reliable and maintainable end-to-end tests. This section outlines the recommended locator strategies, ordered by priority and aligned with best practices, to ensure your tests remain robust and expressive as your application evolves.

- Using `data-testid` (or any dedicated test attribute) as the primary locator strategy makes the tests more stable, easier to maintain and focused on test behavior rather that UI structure.
- Playwright encourages using semantic, resilient selectors that mirror how users interact with the UI, rather than relying on fragile or implementation-specific details like CSS classes or XPath.

In order of priority:

1. `data-testid` attributes ([getByTestId](https://playwright.dev/docs/api/class-page#page-get-by-test-id))
2. User-facing attributes recommended by Playwright:
    1. [getByRole](https://playwright.dev/docs/api/class-page#page-get-by-role)
    2. [getByText](https://playwright.dev/docs/api/class-page#page-get-by-text)
    3. [getByLabel](https://playwright.dev/docs/api/class-page#page-get-by-label)
    4. [getByPlaceholder](https://playwright.dev/docs/api/class-page#page-get-by-placeholder)
    5. [getByAltText](https://playwright.dev/docs/api/class-page#page-get-by-alt-text)
    6. [getByTitle](https://playwright.dev/docs/api/class-page#page-get-by-title)
3. Other locators ([page.locator](https://playwright.dev/docs/api/class-page#page-locator))
