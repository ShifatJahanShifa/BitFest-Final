// useScrollReveal.js
import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export const useScrollReveal = () => {
  useEffect(() => {
    // Initialize ScrollReveal for various effects
    const slideRight = {
      distance: '30px',
      origin: 'right',
      opacity: 0,
      duration: 1300,
      easing: 'ease-in-out',
      reset: true,
    };
    ScrollReveal().reveal('.slide-right', slideRight);

    const slideLeft = {
      distance: '30px',
      origin: 'left',
      opacity: 0,
      duration: 1000,
      easing: 'ease-in-out',
      reset: true,
    };
    ScrollReveal().reveal('.slide-left', slideLeft);

    const slideUp = {
      distance: '20px',
      origin: 'bottom',
      opacity: 0,
      duration: 800,
      easing: 'ease-in-out',
      reset: true,
    };
    ScrollReveal().reveal('.slide-up', slideUp);

    const fadeIn = {
      distance: '0px',
      opacity: 0,
      duration: 900,
      easing: 'ease-in-out',
      reset: true,
    };
    ScrollReveal().reveal('.fade-in', fadeIn);

    const slowFadeIn = {
      distance: '20px',
      opacity: 0,
      duration: 1300,
      easing: 'ease-in-out',
      reset: true,
    };
    ScrollReveal().reveal('.slow-fade-in', slowFadeIn);

    // Manual Scroll Event for Custom Fade-In/Out
    const revealElements = document.querySelectorAll(".fade-in-manual");
    const revealEffect = () => {
      revealElements.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
          el.classList.add("opacity-100", "transition-opacity", "duration-1000");
          el.classList.remove("opacity-0");
        } else {
          el.classList.add("opacity-0");
          el.classList.remove("opacity-100");
        }
      });
    };

    window.addEventListener("scroll", revealEffect);
    revealEffect(); // Trigger effect on initial load

    return () => {
      window.removeEventListener("scroll", revealEffect);
    };
  }, []);
};
