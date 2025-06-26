import styles from "./styles.module.css";
import { ReactNode } from "react";

export default function NoiseBackground(): ReactNode {
  return (
    <div className={styles.noiseTexture}>
      <svg
        width="500"
        height="500"
        xmlns="http://www.w3.org/2000/svg"
        id="noise"
      >
        <filter id="noiseFilter">
          <feFlood flood-color="#777" result="background" />
          <feTurbulence
            type="turbulence"
            baseFrequency="0.9"
            numOctaves="5"
            seed="2"
            result="darkNoiseRaw"
          />
          <feColorMatrix
            in="darkNoiseRaw"
            type="saturate"
            values="0"
            result="darkNoiseGray"
          />
          <feComponentTransfer in="darkNoiseGray" result="darkNoise">
            <feFuncR type="linear" slope="2" intercept="-0.5" />
            <feFuncG type="linear" slope="2" intercept="-0.5" />
            <feFuncB type="linear" slope="2" intercept="-0.5" />
          </feComponentTransfer>
          <feTurbulence
            type="turbulence"
            baseFrequency="0.9"
            numOctaves="5"
            seed="5"
            result="lightNoiseRaw"
          />
          <feColorMatrix
            in="lightNoiseRaw"
            type="saturate"
            values="0"
            result="lightNoiseGray"
          />
          <feComponentTransfer in="lightNoiseGray" result="lightNoise">
            <feFuncR type="linear" slope="-2" intercept="1.5" />
            <feFuncG type="linear" slope="-2" intercept="1.5" />
            <feFuncB type="linear" slope="-2" intercept="1.5" />
          </feComponentTransfer>
          <feBlend
            mode="multiply"
            in="background"
            in2="darkNoise"
            result="darkMix"
          />
          <feBlend
            mode="screen"
            in="darkMix"
            in2="lightNoise"
            result="finalNoise"
          />
        </filter>

        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
