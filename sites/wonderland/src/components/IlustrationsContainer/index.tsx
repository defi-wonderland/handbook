import styles from "./styles.module.css";
import { ReactNode } from "react";

export default function IlustrationsContainer(): ReactNode {
  return (
    <div className={styles.illustrationsContainer}>
      <img
        src="/img/cone.png"
        alt="Cone illustration"
        className={styles.coneIllustration}
      />
      <img
        src="/img/sphere.png"
        alt="Sphere illustration"
        className={styles.sphereIllustration}
      />
      <img
        src="/img/ring.png"
        alt="Ring illustration"
        className={styles.ringIllustration}
      />
    </div>
  );
}
