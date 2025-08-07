import { Root as SharedRoot } from "@handbook/common-config/theme";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <SharedRoot
      showDisclaimer
      disclaimerContent="This handbook is not intended to replace [official documentation](https://docs.aztec.network/). This is internal material used for onboarding new team members. We open source it in the hopes that it helps somebody else, but beware it can be outdated on the latest updates."
    >
      {children}
    </SharedRoot>
  );
}
