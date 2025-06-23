import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import StarsBackground from '@site/src/components/StarsBackground';

const categories = [
  {
    title: 'Processes',
    icon: '/img/puzzle-piece.svg',
    href: '/docs/processes/overview',
  },
  {
    title: 'Development',
    icon: '/img/code-bracket-square.svg',
    href: '/docs/development/overview',
  },
  {
    title: 'Security',
    icon: '/img/key.svg',
    href: '/docs/security/overview',
  },
  {
    title: 'Testing',
    icon: '/img/bug-ant.svg',
    href: '/docs/testing/overview',
  },
];

function Home(): React.ReactElement {
  return (
    <Layout
      description="A curated guide to our best practices, processes, and technical insights.">
      <style>{`
        #__docusaurus {
          overflow: hidden;
        }
      `}</style>
      <main className={styles.main}>
        <div className={styles.centerContent}>
          <div className={styles.heroTitle}>
            <img src="/img/wonderland-handbook-title.svg" alt="Wonderland Handbook" className={styles.heroImage} />
          </div>
          <p className={styles.description}>
            At Wonderland, we believe that the ecosystem thrives on collaboration and shared knowledge. This handbook is our living repository: a curated guide to our best practices, processes, and technical insights.
          </p>
          <div className={styles.buttonContainer}>
            <Link to="/docs/intro/welcome" className={styles.buttonLink}>
              <img src="/img/enter-button.svg" alt="Go down the rabbit hole" className={styles.buttonImage} />
            </Link>
          </div>
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
        </div>
        <img src="/img/cone.png" alt="Cone illustration" className={styles.coneIllustration} />
        <img src="/img/sphere.png" alt="Sphere illustration" className={styles.sphereIllustration} />
        <img src="/img/ring.png" alt="Ring illustration" className={styles.ringIllustration} />
        <StarsBackground zIndex={1} />
        <div className={styles.triangleBackground}>
          <svg width="343" height="897" viewBox="0 0 343 897" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.triangleBackgroundSvg}>
          <path opacity="0.5" d="M171.5 0L0 897H343L171.5 0Z" fill="url(#paint0_linear_228_18031)"/>
          <defs>
          <linearGradient id="paint0_linear_228_18031" x1="154.842" y1="2.029e-06" x2="155.418" y2="897.024" gradientUnits="userSpaceOnUse">
          <stop offset="0.09819" stop-color="#1C1A27"/>
          <stop offset="0.301424" stop-color="#3C2986"/>
          <stop offset="0.501195" stop-color="#1F55D5"/>
          <stop offset="0.702149" stop-color="#E95B9B"/>
          <stop offset="0.904241" stop-color="#FECC40"/>
          </linearGradient>
          </defs>
          </svg>

        </div>
        <div className={styles.footerBackground}>
          <svg width="1135" height="637" viewBox="0 0 1135 637" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.footerBackgroundSvg}>
            <mask id="mask0_2003_2936" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="1135" height="637">
              <path d="M567.329 0C880.475 0 1134.33 253.855 1134.33 567C1134.33 590.701 1132.87 614.062 1130.05 637H4.61035C1.78624 614.062 0.329102 590.701 0.329102 567C0.329102 253.855 254.184 0 567.329 0Z" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_2003_2936)">
              <circle cx="607" cy="391" r="670" fill="#425BC6" />
              <path d="M531.172 420.499C568.464 547.421 506.147 708.161 580.241 734.474C658.644 762.318 654.983 619.071 728.178 522.034C784.334 447.585 881.328 461.374 884.775 432.214C888.262 402.707 850.856 229.15 802.508 151.828C756.463 78.188 862.404 13.5817 850.856 12.0196C839.307 10.4576 805.322 102.624 604.057 102.619C402.793 102.615 394.07 135.207 377.461 183.847C360.339 233.991 498.729 310.08 531.172 420.499Z" fill="black" />
              <path d="M17.5 137.5C14.5 3.5 126.5 -28 126.5 -28H-179V842.5C-179 842.5 76.5 936 73.5 842.5C70.5 749 189 639.5 195 477.5C201 315.5 20.5 271.5 17.5 137.5Z" fill="#FFD03C" />
              <path d="M195 190.5C192 56.5 466.5 -84 466.5 -84H-122.005L-122.005 857.505C-122.005 857.505 148.5 936 145.5 842.5C142.5 749 311 627 317 465C323 303 198 324.5 195 190.5Z" fill="#EA5D99" />
              <path d="M17.5 137.5C14.5 3.5 126.5 -28 126.5 -28H-179V842.5C-179 842.5 76.5 936 73.5 842.5C70.5 749 189 639.5 195 477.5C201 315.5 20.5 271.5 17.5 137.5Z" fill="#FFD03C" />
              <path d="M925.127 312C919.127 595.5 1127.63 599 1190.13 826.5C1252.63 1054 1221.14 -99.5 1221.14 -99.5C1221.14 -99.5 931.127 28.5 925.127 312Z" fill="#EA5D99" />
              <path d="M943.09 367.657C938.828 465.25 1086.94 466.455 1131.33 544.771C1175.73 623.087 1153.37 226 1153.37 226C1153.37 226 947.352 270.063 943.09 367.657Z" fill="#FECF3C" />
            </g>
          </svg>
        </div>
      </main>
      <div className={styles.noiseTexture}>
        <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg" id='noise'>
          <filter id="noiseFilter">
            <feFlood flood-color="#777" result="background" />
            <feTurbulence
              type="turbulence"
              baseFrequency="0.9"
              numOctaves="5"
              seed="2"
              result="darkNoiseRaw" />
            <feColorMatrix
              in="darkNoiseRaw"
              type="saturate"
              values="0"
              result="darkNoiseGray" />
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
              result="lightNoiseRaw" />
            <feColorMatrix
              in="lightNoiseRaw"
              type="saturate"
              values="0"
              result="lightNoiseGray" />
            <feComponentTransfer in="lightNoiseGray" result="lightNoise">
              <feFuncR type="linear" slope="-2" intercept="1.5" />
              <feFuncG type="linear" slope="-2" intercept="1.5" />
              <feFuncB type="linear" slope="-2" intercept="1.5" />
            </feComponentTransfer>
            <feBlend
              mode="multiply"
              in="background"
              in2="darkNoise"
              result="darkMix" />
            <feBlend
              mode="screen"
              in="darkMix"
              in2="lightNoise"
              result="finalNoise" />
          </filter>

          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </Layout>
  );
}

export default Home;
