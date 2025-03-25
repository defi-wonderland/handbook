
# Best Practices

This document outlines the key principles, patterns, and practices for the Offchain department. It serves as a guide to ensure consistency, scalability, and maintainability in our projects, covering design patterns, architectural principles, TypeScript best practices, testing, scripting, and documentation standards.

By adhering to these guidelines, we ensure robust and modular development, fostering effective collaboration and streamlined workflows.

# Patterns

- Design Patterns:
    - **Factory**: Creates objects dynamically based on input or configuration without exposing the instantiation logic.
    - **Proxy**: Acts as a placeholder to control access, add caching, or optimize performance.
    - **Singleton**: Ensures a class has only one instance and provides a global point of access to it.

# **Principles**

- Over-abstraction leads to tighter coupling in the code; avoid it.
- Favor **composition over inheritance** to build reusable and flexible components.
- Use **dependency injection** to decouple components and facilitate testing.
- Follow **SOLID principles**:
    1. **Single Responsibility Principle**: A class should have one and only one reason to change.
    2. **Open/Closed Principle**: Software entities should be open for extension but closed for modification.
    3. **Liskov Substitution Principle**: Derived classes must be substitutable for their base classes.
    4. **Interface Segregation Principle**: Many specific interfaces are better than a single, general-purpose interface.
    5. **Dependency Inversion Principle**: Depend on abstractions, not concretions.

## **Architectural Patterns**

- **Read-Write Service Pattern**: Separate read and write responsibilities into distinct services to improve scalability and maintainability.
- **Database Per Service Pattern**: Each service owns its database to ensure loose coupling and avoid cross-service data dependencies.
- **API Gateway Pattern**: Use an API gateway as a single entry point for routing requests to multiple services, handling concerns like rate limiting, authentication, and caching.

# **TypeScript Best Practices**

### **1. Module Structure**

- Follow the [Internal Module Pattern](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de) to avoid circular dependencies:
    - Create an `external.ts` file to explicitly list exported components, types, and interfaces.
    - Import and re-export them in the entry `index.ts` file for easier access.

### **2. Asynchronous Initialization**

- Use **Static Async Factory Functions** for asynchronous constructors: https://dev.to/somedood/the-proper-way-to-write-async-constructors-in-javascript-1o8c

### **3. Runtime Type Checking**

- Validate environment variables at runtime using libraries like:
    - [Zod](https://zod.dev/)
    - [t3-env](https://github.com/t3-oss/t3-env)
    - [envalid](https://github.com/af/envalid).

### **4. Type Safety**

- Avoid the use of `any`; prefer `unknown` and use type narrowing to ensure safety.

# Naming conventions

### Classes

A `Service` typically encapsulates a broader business logic or workflow. It might orchestrate various components or interact with multiple data sources or APIs to fulfill a specific domain-related task.
A `Provider` usually focuses on supplying a specific type of data or resource. It’s often more narrowly scoped, providing access to a particular piece of data, a configuration, or a service needed by other parts of the application.

Ex: 

- Classes that interacts with a metadata source like `Github` ,`JsonFile` &`Ipfs`  should implement the interface `IMetadataProvider` and should be called `GithubProvider,JsonFileProvider` &`IpfsProvider`.
- A class that aggregates multiple sources like `Metadata` ,`Pricing` &`BlockchainEvents` , should be called, for example, `AgreggatorService` the word aggregator might change, based on the bussiness logic. Could be, for example, `MetricsService` .

If we look at it from composability a `Service` can be made up of `Providers` and the service works on applying the business and orchestration logic

# Errors

- Enable the `useUnknownInCatchVariables` flag in your `tsconfig.json`
- Enable the `noUncheckedIndexedAccess` flag for safe object access
- Avoid throwing literals like, enforce it with an ESLint rule (https://typescript-eslint.io/rules/no-throw-literal/
- Write custom error classes
    - Use declarative and descriptive names
    - Avoid the usage of suffixes like `Exception` or `Error` :
        - Ex: Don’t write `EmptyArrayException`, write `EmptyArray`

# **Testing**

- Avoid usage of `should` each time you are writing an `it` statement.
    - Ex: Don’t write `it('should run successfully'`), write `it('runs successfully')`.

## **Key points:**

1. **Purpose of Tests**:
    1. Use tests to clearly state the expected behavior for core business scenarios. Well-written tests can often be more clarifying than code comments.
2. **Mindset**:
    1. Approach testing with the mindset of, "I've considered how this situation impacts the business and I expect the code to behave as indicated by the test." This confirms that the implemented code functions as intended.
3. **Efficiency**:
    1. Avoid blind testing, which is time-consuming. Instead, focus on testing the most critical business scenarios.
    2. For example, if the business cares about a scenario where an action as a consequence of one of many sub-actions (Promise all for example) , write a test that expects failure when any operation fails. This approach efficiently communicates the expected behavior.
4. **Clarity:**
    1. Aim for a test suite that clearly indicates the intended behavior of the code. Reading the test results should provide a clear understanding of what the code is supposed to do.

# **Scripting**

### **Monorepo Projects**

- Use `process.cwd()` to reference the root directory within scripts.
- Organize scripts in the `package.json` file using the format:
    - Infrastructure scripts: `script:infra:{name}`
    - Utility scripts: `script:util:{name}`
- Create a `scripts` folder with the following structure:
    - `infra/` for infrastructure scripts.
    - `utilities/` for utility scripts.

## **Package Management**

- Do not use carets (`^`) for dependency versions to prevent unintended updates. Use `E` to enforce exact versions (this is pre-configured in the project template).

# **Documentation**

- Every part of the code (functions, method, classes, interfaces) should be documented. Always use JSDoc (TS): https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
- We leverage the usage of [Mermaid](https://mermaid.js.org/) for charts in our docs (tech designs, PRs, READMEs, etc)

# **Discord**

- We use Discord for communication—whenever you have a PR ready for review make sure to drop it in the pr-reviews channel!