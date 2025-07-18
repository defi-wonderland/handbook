# Repo Readiness

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'start'}}>
  <div>
    <img src="/img/repo-readiness.jpg" alt="Repository setup process illustration" width="80%" style={{marginBottom: 0}} />
  </div>
  <div>
    This document provides a guide for setting up GitHub repositories according to our best practices. Following these guidelines ensures consistent repository configuration, proper documentation, and security measures across all projects.

    Whether you're creating a new repository or updating an existing one, this checklist will help maintain our high standards for code organization and accessibility.

    ## Checklist

    - [ ]  Fill in repository description
    - [ ]  Add topics, website, if any
    - [ ]  Disable releases, packages, deployments, wiki, and discussions if they're not used
     - [ ]   Add a LICENSE file
        - [MIT](https://github.com/defi-wonderland/xERC20/blob/main/LICENSE)
        - [AGPL-3](https://github.com/defi-wonderland/xkeeper-core/blob/ab0984f1e8bbc542d387c84c0f36c144cbb36050/LICENSE)

  </div>
</div>
- [ ]  Add a README
    - If you project exports an NPM package, add a tag at the top of the README (replace `repo-name` with the actual name)
        
        ```markdown
        [![Version](https://img.shields.io/npm/v/@defi-wonderland/repo-name)?label=Version)](https://www.npmjs.com/package/@defi-wonderland/repo-name)
        ```
        
    - Contributors footer
        
        ```markdown
        PROJECT NAME was built with ❤️ by [Wonderland](https://defi.sucks).
        
        Wonderland is the largest core development group in Web3. Our commitment is to a financial future that's open, decentralized, and accessible to all.
        
        [DeFi sucks](https://defi.sucks), but Wonderland is here to make it better.
        ```
        
    - Add a SECURITY file.

:::tip
Not sure about how to do it? Run the [Repo Doctor Action](https://github.com/defi-wonderland/repo-creatooor/actions/workflows/repo-doctor.yml) in the [repo-creatoor repository](https://github.com/defi-wonderland/repo-creatooor)!
:::
