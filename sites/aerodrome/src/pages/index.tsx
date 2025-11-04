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

const aerodromeCategories: Category[] = [
  { title: "EXAMPLE", icon: "/img/docusaurus.png", href: "/docs/intro/welcome" },
  { title: "EXAMPLE", icon: "/img/docusaurus.png", href: "/docs/intro/welcome" },
  { title: "EXAMPLE", icon: "/img/docusaurus.png", href: "/docs/intro/welcome" },
  { title: "EXAMPLE", icon: "/img/docusaurus.png", href: "/docs/intro/welcome" },
];

const aerodromeHeroProps: HeroSectionProps = {
  title: "Aerodrome Handbook",
  titleImage: "/img/aerodrome-handbook-social.svg",
  description:
    "New to Aerodrome? This handbook is your guide through all the things you need to know before you get started.",
  buttonText: "Enter the Rabbit Hole",
  buttonImage: "/common/img/enter-button.svg",
  buttonLink: "/docs/intro/welcome",
};

const aerodromeHandbooks: Handbook[] = [];

const aerodromeHandbookProps: HandbookSectionProps = {
  handbooks: aerodromeHandbooks,
  title: "ALL HANDBOOKS",
  description:
    "These handbooks are internal onboarding material created by Wonderland for working with our partners. It's not official documentation and may not reflect the latest updates.",
};

const aerodromeCategoryTheme: CategoryCardsTheme = {
  gradientStart: "#2660F5",
  gradientEnd: "#6C90FF",
  iconHoverColorEffect: "none",
};

const AerodromeBackground = () => <div className={styles.aerodromeBackground} />;

function Home(): React.ReactElement {
  return (
    <Layout description="A curated guide to our best practices, processes, and technical insights.">
      <style>{`
        #__docusaurus { overflow: hidden; }
      `}</style>
      <main className={styles.main}>
        <AerodromeBackground />
        <section className={styles.centerContent}>
          <HeroSection {...aerodromeHeroProps} />
          <CategoryCards categories={aerodromeCategories} theme={aerodromeCategoryTheme} />
        </section>
        {aerodromeHandbooks.length > 0 && (
          <HandbookSection {...aerodromeHandbookProps} />
        )}
      </main>
    </Layout>
  );
}

export default Home;
