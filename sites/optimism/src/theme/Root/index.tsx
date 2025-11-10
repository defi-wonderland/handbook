import { Root as SharedRoot } from "@handbook/common-config/theme";
import ChefAI from '@site/src/components/ChefAI'

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <SharedRoot
      showDisclaimer
      disclaimerContent={
        <p>
          This handbook is not intended to replace Optimism's documentation.
          This is the internal material we use at Wonderland to onboard new
          people working with Optimism as a core development member. We open
          source it in the hopes that it helps somebody else, but beware it can
          be outdated on the latest updates. For the most up-to-date
          information, please refer to the official Optimism documentation at{" "}
          <a
            href="https://docs.optimism.io/"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            docs.optimism.io
          </a>
          .
        </p>
      }
    >
      {children}
      <ChefAI/>
    </SharedRoot>
  );
}
