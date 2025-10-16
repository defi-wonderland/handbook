---
slug: repo-creatooor
title: Managing your github repos like a true wonderlad
description: Introducing repo-creatooor
date: 2025-10-17
tags: [Devtools]
authors: [teddy]
---

## So you're telling me I need a repository to manage the creation of other repositories? Why indulge in such a recursive endeavour?

When you're 2-3 frens hacking away in your living room, it's perfectly okay to have everyone be able to create repositories in livingroom-corp's github org. Hell, you could even not have an org. But by the time you're comfortably in the two digits of people (with lots of respective living rooms) and six digits under management, it makes sense to have something more robust in place. In particular, you have two trivial options:

- Having something resembling 'The Security Team' be responsible over creating repositories: doesn't really scale since it involves manual and repetitive work, and involves lots of waiting for the person with the appropriate permissions to ~come back from their mid-day 5 hour horse riding lessons~ finish carefully reviewing PRs and manually perform the required action
- Allowing everyone (or a larger amount of people) to create repositories: Not ideally from a security perspective, since permissions for users are not very granular, and allowing anyone to create & configure repositories also means allowing them to set up (and remove!) branch protection rules, requirements for signed commits, and most other tools that allow us to have certainty about the code we ship matching the code we think we're shipping.

Neither of those alternatives make any progress towards ensuring all the repos follow the same good practices regarding how a repository should be configured. And divergences in those can snowball into real issues. Say Animal A is accustomed to having repositories allow merging only after CI passes, all comments are resolved, and two reviewers approved the PR. When working in a repository that plays it faster and looser with merge requirements, they could hit the big green button and merge something that only has 1 review and no CI passes.

## Okay, I'll bite. What is this repo-creatooor thiiing?

It's a github workflow that has the permissions to create and set up _private_ repositories (making something public still requires manual intervention, in order to enforce review). It ensures all of our repositories are configured with the same merging requirements, branch protection rules and other settings such as disabling wiki pages, while also keeping it easy to bootstrap them with one of our boilerplates.

For end-users, it's really simple:

![repo creation dialog in actions tab](/img/blog-posts-img/repo-creatooor/form.png)

Invoking the github-generated workflow_dispatch form is all they need to do to create a repository

## But what about all the repooos we already haaave?

For that, you can similarly use the companion `repo-doctor` workflow, which checks an existing repository complies with all the defined rules and attempts to fix any issues it finds, using the same API authentication as the `repo-creatooor`. This will take care of making sure the configurations of all your repos don't diverge when you start using the tool or when you change its configuration parameters later down the line

## Awesooome! How do I set thiiis up?

We have already created [a lovely setup guide](https://github.com/defi-wonderland/repo-creatooor/blob/main/docs/SETUP.md) with all the steps you'll need to take.
Although since the security of your org is what's motivating you to use this tool, it's worth giving an overview of how the tool works and what security implications it has.

- You'll create a github app and give it some granular (but very consequential) permissions on your entire github organization. In particular:
  - Repository permissions
    - Administration: read and write
    - Contents: read and write
  - Organization permissions
    - Members: read-only, or read-write if you want it to be able to create for you.
- You'll generate a private key with which the app will authenticate itself, and set it as the a secret available to the github workfow defined in the repository

This means you will have to be very careful about what branches of the repo-creatooor can be used to read the workflow from, and who can push code to the repository, since workflows on it have access to e.g. read the contents of every repository, even (especially!) those not accessible to whoever pushed the code to your fork of the tool.

Oh! and one last thing: remember this tool is configurable, so feel free to tweak [the config file](https://github.com/defi-wonderland/repo-creatooor/blob/main/src/config/default.ts) so it enforces what your organization actually needs.
