import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const categories = [
  {
    title: 'Development',
    icon: '/img/key-hole.svg',
    href: '/docs/development/overview',
  },
  {
    title: 'Security',
    icon: '/img/key.svg',
    href: '/docs/security/overview',
  },
  {
    title: 'Testing',
    icon: '/img/bug.svg',
    href: '/docs/testing/overview',
  },
];

function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={siteConfig.title}
      description="A curated guide to our best practices, processes, and technical insights.">
      <main className={styles.main}>
        <div className={styles.centerContent}>
          <div className={styles.heroTitle}>
            <img src="/img/hero-section.svg" alt="Wonderland Handbook" className={styles.heroImage} />
          </div>
          <p className={styles.description}>
            At Wonderland, we believe that the ecosystem thrives on collaboration and shared knowledge. This handbook is our living repository—a curated guide to our best practices, processes, and technical insights.
          </p>
          <div className={styles.buttonContainer}>
            <Link to="/docs/intro/welcome" className={styles.buttonLink}>
              <img src="/img/Button.svg" alt="Go down the rabbit hole" className={styles.buttonImage} />
            </Link>
          </div>
          <div className={styles.categoryCards}>
            {categories.map((category) => (
              <Link
                key={category.title}
                to={category.href}
                className={styles.categoryCard}
              >
                <img 
                  src={category.icon} 
                  alt={category.title} 
                  className={styles.categoryIcon}
                />
                <span className={styles.categoryTitle}>{category.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
