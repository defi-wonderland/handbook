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

const aztecCategories: Category[] = [
  {
    title: "BACKGROUND",
    icon: "/img/icons/map.svg",
    href: "/docs/background/overview",
  },
  {
    title: "STACK",
    icon: "/img/icons/stack-icon.svg",
    href: "/docs/stack/overview",
  },
  {
    title: "CONTRACTS",
    icon: "/img/icons/contract-icon.svg",
    href: "/docs/contracts/overview",
  },
  {
    title: "BLOCK PRODUCTION",
    icon: "/img/icons/processes-icon.svg",
    href: "/docs/block-production/overview",
  },
];

const aztecHeroProps: HeroSectionProps = {
  title: "Aztec Handbook",
  titleImage: "/img/aztec-handbook-social.svg",
  description:
    "New to Aztec? This handbook is your guide through all the things you need to know before you get started. Cheers!",
  buttonText: "Enter the Rabbit Hole",
  buttonImage: "/common/img/enter-button.svg",
  buttonLink: "/docs/intro/welcome",
};

const aztecHandbooks: Handbook[] = [
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
    title: "Optimism Handbook",
    image: "/common/img/optimism-handbook.svg",
    href: "https://optimism.handbook.wonderland.xyz",
    background: {
      bgType: "other",
      bgImage: "/common/img/background-handbook-card.jpg",
    },
  },
  {
    title: "Ethereum Foundation Handbook",
    image: "/common/img/ef-logo.svg",
    href: "https://ef.handbook.wonderland.xyz",
    background: {
      bgType: "other",
      bgImage: "/common/img/ef-social-card.png",
    },
  },
];

const aztecHandbookProps: HandbookSectionProps = {
  handbooks: aztecHandbooks,
  title: "ALL HANDBOOKS",
  description:
    "These handbooks are internal onboarding material created by Wonderland for working with our partners. It's not official documentation and may not reflect the latest updates. We share it openly in case it's useful to others.",
};

const aztecCategoryTheme: CategoryCardsTheme = {
  gradientStart: "var(--aztec-purple)",
  gradientEnd: "var(--aztec-purple)",
  iconHoverColorEffect: "none",
};
const AztecBackground = () => <div className={styles.aztecBackground} />;

function Home(): React.ReactElement {
  return (
    <Layout description="A curated guide to our best practices, processes, and technical insights.">
      <style>{`
        #__docusaurus {
          overflow: hidden;
        }
      `}</style>
      <main className={styles.main}>
        <AztecBackground />
        <section className={styles.centerContent}>
          <HeroSection {...aztecHeroProps} />
          <CategoryCards
            categories={aztecCategories}
            theme={aztecCategoryTheme}
          />
        </section>

        <HandbookSection {...aztecHandbookProps} />
      </main>
    </Layout>
  );
}

export default Home;
