import styles from "./styles.module.css";
import React, { ReactNode } from "react";

type WonderlandBgTypeHandbook = {
  bgType: "wonderland";
  color: string;
};

type OtherBgTypeHandbook = {
  bgType: "other";
  bgImage: string;
};

type HandbookBackground = WonderlandBgTypeHandbook | OtherBgTypeHandbook;

export interface Handbook {
  title: string;
  image: string;
  href: string;
  background: HandbookBackground;
}

export interface HandbookSectionProps {
  handbooks: Handbook[];
  title: string;
  description: string;
}

interface HandbookCardProps {
  handbook: Handbook;
  isDefault?: boolean;
}

function HandbookCard({ handbook, isDefault = false }: HandbookCardProps) {
  if (isDefault) {
    return (
      <div className={styles.handbooksCardDefault}>
        <img
          src="/common/img/default-handbook.svg"
          alt=""
          className={styles.handbooksCardIcon}
        />
      </div>
    );
  }

  let cardStyle: React.CSSProperties = {};
  if (handbook.background.bgType === "wonderland") {
    cardStyle.backgroundImage = "url(/common/img/background-handbook-card.jpg)";
  } else if (handbook.background.bgType === "other") {
    cardStyle.backgroundImage = `url(${handbook.background.bgImage})`;
  }

  return (
    <a
      href={handbook.href}
      style={cardStyle}
      target="_blank"
      className={styles.handbooksCard}
    >
      {handbook.background.bgType === "wonderland" && (
        <div
          className={styles.colorOverlay}
          style={{ backgroundColor: handbook.background.color }}
        ></div>
      )}
      <img src={handbook.image} alt="" className={styles.handbooksCardIcon} />
    </a>
  );
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
        alt=""
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
            {/* First handbook card  */}
            <HandbookCard handbook={handbooks[0]} />
            {/* Default handbook card (not a link) */}
            <HandbookCard handbook={handbooks[0]} isDefault />
          </>
        ) : (
          handbooks.map((handbook) => (
            <HandbookCard key={handbook.title} handbook={handbook} />
          ))
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
