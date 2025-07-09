import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { ReactNode } from "react";

export interface HeroSectionProps {
  title: string;
  titleImage: string;
  description: string;
  buttonText: string;
  buttonImage: string;
  buttonLink: string;
}

export default function HeroSection({
  title,
  titleImage,
  description,
  buttonText,
  buttonImage,
  buttonLink,
}: HeroSectionProps): ReactNode {
  return (
    <>
      <div className={styles.heroTitle}>
        <img
          src={titleImage}
          alt={title}
          className={styles.heroImage}
        />
      </div>
      <p className={styles.description}>
        {description}
      </p>
      <div className={styles.buttonContainer}>
        <Link to={buttonLink} className={styles.buttonLink}>
          <img
            src={buttonImage}
            alt={buttonText}
            className={styles.buttonImage}
          />
        </Link>
      </div>
    </>
  );
}
