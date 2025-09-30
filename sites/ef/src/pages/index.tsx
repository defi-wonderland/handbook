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

const efCategories: Category[] = [
  {
    title: "WALLET",
    icon: "/img/icons/map.svg",
    href: "/docs/wallet/"
  },
  {
    title: "PRIVACY POOLS BY KOHAKU",
    icon: "/img/icons/stack-icon.svg",
    href: "/docs/pp/overview",
    comingSoon: true,
    comingSoonBanner: "/common/img/coming-soon-banner.png",
  },
  {
    title: "PROTOCOL",
    icon: "/img/icons/document-currency-dollar.svg",
    href: "/docs/protocol/overview",
    comingSoon: true,
    comingSoonBanner: "/common/img/coming-soon-banner.png",
  }

];

const efHeroProps: HeroSectionProps = {
  title: "Ethereum Foundation Handbook",
  titleImage: "/img/ef-handbook-social.svg",
  description:
    "This handbook explores a key privacy initiative from the Ethereum Foundation",
  buttonText: "Enter the Rabbit Hole",
  buttonImage: "/common/img/enter-button.svg",
  buttonLink: "/docs/intro/welcome",
};

const efHandbooks: Handbook[] = [
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
    title: "Aztec handbook",
    image: "/common/img/aztec-handbook.svg",
    href: "https://aztec.handbook.wonderland.xyz",
    background: {
      bgType: "wonderland",
      color: "#625CBFD1",
    },
  },
];

const efHandbookProps: HandbookSectionProps = {
  handbooks: efHandbooks,
  title: "ALL HANDBOOKS",
  description:
    "These handbooks are internal onboarding material created by Wonderland for working with our partners. It's not official documentation and may not reflect the latest updates. We share it openly in case it's useful to others.",
};

const efCategoryTheme: CategoryCardsTheme = {
  gradientStart: "var(--ef-cyan)",
  gradientEnd: "var(--ef-blue)",
  iconHoverColorEffect: "none",
};

const EfBackground = () => <div className={styles.efBackground} />;

function Home(): React.ReactElement {
  return (
    <Layout description="A curated guide to our best practices, processes, and technical insights.">
      <style>{`
        #__docusaurus {
          overflow: hidden;
        }
      `}</style>
      <main className={styles.main}>
        <EfBackground />
        <section className={styles.centerContent}>
          <HeroSection {...efHeroProps} />
          <CategoryCards
            categories={efCategories}
            theme={efCategoryTheme}
            columns={3}
          />
        </section>

        <HandbookSection {...efHandbookProps} />
      </main>
    </Layout>
  );
}

export default Home;
