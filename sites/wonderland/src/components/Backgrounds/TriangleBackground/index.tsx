import styles from "./styles.module.css";
import { ReactNode } from "react";

export default function TriangleBackground(): ReactNode {
  return (
    <div className={styles.triangleBackground}>
      <svg
        width="343"
        height="897"
        viewBox="0 0 343 897"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.triangleBackgroundSvg}
      >
        <path
          opacity="0.5"
          d="M171.5 0L0 897H343L171.5 0Z"
          fill="url(#paint0_linear_228_18031)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_228_18031"
            x1="154.842"
            y1="2.029e-06"
            x2="155.418"
            y2="897.024"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.09819" stop-color="#1C1A27" />
            <stop offset="0.301424" stop-color="#3C2986" />
            <stop offset="0.501195" stop-color="#1F55D5" />
            <stop offset="0.702149" stop-color="#E95B9B" />
            <stop offset="0.904241" stop-color="#FECC40" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
