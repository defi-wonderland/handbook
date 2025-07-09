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
    "At Wonderland, we believe that the ecosystem thrives on collaboration and shared knowledge. This handbook is our living repository: a curated guide to our best practices, processes, and technical insights.",
  buttonText: "Go down the rabbit hole",
  buttonImage: "/common/img/enter-button.svg",
  buttonLink: "/docs/intro/welcome",
};

const wonderlandHandbooks: Handbook[] = [
  {
    title: "Optimism handbook",
    image: "/img/optimism-handbook.svg",
    href: "/optimism",
    background: {
      bgType: "other",
      bgImage: "/common/img/background-handbook-card.jpg",
    },
  },
  // {
  //   title: "Aztec handbook",
  //   image: "/img/aztec-handbook.svg",
  //   href: "/aztec",
  //   background: {
  //     bgType: "wonderland",
  //     color: "#625CBFD1",
  //   },
  // },
];

const wonderlandHandbookProps: HandbookSectionProps = {
  handbooks: wonderlandHandbooks,
  title: "PARTNER HANDBOOKS",
  description:
    "These handbooks are internal onboarding material created by Wonderland for working with our partners. It's not official documentation and may not reflect the latest updates. We share it openly in case it's useful to others.",
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
