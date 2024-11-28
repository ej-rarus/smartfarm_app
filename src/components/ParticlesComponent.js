import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

function ParticlesComponent() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesConfig = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 1000
        }
      },
      color: {
        value: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]
      },
      shape: {
        type: ["circle", "square", "triangle"]
      },
      size: {
        value: 16,
        random: true,
        anim: {
          enable: true,
          speed: 10,
          size_min: 0.1,
          sync: false
        }
      },
      opacity: {
        value: 0.9,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: false
      },
      move: {
        enable: true,
        speed: 3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "bounce",
        bounce: true
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble"
        },
        onclick: {
          enable: true,
          mode: "push",
          quantity: 6
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 100,
          size: 12
        }
      }
    },
    retina_detect: true
  };

  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      height: "100%", 
      zIndex: -1, 
      pointerEvents: "none" 
    }}>
      <Particles
        init={particlesInit}
        options={particlesConfig}
      />
    </div>
  );
}

export default ParticlesComponent;
