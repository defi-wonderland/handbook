import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>{siteConfig.title}</h1>
          <p>{siteConfig.tagline}</p>
          <Link to="/docs/intro/welcome" className={styles.button}>
            Get Started
          </Link>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
