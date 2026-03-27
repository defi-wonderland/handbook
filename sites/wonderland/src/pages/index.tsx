import Layout from "@theme/Layout";
import styles from "./index.module.css";
import {
  HeroSection,
  CategoryCards,
  IlustrationsContainer,
  NoiseBackground,
  FooterBackground,
  TriangleBackground,
  StarsBackground,
  HandbookSection,
  Category,
  HeroSectionProps,
  Handbook,
  HandbookSectionProps,
  IlustrationsContainerProps,
} from "@handbook/common-config/components";

const wonderlandCategories: Category[] = [
  {
    title: "Processes",
    icon: "/img/puzzle-piece.svg",
    href: "/docs/processes/overview",
  },
  {
    title: "Development",
    icon: "/img/code-bracket-square.svg",
    href: "/docs/development/overview",
  },
  {
    title: "Security",
    icon: "/img/key.svg",
    href: "/docs/security/overview",
  },
  {
    title: "Testing",
    icon: "/img/bug-ant.svg",
    href: "/docs/testing/overview",
  },
];

const wonderlandHeroProps: HeroSectionProps = {
  title: "Wonderland Handbook",
  titleImage: "/img/wonderland-handbook-title.svg",
  description:
    "Good systems outlive the people who built them. These handbooks are how we make sure ours do: Our best practices, technical standards, and onboarding guides for the teams we work with.",
  buttonText: "Go down the rabbit hole",
  buttonImage: "/common/img/enter-button.svg",
  buttonLink: "/docs/intro/welcome",
};

const wonderlandHandbooks: Handbook[] = [
  {
    title: "Optimism handbook",
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
      bgType: "other",
      bgImage: "/common/img/aztec-background-handbook-card.jpg",
    },
  },
  {
    title: "Ethereum Foundation Handbook",
    image: "/common/img/ef-handbook.svg",
    href: "https://ef.handbook.wonderland.xyz",
    background: {
      bgType: "other",
      bgImage: "/common/img/ef-background-handbook-card.png",
    },
  },
];

const wonderlandHandbookProps: HandbookSectionProps = {
  handbooks: wonderlandHandbooks,
  title: "PARTNER HANDBOOKS",
  description:
    "These handbooks are internal material created for working with our partners. They're not official documentation and may not reflect the latest updates. We share them openly because useful knowledge shouldn't sit behind closed doors.",
  className: "handbooksSectionWonderland",
};

const wonderlandIllustrationsProps: IlustrationsContainerProps = {
  coneImage: "/img/cone.png",
  sphereImage: "/img/sphere.png",
  ringImage: "/img/ring.png",
};

function Home(): React.ReactElement {
  return (
    <Layout description="A curated guide to our best practices, processes, and technical insights.">
      <style>{`
        #__docusaurus {
          overflow: hidden;
        }
      `}</style>
      <main className={styles.main}>
        <StarsBackground zIndex={-1} />

        <section className={styles.centerContent}>
          <HeroSection {...wonderlandHeroProps} />
          <CategoryCards categories={wonderlandCategories} />
        </section>

        <IlustrationsContainer {...wonderlandIllustrationsProps} />

        <HandbookSection {...wonderlandHandbookProps} />

        <TriangleBackground />

        <FooterBackground />
      </main>

      <NoiseBackground />
    </Layout>
  );
}

export default Home;
