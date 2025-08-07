import Layout from "@theme/Layout";
import styles from "./index.module.css";
import {
  HeroSection,
  CategoryCards,
  HandbookSection,
  Category,
  HeroSectionProps,
  Handbook,
  HandbookSectionProps,
  CategoryCardsTheme,
} from "@handbook/common-config/components";

const optimismCategories: Category[] = [
  {
    title: "STACK",
    icon: "/img/icons/stack-icon.svg",
    href: "/docs/stack/overview",
  },
  {
    title: "INTEROP",
    icon: "/img/icons/interop-icon.svg",
    href: "/docs/interoperability/overview",
  },
  {
    title: "GOVERNANCE",
    icon: "/img/icons/governance-icon.svg",
    href: "/docs/governance/governance-overview",
  },
  {
    title: "PROCESSES",
    icon: "/img/icons/processes-icon.svg",
    href: "/docs/processes/overview",
  },
];

const optimismHeroProps: HeroSectionProps = {
  title: "OP Handbook",
  titleImage: "/img/op-handbook-social.svg",
  description:
    "New to Optimism? This handbook is your guide through all the things you need to know before you get started. Cheers!",
  buttonText: "Enter the Rabbit Hole",
  buttonImage: "/common/img/enter-button.svg",
  buttonLink: "/docs/welcome",
};

const optimismHandbooks: Handbook[] = [
  {
    title: "Wonderland Handbook",
    image: "/common/img/wonderland-button-image.png",
    href: "https://handbook.wonderland.xyz",
    background: {
      bgType: "other",
      bgImage: "/common/img/wonderland-button-bg.jpg",
    },
  },
  {
    title: "Aztec handbook",
    image: "/img/aztec-handbook.svg",
    href: "https://aztec.handbook.wonderland.xyz",
    background: {
      bgType: "wonderland",
      color: "#625CBFD1",
    },
  },
];

const optimismHandbookProps: HandbookSectionProps = {
  handbooks: optimismHandbooks,
  title: "ALL HANDBOOKS",
  description:
    "These handbooks are internal onboarding material created by Wonderland for working with our partners. It's not official documentation and may not reflect the latest updates. We share it openly in case it's useful to others.",
};

const optimismCategoryTheme: CategoryCardsTheme = {
  gradientStart: "var(--op-red)",
  gradientEnd: "var(--op-red-light)",
  iconHoverColorEffect: "none"
};
const OptimismBackground = () => <div className={styles.optimismBackground} />;

function Home(): React.ReactElement {
  return (
    <Layout description="A curated guide to our best practices, processes, and technical insights.">
      <style>{`
        #__docusaurus {
          overflow: hidden;
        }
      `}</style>
      <main className={styles.main}>
        <OptimismBackground />
        <section className={styles.centerContent}>
          <HeroSection {...optimismHeroProps} />
          <CategoryCards categories={optimismCategories} theme={optimismCategoryTheme} />
        </section>

        <HandbookSection {...optimismHandbookProps} />
      </main>
    </Layout>
  );
}

export default Home;
