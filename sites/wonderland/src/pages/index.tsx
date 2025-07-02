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
} from "../components";

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
          <HeroSection />
          <CategoryCards />
        </section>

        <IlustrationsContainer />

        <HandbookSection />

        <TriangleBackground />

        <FooterBackground />
      </main>

      <NoiseBackground />
    </Layout>
  );
}

export default Home;
