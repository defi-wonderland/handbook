import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "welcome",
    {
      type: "category",
      label: "Stack",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "stack/overview",
      },
      items: [
        "stack/overview",
        "stack/previous-knowledge",
        "stack/op-stack",
        "stack/deposit-flow",
        "stack/withdrawal-flow",
        "stack/evm-vs-op",
        "stack/precompiles-and-predeploys",
        "stack/preinstalls",
        "stack/bye",
      ],
    },
    {
      type: "category",
      label: "Interop",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "interoperability/overview",
      },
      items: [
        "interoperability/overview",
        "interoperability/intro-to-interop",
        "interoperability/messaging-protocol",
        "interoperability/token-interop",
        "interoperability/eth-interop",
        "interoperability/execution-and-sequencing",
        "interoperability/verification-pipeline",
        "interoperability/predeploys-reference",
        "interoperability/bye",
      ],
    },
    {
      type: "category",
      label: "Governance",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "governance/governance-overview",
      },
      items: [
        "governance/governance-overview",
        "governance/intro-to-governance",
        "governance/governor-walkthrough",
        {
          type: "category",
          label: "The Operating Manual",
          items: [
            "governance/the-operating-manual/the-operating-manual",
            "governance/the-operating-manual/the-citizens-house",
            "governance/the-operating-manual/the-token-house",
          ],
        },
        {
          type: "category",
          label: "Our Work",
          items: [
            "governance/our-work/overview",
            "governance/our-work/permissionless-proposals",
          ],
        },
        "governance/bye",
      ],
    },
    {
      type: "category",
      label: "Processes",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "processes/overview",
      },
      items: [
        "processes/overview",
        "processes/design",
        "processes/spec",
        "processes/implementation",
        "processes/fma",
        "processes/projects",
        "processes/coding",
        "processes/challenge",
      ],
    },
    {
      type: "category",
      label: "Guidelines",
      collapsible: false,
      collapsed: false,
      link: {
        type: "doc",
        id: "guides/overview",
      },
      items: [
        "guides/overview",
        "guides/testing-guidelines",
        "guides/coding-guidelines",
      ],
    },
  ],
};

export default sidebars;
