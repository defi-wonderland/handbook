import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const generateStars = (stars: number) => {
  const width = 4000;
  const height = 2000;

  let shadows = `${getRandomInt(width)}px ${getRandomInt(height)}px #fff`;
  for (let index = 0; index < stars; index++) {
    shadows = `${shadows}, ${getRandomInt(width)}px ${getRandomInt(height)}px #fff`;
  }
  return shadows;
};

interface BackgroundProps {
  zIndex?: number;
}

export default function StarsBackground({ zIndex }: BackgroundProps) {
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowBackground(true);
    });
  }, []);

  const containerStyle = {
    '--z-index': zIndex || 0,
  } as React.CSSProperties;

  return (
    <>
      {showBackground && (
        <div 
          className={styles.starsContainer} 
          style={containerStyle}
        >
          <div 
            className={styles.stars}
            style={{
              boxShadow: generateStars(700),
              animationDuration: `${getRandomInt(2000) + 1000}ms`
            }}
          ></div>
          <div 
            className={styles.stars1}
            style={{
              boxShadow: generateStars(700),
              animationDuration: `${getRandomInt(2000) + 1000}ms`
            }}
          ></div>
          <div 
            className={styles.stars2}
            style={{
              boxShadow: generateStars(700),
              animationDuration: `${getRandomInt(2000) + 1000}ms`
            }}
          ></div>
          <div 
            className={styles.stars3}
            style={{
              boxShadow: generateStars(700),
              animationDuration: `${getRandomInt(2000) + 1000}ms`
            }}
          ></div>
          <div 
            className={styles.stars4}
            style={{
              boxShadow: generateStars(700),
              animationDuration: `${getRandomInt(2000) + 1000}ms`
            }}
          ></div>
          <div 
            className={styles.stars5}
            style={{ boxShadow: generateStars(700) }}
          ></div>
          <div 
            className={styles.stars6}
            style={{ boxShadow: generateStars(50) }}
          ></div>
        </div>
      )}
    </>
  );
}
