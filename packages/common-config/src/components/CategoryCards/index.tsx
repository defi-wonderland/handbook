import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { ReactNode } from "react";

export interface Category {
  title: string;
  icon: string;
  href: string;
  comingSoon?: boolean;
  comingSoonBanner?: string;
}

export interface CategoryCardsTheme {
  gradientStart: string;
  gradientEnd: string;
  iconHoverColorEffect?: "white" | "none";
}

interface CategoryCardsProps {
  categories: Category[];
  theme?: CategoryCardsTheme;
  columns?: number;
}

export default function CategoryCards({
  categories,
  theme,
  columns = 4,
}: CategoryCardsProps): ReactNode {
  const handleCardClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    comingSoon?: boolean
  ) => {
    if (comingSoon) {
      e.preventDefault();
      return;
    }
    
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
    <div 
      className={styles.categoryCards}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}
    >
      {categories.map((category) => (
        <Link
          key={category.title}
          to={category.href}
          className={`${styles.categoryCard} ${currentTheme.iconHoverColorEffect === "none" ? styles.noIconHoverEffect : ""}`}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
            handleCardClick(e, category.href, category.comingSoon)
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
          {category.comingSoon && category.comingSoonBanner && (
            <div className={styles.comingSoonOverlay}>
              <img
                src={category.comingSoonBanner}
                alt="Coming Soon"
                className={styles.comingSoonBanner}
              />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
