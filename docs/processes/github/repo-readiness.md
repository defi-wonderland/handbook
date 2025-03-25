# Repo Readiness

This document outlines the essential steps to set up and optimize a GitHub repository for a project. 


## Checklist

- [ ]  Fill in repository description
- [ ]  Add topics, website, if any
- [ ]  Disable releases, packages, deployments, wiki, discussions if they’re not used
- [ ]  Add a LICENSE file
    - [MIT](https://github.com/defi-wonderland/xERC20/blob/main/LICENSE)
    - [AGPL-3](https://github.com/defi-wonderland/xkeeper-core/blob/ab0984f1e8bbc542d387c84c0f36c144cbb36050/LICENSE)
- [ ]  Add a README
    - If you project exports an NPM package, add a tag at the top of README (replace `repo-name` with the actual name)
        
        ```markdown
        [![Version](https://img.shields.io/npm/v/@defi-wonderland/repo-name]?label=Version)](https://www.npmjs.com/package/@defi-wonderland/repo-name)
        ```
        
    - Contributors footer
        
        ```markdown
        PROJECT NAME was built with ❤️ by [Wonderland](https://defi.sucks).
        
        Wonderland the largest core development group in web3. Our commitment is to a financial future that's open, decentralized, and accessible to all.
        
        [DeFi sucks](https://defi.sucks), but Wonderland is here to make it better.
        ```
        
    - Add a SECURITY file.