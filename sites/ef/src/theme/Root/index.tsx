import { Root as SharedRoot } from "@handbook/common-config/theme";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <SharedRoot
      showDisclaimer
      disclaimerContent={
        <p>
          This handbook is not intended to replace EF's documentation. This
          is the internal material we use at Wonderland to onboard new people
          working with EF as a core development member. We open source it in
          the hopes that it helps somebody else, but beware it can be outdated
          on the latest updates. For the most up-to-date information, please
          refer to the official EF documentation at{" "}
          <a
            href="https://ethereum.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            ethereum.org
          </a>
          .
        </p>
      }
    >
      {children}
    </SharedRoot>
  );
}
