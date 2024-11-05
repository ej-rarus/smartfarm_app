import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollMagic from 'scrollmagic';

export default function AnimatedComponent() {
  const sectionRef = useRef(null);
  const controllerRef = useRef(null);

  useEffect(() => {
    const tween = gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    controllerRef.current = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
      triggerElement: sectionRef.current,
      triggerHook: 0.8,
    })
      .setTween(tween)
      .addTo(controllerRef.current);

    return () => {
      controllerRef.current?.destroy(true);
    };
  }, []);

  return (
    <div ref={sectionRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
      <h1>Scroll to Animate</h1>
      <p>This section will fade in and move up as you scroll down.</p>
    </div>
  );
}
