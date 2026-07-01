'use client';

import { useEffect } from 'react';

export function useScrollReveal(selector = '.scroll-reveal') {
  useEffect(() => {
    let observer: IntersectionObserver;

    const setup = () => {
      const elements = document.querySelectorAll(selector);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: '60px 0px 60px 0px' }
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 60) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    const rafId = requestAnimationFrame(setup);

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);
}
