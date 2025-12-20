# Design Patterns for Automation

Design patterns for automation help organize test code in a way that promotes reusability, readability, and separation of concerns, while providing a solid architectural foundation for test suites, especially as projects grow in complexity and/or scale.

By applying design patterns, teams can:

- Avoid code duplication and reduce maintenance overhead.
- Improve clarity and collaboration between QA and development teams.
- Simplify onboarding of new contributors.
- Adapt quickly to UI or business logic changes.

> ℹ️ The examples in this section use Playwright with JavaScript and TypeScript.

## AAA (Arrange-Act-Assert)

Every test is divided into three parts:

- Arrange steps: Setup for the test. These steps could be in a before hook or within the test script.
- Act steps: Where actions are performed.
- Assert steps: Assertions against expected results.

> ⚠️ Test scripts structured as “Arrange-Act-Assert-Act-Assert” or “Arrange-Assert-Act-Assert” follow an anti-pattern because subsequent actions and assertions should be in separate tests. It’s important that each test focuses on a specific, independent, and individual behavior.

We don’t need to assert default states if the main objective of the test is to validate something else. For example:

**❌ Bad:**

```tsx
test('changes origin chain', async ({ page }) => {
  // ARRANGE - Visit the homepage
  await page.goto('/op-mainnet');
  // ASSERT - Verify initial origin chain selection
  await expect(page.getByTestId('from-chain-selector')).toHaveText(mainnet.name);
  // ACT - Change the origin chain
  await page.getByTestId('from-chain-selector').click();
  await page.getByTestId(`chain-${base.id}`).click();
  // ASSERT - Verify the change
  await expect(page.getByTestId('from-chain-selector')).toHaveText(base.name);
});
```

**✅ Good:**

```tsx
test('default origin chain should be mainnet', async ({ page }) => {
  // ARRANGE and ACT - Visit the homepage
  await page.goto('/op-mainnet');
  // ASSERT - Verify initial origin chain selection
  await expect(page.getByTestId('from-chain-selector')).toHaveText(mainnet.name);
});

test('should change origin chain', async ({ page }) => {
  // ARRANGE - Visit the homepage
  await page.goto('/op-mainnet');
  // ACT - Change the origin chain
  await page.getByTestId('from-chain-selector').click();
  await page.getByTestId(`chain-${base.id}`).click();
  // ASSERT - Verify that the change occurred
  await expect(page.getByTestId('from-chain-selector')).toHaveText(base.name);
});
```

## POM (Page Object Model)

It’s a widely adopted design pattern in test automation. Its main objective is to separate the test logic from the UI code, resulting in cleaner and more maintainable code, and improving reusability by centralizing all page element locators and related actions in one place.

Example of POM pattern:

File `example-page.ts` inside `test → pages` folder

```tsx
export class ExamplePage {
  readonly page: Page;
  readonly switchChainBtn: Locator;
  readonly fromChainSelector: Locator;
  readonly toChainSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    this.switchChainBtn = page.getByTestId('switch-chains-button');
    this.fromChainSelector = page.getByTestId('from-chain-selector');
    this.toChainSelector = page.getByTestId('to-chain-selector');
  }

  async switchChain() {
    await this.switchChainBtn.click();
  }

  async changeChains(fromChainName: string, toChainName: string) {
    await this.fromChainSelector.click();
    await this.page.locator('li', { hasText: fromChainName }).click();
    await this.toChainSelector.click();
    await this.page.locator('li', { hasText: toChainName }).click();
  }
}
```

Use in test spec within `test`folder:

```tsx
import ExamplePage from '../pages/example-page';

test.describe('example test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should change chains', async ({ page }) => {
    const examplePage = new ExamplePage(page);
    // test arragement here
    await examplePage.changeChains('Fraxtal', 'Zora');
    // assertions here
  });
});
```

### Drawbacks of POM

- When most locators are robust data-test attributes, the improvement POM pattern offers is minimized.
- May introduce additional layers of abstraction, potentially slowing down test execution and increasing complexity for smaller projects.
- May increase maintenance effort.
- Playwright: POM can be implemented within custom fixtures to avoid instantiating pages in every test, though this still requires pages maintenance.

> ⚠️ These drawbacks highlight the importance of evaluating project size, complexity, and requirements before adopting Page Object Model.
