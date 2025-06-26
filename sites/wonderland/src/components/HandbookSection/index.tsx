import styles from "./styles.module.css";
import { ReactNode } from "react";

const handbooks = [
  {
    title: "Optimism handbook",
    image: "/img/optimism-handbook.svg",
    href: "/docs/handbook/overview",
  },
  {
    title: "Aztec handbook",
    image: "/img/aztec-handbook.svg",
    href: "https://docs.aztec.network/aztec-handbook/overview",
    color: "#625CBFD1",
  },
];

export default function HandbookSection(): ReactNode {
  return (
    <section className={styles.handbooksSection}>
      <img
        src="/img/star-icon.svg"
        alt="Star illustration"
        className={styles.starMobile}
      />
      <div className={styles.handbooksSeparator}>
        <span className={`${styles.line} ${styles.mainLine}`}></span>
        <p>PARTNER HANDBOOKS</p>
        <span className={`${styles.line} ${styles.mainLine}`}></span>
      </div>
      <p className={styles.handbooksDescription}>
        These handbooks are internal onboarding material created by Wonderland
        for working with our partners. It's not official documentation and may
        not reflect the latest updates. We share it openly in case it's useful
        to others.
      </p>
      <div className={styles.handbooksCards}>
        {handbooks.map((handbook) => {
          return (
            <a
              key={handbook.title}
              href={handbook.href}
              target="_blank"
              className={styles.handbooksCard}
            >
              {handbook.color && (
                <div
                  className={styles.colorOverlay}
                  style={{ backgroundColor: handbook.color }}
                ></div>
              )}
              <img
                src={handbook.image}
                alt={`${handbook.title} ICON`}
                className={styles.handbooksCardIcon}
              />
            </a>
          );
        })}
      </div>
      <div className={styles.handbooksSeparator}>
        <span className={styles.line}></span>
        <img src="/img/star-icon.svg" alt="Star illustration" />
        <span className={styles.line}></span>
      </div>
    </section>
  );
}
