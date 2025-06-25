import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { ReactNode } from "react";

const categories = [
  {
    title: "Processes",
    icon: "/img/puzzle-piece.svg",
    href: "/docs/processes/overview",
  },
  {
    title: "Development",
    icon: "/img/code-bracket-square.svg",
    href: "/docs/development/overview",
  },
  {
    title: "Security",
    icon: "/img/key.svg",
    href: "/docs/security/overview",
  },
  {
    title: "Testing",
    icon: "/img/bug-ant.svg",
    href: "/docs/testing/overview",
  },
];

export default function CategoryCards(): ReactNode {
  return (
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
  );
}
