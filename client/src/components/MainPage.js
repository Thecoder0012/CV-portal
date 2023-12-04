import React, { useEffect, useRef } from 'react';
import { NavigationBar } from './NavigationBar';
import main from '../styles/mainPage.module.css';
import videoSrc from '../videoplayback.mp4';

export const MainPage = () => {
  const accentureFactsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(main.show);
          } else {
            entry.target.classList.remove(main.show);
          }
        });
      },
      { threshold: 0.3 }
    );

    const accentureFacts = accentureFactsRef.current;

    if (accentureFacts) {
      observer.observe(accentureFacts);
    }

    return () => {
      if (accentureFacts) {
        observer.unobserve(accentureFacts);
      }
    };
  }, []);

  return (
    <div>
      <NavigationBar className={main.NavBar} />
      <div className={main.mainDiv}>
        <video autoPlay loop muted className={main.backgroundVideo}>
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className={main.content}></div>
      </div>

      <div ref={accentureFactsRef} className={`${main.AccentureFacts}`}>
        <h2>About Accenture</h2>
        <div className={main.factBox}>
          <div className={main.fact1}>
            <h4>Services</h4>
            <p>• Helping clients navigate the challenges of the digital age and implement innovative solutions.</p>
            <p>• Providing a wide array of services, including consulting, strategy, digital transformation, technology services, and outsourcing.</p>
          </div>
          <div className={main.fact2}>
            <h4>Founding and Establishment</h4>
            <p>• Founded as Andersen Consulting in 1989.</p>
            <p>• Separated from the accounting firm Arthur Andersen.</p>
            <p>• Name changed to Accenture in 2001.</p>
          </div>
        </div>
        <div className={main.fact3}>
          <h4>Global Presence</h4>
          <p>• Operates in more than 200 cities across 51 countries.</p>
          <p>• Employs over 500K people worldwide.</p>
          <p>• Serves clients in various industries globally.</p>
        </div>
      </div>
    </div>
  );
};
