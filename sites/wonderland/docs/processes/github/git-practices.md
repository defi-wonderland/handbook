# Git Practices

Here we'll explore our approach to code management and development workflows. These guidelines help us maintain clean, organized repositories while keeping our development process efficient.

## Repository Settings

- [ ] Disable "Allow rebase merging"
- [ ] Enable "Automatically delete head branches"
- [ ] Enable "Always suggest updating pull request branches"
- [ ] Disable Issues
- [ ] Disable Project
- [ ] Disable Downloads
- [ ] Disable Wiki
- [ ] MIT is the default license
- [ ] Main branch protection
  - [ ] Enable "Require a pull request before merging"
  - [ ] Change "Require approvals" to 2
  - [ ] Enable "Dismiss stale pull request approvals when new commits are pushed"
  - [ ] Disable "Require review from Code Owners"
  - [ ] Enable "Require status checks to pass before merging"
  - [ ] Enable "Require branches to be up to date before merging"
  - [ ] Enable "Require signed commits"
- [ ] Dev branch protection
  - [ ] Enable "Require a pull request before merging"
  - [ ] Change "Require approvals" to 1
  - [ ] Enable "Dismiss stale pull request approvals when new commits are pushed"
  - [ ] Enable "Require status checks to pass before merging"
  - [ ] Enable "Require branches to be up to date before merging"
  - [ ] Enable "Require signed commits"

## Branches architecture

The most common and simple architecture is to have a production branch (`main`) and a development branch (`dev`).

When working on a new feature, we will create a new branch (`feat/my-feature`) using `dev` as the base branch. Now, at this point, we need to think about the size of the new feature:

- If it's a small feature, we should be fine working and pushing the commits to this new branch directly (`feat/my-feature`)
- If it's a big feature, we should think about splitting the task into different sub-branches. This way we can have smaller PRs from `sub-branches` to `feat/my-feature` at different stages of the development. So instead of having people reviewing one massive PR, we will provide smaller PRs. This is also beneficiary for the developers since the chances of catching an early error are higher with this approach.

Let’s admit it: Reviewing 50 files changed in a PR **WILL NOT BE A GOOD REVIEW.**

<div align="center">
  <img src="/img/pr-meme.jpg" width="900" />
</div>

Once the feature is finished, it will be merged to `dev` (base branch), and the project’s workflow will continue. Different projects will have different workflows.

<div align="center">
  <img src="/img/flow-pr.png" alt="git-flow" />
</div>

## Branches and commits naming

For branches, the idea is to have explicit branch names, so we will follow this structure: `<type>/<description>`.

Having an explicit commit history is also desirable. To achieve that, the `commits` should be structured as: `<type>: <description>`

The available `types` are the following (taken from [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification)):

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests
- **chore**: Changes to the build process or auxiliary tools and libraries, such as documentation generation

### Example branch names

`feat/user-can-deposit-tokens`

`fix/undefined-balance`

`docs/readme`

### Example commit messages

`fix: user can't be undefined anymore`

`docs: correct spelling of CHANGELOG`

```jsx
feat: allow provided config object to extend other configs

* some note
* some other note
```
