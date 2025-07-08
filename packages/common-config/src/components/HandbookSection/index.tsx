import styles from "./styles.module.css";
import React, { ReactNode } from "react";

export interface Handbook {
  title: string;
  image: string;
  href: string;
  bgImage: string;
}

export interface HandbookSectionProps {
  handbooks: Handbook[];
  title: string;
  description: string;
}

export default function HandbookSection({
  handbooks,
  title,
  description,
}: HandbookSectionProps): ReactNode {
  return (
    <section className={styles.handbooksSection}>
      <img
        src="/common/img/star-icon.svg"
        alt="Star illustration"
        className={styles.starMobile}
      />
      <div className={styles.handbooksSeparator}>
        <span className={`${styles.line} ${styles.mainLine}`}></span>
        <p>{title}</p>
        <span className={`${styles.line} ${styles.mainLine}`}></span>
      </div>
      <p className={styles.handbooksDescription}>{description}</p>
      <div className={styles.handbooksCards}>
        {handbooks.length === 1 ? (
          <>
            {/* First handbook card */}
            <a
              key={handbooks[0].title}
              href={handbooks[0].href}
              style={{ backgroundImage: `url(${handbooks[0].bgImage})` }}
              target="_blank"
              className={styles.handbooksCard}
            >
              <img
                src={handbooks[0].image}
                alt=""
                className={styles.handbooksCardIcon}
              />
            </a>

            {/* Default handbook card (not a link) */}
            <div className={styles.handbooksCardDefault}>
              <img
                src="/img/default-handbook.svg"
                alt=""
                className={styles.handbooksCardIcon}
              />
            </div>
          </>
        ) : (
          handbooks.map((handbook) => {
            return (
              <a
                key={handbook.title}
                href={handbook.href}
                style={{ backgroundImage: `url(${handbook.bgImage})` }}
                target="_blank"
                className={styles.handbooksCard}
              >
                <img
                  src={handbook.image}
                  alt=""
                  className={styles.handbooksCardIcon}
                />
              </a>
            );
          })
        )}
      </div>
      <div className={styles.handbooksSeparator}>
        <span className={styles.line}></span>
        <img src="/common/img/star-icon.svg" alt="" />
        <span className={styles.line}></span>
      </div>
    </section>
  );
}
