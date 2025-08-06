# Best Practices

This guide outlines our best practices for frontend development. It covers code quality standards, GitHub workflows, and security measures to help us build robust, maintainable, and secure frontend applications.

<div align="center">
  <img src="/img/frontend-meme.jpg" width="900" alt="A panda developer frustrated with code, then realising the importance of following best practices" />
</div>

We've all been there: staring at confusing code and wondering "why?". That's exactly why we maintain these best practices. They help turn those "why???" moments into "aha!" moments by providing clear, consistent patterns and guidelines for our codebase.

## Code Quality

### Avoid Logic in the Render Section of React Components

Complex logic should be abstracted into functions or methods declared before the return statement, keeping the render section clean and focused on UI rendering.

**Why it's Important:** Separating complex logic improves code readability and maintainability, adhering to the principle of separating concerns. This practice also facilitates easier testing and debugging of logic independently from UI rendering.

**Bad:**

```jsx
return (
  <div>
    <button
      onClick={() => {
        const value = someFunction();
        if (value === "a") {
          doSomething();
        } else {
          doSomethingElse();
        }
      }}
    >
      Click Me
    </button>
  </div>
);
```

**Good:**

```jsx
const handleButtonClick = () => {
  const value = someFunction();
  if (value === "a") {
    doSomething();
  } else {
    doSomethingElse();
  }
};

return (
  <div>
    <button onClick={handleButtonClick}>Click Me</button>
  </div>
);
```

### Structured Import Order

1. React imports should be listed first, comprising components from the React library.
2. Library imports follow, encompassing third-party dependencies.
3. Internal component or file imports are placed last.

**Why it's Important:** Maintaining a consistent import order enhances code readability and organization. It establishes a clear hierarchy, facilitating easier navigation and identification of dependencies for developers.

**Bad:**

```jsx
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import React from "react";
```

**Good:**

```jsx
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import SearchBar from "../components/SearchBar";
```

### Avoid Ternary Conditionals in React Components

Ternary conditionals (`condition ? trueValue : falseValue`) can sometimes complicate JSX code readability, particularly when used extensively. In React components, it's preferable to use the logical AND (`&&`) operator for improved clarity.

**Why it's Important:** Using the logical AND (`&&`) operator for conditional rendering simplifies code structure and aids comprehension, particularly for new developers joining the project.

**Bad:**

```jsx
return (
  <div>
    {isLoggedIn ? (
      <button onClick={logout}>Logout</button>
    ) : (
      <button onClick={login}>Login</button>
    )}
  </div>
);
```

**Good:**

```jsx
return (
  <div>
    {isLoggedIn && <button onClick={logout}>Logout</button>}
    {!isLoggedIn && <button onClick={login}>Login</button>}
  </div>
);
```

### Avoid Inline Styles in React Components

Define styles separately using external stylesheets or CSS-in-JS libraries for better maintainability and separation of concerns.

**Why it's Important:** Inline styles clutter JSX and complicate maintenance, especially with complex or dynamic styling. Separating styles improves organization, reusability, and collaboration among developers.

**Bad:**

```jsx
return (
  <div>
    <button
      style={{ backgroundColor: "blue", color: "white", borderRadius: "5px" }}
    >
      Click Me
    </button>
  </div>
);
```

**Good:**

Using CSS

```jsx
// In a separate CSS file or CSS-in-JS solution
.button {
  background-color: blue;
  color: white;
  border-radius: 5px;
}

// In the component file
import React from 'react';
import './Button.css'; // Import external CSS file

const Button = () => {
  return (
    <div>
      <button className="button">
        Click Me
      </button>
    </div>
  );
};

export default Button;
```

Or using **[`styled()`](https://mui.com/system/styled/)** utility from MUI:

```jsx
import { styled } from "@mui/material/styles";

const Button = () => {
  return (
    <div>
      <StyledButton>Click Me</StyledButton>
    </div>
  );
};

const StyledButton = styled("button")({
  backgroundColor: "blue",
  color: "white",
  borderRadius: "5px",
});

export default Button;
```

Alternatively, if you only need a button:

```jsx
import { styled } from "@mui/material/styles";

const Button = styled("button")({
  backgroundColor: "blue",
  color: "white",
  borderRadius: "5px",
});

export default Button;
```

:::tip
Depending on the chosen component (in this case, a button), it will function similarly to using a button, inheriting all its properties.
:::

### Use [**`theme`**](https://mui.com/system/experimental-api/css-theme-variables/#usage) property and dark/light mode from the MUI context

When implementing colors from a theme, it's essential to use the defined theme variables rather than hard-coding colour values in hexadecimal (hex) or RGB format. This approach ensures that your components automatically adapt to theme changes, such as switching between light and dark modes, by relying on the project's color palette.

This promotes greater consistency across the project.

Here's an example to illustrate this concept:

**Bad:**

```jsx
import { styled } from "@mui/material/styles";

const BadButton = styled("button")({
  backgroundColor: "#ff5733", // BAD: Hardcoded HEX color
  color: "#fff",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
});
```

**Good:**

In this example, the button's background color is set using a theme variable, allowing it to adapt to theme changes:

```jsx
import { styled } from "@mui/material/styles";

const GoodButton = styled("button")(({ theme }) => ({
  backgroundColor: theme.palette.secondaryBackground.default, // GOOD: Uses theme variable
  color: theme.palette.text.primary,
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "4px",
}));
```

Thanks to this approach, when you apply **dark or light mode**, your components will work "out of the box". They will automatically adjust to the theme's color settings without requiring additional changes, ensuring a seamless and consistent user experience.

### Use Appropriate Break Lines in React Components

Incorporating strategic line breaks in React components enhances readability, especially for complex structures.

**Why it's Important:** Clear and organized code boosts developer productivity and reduces error rates. Line breaks provide visual cues, aiding developers in understanding the component's structure and flow.

**Bad:**

```jsx
return (
  <div>
    <SomeComponent />
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <AnotherComponent />
  </div>
);
```

**Good:**

```jsx
return (
  <div>
    <SomeComponent />

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <AnotherComponent />
  </div>
);
```

### Lock Dependencies and Remove Carets in package.json

Lock dependencies and specify exact versions to ensure consistent and secure dependency management.

**Why it's Important:** These practices offer several benefits:

- **Consistent Builds:** Locking dependencies maintains uniformity across development environments.
- **Security:** Removing carets and specifying exact versions mitigates the risk of installing vulnerable packages.
- **Stability:** Exact version control minimizes unexpected changes, ensuring application stability.

### 1.8. Image Optimization

Optimize images to keep them under 250kB for faster website performance.

**Why it's Important:** Image optimization reduces bandwidth usage and enhances website performance, crucial for various devices and network conditions.

**Example Tool**: [Squoosh](https://squoosh.app/) is an online tool that optimizes images while preserving quality.

## GitHub Workflows

### Pull Request Reviews

We've established specific requirements for PR reviews:

1. **Merge to Dev:**
   - **Approval Requirement:** 2
   - **Merge Method:** Squash and merge.
   - **Comments Resolution:** Resolve all comments or conversations before merging.
2. **Merge to Main:**
   - **Approval Requirement:** 2
   - **Merge Method:** Merge and commit.

> 💡 To request a review, tag @UI Devs in the UI Discord channel along with the PR link and a brief description.

**Why it's Important:** PR reviews uphold project standards, maintain code quality, and prevent bugs or regressions. Following specific requirements for approvals and merge methods ensures consistency and reliability in our codebase.

### Implement Standardized GitHub Actions

Every project repository should include standardized GitHub Actions workflows for automating common development tasks like building, testing, linting, and deployment.

**Why it's Important:** Standardizing GitHub Actions streamlines development and maintains code quality.

**Example**: https://github.com/defi-wonderland/web3-react-boilerplate

### Keep Pull Requests Concise

Pull requests should be kept concise to facilitate efficient code review. Focus on specific changes or features to ensure thorough review by team members.

**Why it's Important:** Large PRs overwhelm reviewers and increase the risk of missed issues. Concise PRs enable better understanding, meaningful feedback, and improved code quality before merging.

**Tips for Keeping PRs Concise:**

1. **Break Down Changes:** Divide tasks into smaller, focused PRs.
2. **Focus:** Each PR should handle one feature, bug fix, or improvement.
3. **Reviewable Units:** Aim for PRs reviewable within an hour.
4. **Communication:** Discuss PR scope with the team to agree on size and focus.

## Security Measures

### Private Key Protection

Integrate private key checkers to ensure sensitive information such as API keys remains secure and confidential. Check: https://github.com/defi-wonderland/crypto-husky-checks

**Why it's Important:** Private key checkers safeguard against potential security breaches by preventing inadvertent exposure of sensitive data.

### Vercel Password Protection

Add password protection to all Vercel deployments to secure development and staging environments.

**Why it's Important:** Password protection prevents unauthorized access to in-development features and sensitive data in non-production environments.

### Environment Variable Security

Mark all environment variables as sensitive in deployment platforms to prevent exposure in logs and error reports.

**Why it's Important:** Properly securing environment variables prevents accidental leakage of credentials, API keys, and other sensitive configuration data.

### Selective Vercel Authentication (Optional)

Configure Vercel authentication settings to allow specific team members access to preview deployments when needed.

**Why it's Important:** Balancing security with collaboration needs ensures team members can access previews for testing while maintaining appropriate access controls.
