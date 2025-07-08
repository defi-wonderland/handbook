import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  CategoryCards,
  Category,
  CategoryCardsTheme,
} from "@handbook/common-config/components";
import styles from "./index.module.css";

const templateCategories: Category[] = [
  {
    title: "Start",
    icon: "/img/docusaurus.png",
    href: "/docs/intro/welcome",
  },
  {
    title: "Documentation",
    icon: "/img/docusaurus.png",
    href: "/docs/intro/welcome",
  },
  {
    title: "Examples",
    icon: "/img/docusaurus.png",
    href: "/docs/intro/welcome",
  },
  {
    title: "API Reference",
    icon: "/img/docusaurus.png",
    href: "/docs/intro/welcome",
  },
];

const templateCategoryTheme: CategoryCardsTheme = {
  gradientStart: "#4f46e5",
  gradientEnd: "#7c3aed",
  iconHoverColorEffect: "none",
};

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

        <CategoryCards
          categories={templateCategories}
          theme={templateCategoryTheme}
        />
      </main>
    </Layout>
  );
}

export default Home;
