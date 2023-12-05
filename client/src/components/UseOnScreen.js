import { useEffect, useState, useRef } from "react";
import main from "../styles/mainPage.module.css";
export function useOnScreen(ref) {
  const [isOnScreen, setIsOnScreen] = useState(false);

  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(main.show);
        } else {
          entry.target.classList.remove(main.show);
        }

        setIsOnScreen(entry.isIntersecting);
      },
      { threshold: 0.5, rootMargin: "0% 0% 45% 0%", root: null }
    );
  }, []);

  useEffect(() => {
    observerRef.current.observe(ref.current);
    return () => {
      observerRef.current.disconnect();
    };
  }, [ref]);

  return isOnScreen;
}
