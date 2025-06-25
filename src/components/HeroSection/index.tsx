import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { ReactNode } from "react";

export default function HeroSection(): ReactNode {
  return (
    <>
      <div className={styles.heroTitle}>
        <img
          src="/img/wonderland-handbook-title.svg"
          alt="Wonderland Handbook"
          className={styles.heroImage}
        />
      </div>
      <p className={styles.description}>
        At Wonderland, we believe that the ecosystem thrives on collaboration
        and shared knowledge. This handbook is our living repository: a curated
        guide to our best practices, processes, and technical insights.
      </p>
      <div className={styles.buttonContainer}>
        <Link to="/docs/intro/welcome" className={styles.buttonLink}>
          <img
            src="/img/enter-button.svg"
            alt="Go down the rabbit hole"
            className={styles.buttonImage}
          />
        </Link>
      </div>
    </>
  );
}
