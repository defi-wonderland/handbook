import styles from "./styles.module.css";
import { ReactNode } from "react";

export interface IlustrationsContainerProps {
  coneImage: string;
  sphereImage: string;
  ringImage: string;
}

export default function IlustrationsContainer({
  coneImage,
  sphereImage,
  ringImage,
}: IlustrationsContainerProps): ReactNode {
  return (
    <div className={styles.illustrationsContainer}>
      <img
        src={coneImage}
        alt="Cone illustration"
        className={styles.coneIllustration}
      />
      <img
        src={sphereImage}
        alt="Sphere illustration"
        className={styles.sphereIllustration}
      />
      <img
        src={ringImage}
        alt="Ring illustration"
        className={styles.ringIllustration}
      />
    </div>
  );
}
