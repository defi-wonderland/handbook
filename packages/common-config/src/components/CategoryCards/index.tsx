import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { ReactNode } from "react";

export interface Category {
  title: string;
  icon: string;
  href: string;
}

export interface CategoryCardsTheme {
  gradientStart: string;
  gradientEnd: string;
  iconHoverColorEffect?: "white" | "none";
}

interface CategoryCardsProps {
  categories: Category[];
  theme?: CategoryCardsTheme;
}

export default function CategoryCards({
  categories,
  theme,
}: CategoryCardsProps): ReactNode {
  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    // Scroll to top
    window.scrollTo({ top: 0 });

    // Navigate after scroll
    setTimeout(() => {
      window.location.href = href;
    }, 10);
  };

  // Default theme (Wonderland)
  const defaultTheme: CategoryCardsTheme = {
    gradientStart: "var(--wonderland-pink)",
    gradientEnd: "var(--wonderland-yellow)",
    iconHoverColorEffect: "white",
  };

  const currentTheme = theme || defaultTheme;

  return (
    <div className={styles.categoryCards}>
      {categories.map((category) => (
        <Link
          key={category.title}
          to={category.href}
          className={`${styles.categoryCard} ${currentTheme.iconHoverColorEffect === "none" ? styles.noIconHoverEffect : ""}`}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
            handleCardClick(e, category.href)
          }
          style={
            {
              "--gradient-start": currentTheme.gradientStart,
              "--gradient-end": currentTheme.gradientEnd,
            } as React.CSSProperties
          }
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
  );
}
