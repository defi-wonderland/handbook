import { Root as SharedRoot } from "@handbook/common-config/theme";

export default function Root({ children }: { children: React.ReactNode }) {
  return <SharedRoot showDisclaimer={false}>{children}</SharedRoot>;
}
