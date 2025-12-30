"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Group, PerspectiveCamera } from "three";

gsap.registerPlugin(ScrollTrigger);

interface UseKeyboardScrollProps {
  camera: React.RefObject<PerspectiveCamera>;
  fullRef: React.RefObject<Group>;
  keysRef: React.RefObject<Group>;
  innerRef: React.RefObject<Group>;
  pcbBaseRef: React.RefObject<Group>;
}

// Helper function to set material opacity on all meshes in a group
function setGroupOpacity(group: Group | null, opacity: number) {
  if (!group) return;
  group.traverse((child) => {
    if ((child as any).isMesh && (child as any).material) {
      (child as any).material.opacity = opacity;
    }
  });
}

// Create a simple proxy object for GSAP to animate material opacity
function createOpacityProxy(group: Group | null, initialOpacity: number = 0) {
  const proxy = { value: initialOpacity };
  if (group) {
    // Set initial opacity
    setGroupOpacity(group, initialOpacity);
  }
  return proxy;
}

export function useKeyboardScroll({
  camera,
  fullRef,
  keysRef,
  innerRef,
  pcbBaseRef,
}: UseKeyboardScrollProps) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!camera.current) return;

    const ctx = gsap.context(() => {
      // Wait a bit for DOM and models to be ready
      setTimeout(() => {
        // Get the scroll container element for custom scroller
        const scrollContainer = document.querySelector(".scroll-container") as HTMLElement;
        
        if (!scrollContainer) {
          console.warn("Scroll container not found, animations may not work correctly");
          return;
        }

        // Initial camera setup - use current camera position
        const initialCameraPos = { x: -0.019, y: 2.690, z: 1.624 };
        const initialCameraRot = { x: -1.175, y: -0.007, z: -0.016 };

        camera.current!.position.set(
          initialCameraPos.x,
          initialCameraPos.y,
          initialCameraPos.z
        );
        camera.current!.rotation.set(
          initialCameraRot.x,
          initialCameraRot.y,
          initialCameraRot.z
        );
        camera.current!.lookAt(0, 0.1, 0.1);
        camera.current!.updateProjectionMatrix();

        // Set initial model positions to match KeyboardModels.tsx
        if (keysRef.current) {
          keysRef.current.position.set(0, 0, 0.8);
          keysRef.current.scale.set(0.02, 0.02, 0.02);
          keysRef.current.rotation.set(1.3, 0, 0);
        }
        if (innerRef.current) {
          innerRef.current.position.set(0, 0, 0.5);
          innerRef.current.scale.set(0.02, 0.02, 0.02);
          innerRef.current.rotation.set(1.3, 0, 0);
        }
        if (pcbBaseRef.current) {
          pcbBaseRef.current.position.set(0, -0.2, 0.55);
          pcbBaseRef.current.scale.set(0.02, 0.02, 0.02);
          pcbBaseRef.current.rotation.set(0.001, 0, 0);
        }

        // Create opacity proxies for material animation
        // All models start visible (opacity 1) since they're assembled
        const keysOpacityProxy = createOpacityProxy(keysRef.current, 1);
        const innerOpacityProxy = createOpacityProxy(innerRef.current, 1);
        const pcbBaseOpacityProxy = createOpacityProxy(pcbBaseRef.current, 1);

        // Section 1: Hero - Keep camera steady, all models visible
        const section1 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-1",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

        section1
          .to(camera.current.position, {
            x: initialCameraPos.x,
            y: initialCameraPos.y,
            z: initialCameraPos.z,
            duration: 0.1,
          })
          .to(
            camera.current.rotation,
            {
              x: initialCameraRot.x,
              y: initialCameraRot.y,
              z: initialCameraRot.z,
              duration: 0.1,
            },
            0
          )
          // Ensure all models are visible and at correct positions
          .to(
            keysRef.current.position,
            {
              x: 0, y: 0, z: 0.8, duration: 0.1,
            }, 0
          )
          .to(
            keysRef.current.scale,
            {
              x: 0.02, y: 0.02, z: 0.02, duration: 0.1,
            }, 0
          )
          .to(
            innerRef.current.position,
            {
              x: 0, y: 0, z: 0.5, duration: 0.1,
            }, 0
          )
          .to(
            pcbBaseRef.current.position,
            {
              x: 0, y: -0.2, z: 0.55, duration: 0.1,
            }, 0
          )
          .to(
            keysOpacityProxy,
            {
              value: 1, duration: 0.1, onUpdate: () => setGroupOpacity(keysRef.current, keysOpacityProxy.value),
            }, 0
          )
          .to(
            innerOpacityProxy,
            {
              value: 1, duration: 0.1, onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
            }, 0
          )
          .to(
            pcbBaseOpacityProxy,
            {
              value: 1, duration: 0.1, onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
            }, 0
          );

        // Transition: Section 1 to Section 2 (separation animation)
        const transition1to2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-1",
            start: "bottom top",
            end: "bottom center",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

        transition1to2
          // Inner layer moves outward (left) and fades out
          .to(
            innerRef.current.position,
            {
              x: -2, y: 0, z: 0.5, duration: 1, ease: "power2.out",
            }, 0
          )
          .to(
            innerOpacityProxy,
            {
              value: 0, duration: 1, ease: "power2.out", onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
            }, 0
          )
          // PCB Base moves outward (right) and fades out
          .to(
            pcbBaseRef.current.position,
            {
              x: 2, y: -0.2, z: 0.55, duration: 1, ease: "power2.out",
            }, 0
          )
          .to(
            pcbBaseOpacityProxy,
            {
              value: 0, duration: 1, ease: "power2.out", onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
            }, 0
          )
          // Keys stay visible, scale up and move forward
          .to(
            keysRef.current.position,
            {
              x: 0, y: 0, z: 0.3, duration: 1, ease: "power2.out", // Move forward (closer to camera)
            }, 0
          )
          .to(
            keysRef.current.scale,
            {
              x: 0.03, y: 0.03, z: 0.03, duration: 1, ease: "power2.out", // Scale up from 0.02 to 0.03 (50% larger)
            }, 0
          )
          // Camera zooms in on keycaps
          .to(
            camera.current.position,
            {
              x: -0.019, y: 0.3, z: -2, duration: 1, ease: "power2.out", // Move closer
            }, 0
          )
          .to(
            camera.current.rotation,
            {
              x: -0.1, y: -0.007, z: -0.016, duration: 1, ease: "power2.out", // Adjust rotation to look at keycaps
            }, 0
          );

        // Section 2: Keycaps Focus (only keycaps visible, scaled up)
        const section2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-2",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

        // Maintain keycaps focus state
        section2
          .to(keysRef.current.position, {
            x: 0, y: 0, z: 0.3, duration: 1,
          })
          .to(
            keysRef.current.scale,
            {
              x: 0.03, y: 0.03, z: 0.03, duration: 1,
            }, 0
          )
          .to(
            camera.current.position,
            {
              x: -0.019, y: 0.3, z: -2, duration: 1,
            }, 0
          )
          .to(
            camera.current.rotation,
            {
              x: -0.1, y: -0.007, z: -0.016, duration: 1,
            }, 0
          )
          .to(
            keysOpacityProxy,
            {
              value: 1, duration: 0.1, onUpdate: () => setGroupOpacity(keysRef.current, keysOpacityProxy.value),
            }, 0
          )
          .to(
            innerOpacityProxy,
            {
              value: 0, duration: 0.1, onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
            }, 0
          )
          .to(
            pcbBaseOpacityProxy,
            {
              value: 0, duration: 0.1, onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
            }, 0
          );

        // Section 3: Internal Layout - Exploded Start
        const section3 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-3",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

      // Gradual separation - starts at section start, completes at midpoint
      section3
        .to(
          keysRef.current.position,
          {
            y: 1.5,
            x: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          innerRef.current.position,
          {
            y: 0,
            x: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          pcbBaseRef.current.position,
          {
            y: -1.5,
            x: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          camera.current.position,
          {
            z: 4,
            y: 0,
            x: 0,
            duration: 1,
          },
          0
        )
        .to(
          camera.current.rotation,
          {
            x: -0.15,
            y: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          keysOpacityProxy,
          {
            value: 1,
            duration: 0.3,
            onUpdate: () => setGroupOpacity(keysRef.current, keysOpacityProxy.value),
          },
          0
        )
        .to(
          keysRef.current.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
          },
          0
        )
        .to(
          innerOpacityProxy,
          {
            value: 1,
            duration: 0.3,
            onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
          },
          0
        )
        .to(
          pcbBaseOpacityProxy,
          {
            value: 1,
            duration: 0.3,
            onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
          },
          0
        );

        // Section 4: Fully Exploded
        const section4 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-4",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

      // Further separation and camera orbit
      section4
        .to(
          keysRef.current.position,
          {
            y: 2.5,
            x: 0,
            z: 0.5,
            duration: 1,
          },
          0
        )
        .to(
          innerRef.current.position,
          {
            y: 0,
            x: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          pcbBaseRef.current.position,
          {
            y: -2.5,
            x: 0,
            z: -0.5,
            duration: 1,
          },
          0
        )
        .to(
          camera.current.position,
          {
            z: 5,
            y: 0.5,
            x: 0.8,
            duration: 1,
          },
          0
        )
        .to(
          camera.current.rotation,
          {
            x: -0.1,
            y: 0.2,
            z: 0,
            duration: 1,
          },
          0
        );

        // Section 5: Reassemble
        const section5 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-5",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

      section5
        .to(
          keysRef.current.position,
          {
            y: 0,
            x: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          innerRef.current.position,
          {
            y: 0,
            x: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          pcbBaseRef.current.position,
          {
            y: 0,
            x: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          camera.current.position,
          {
            z: 5,
            y: 0,
            x: 0,
            duration: 1,
          },
          0
        )
        .to(
          camera.current.rotation,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          keysOpacityProxy,
          {
            value: 0,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(keysRef.current, keysOpacityProxy.value),
          },
          0.5
        )
        .to(
          innerOpacityProxy,
          {
            value: 0,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
          },
          0.5
        )
        .to(
          pcbBaseOpacityProxy,
          {
            value: 0,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
          },
          0.5
        );

        timelineRef.current = section1;
      }, 200); // Small delay to ensure DOM and models are ready
    });

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [camera, fullRef, keysRef, innerRef, pcbBaseRef]);
}

