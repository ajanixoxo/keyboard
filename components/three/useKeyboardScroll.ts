"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Group, Mesh, PerspectiveCamera } from "three";

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
    if ((child as Mesh).isMesh && (child as Mesh).material) {
      (child as Mesh).material.opacity = opacity as number;
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
          keysRef.current.position.set(0, 0, 0.5);
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
            start: "center center",
            end: "center center",
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
              x: 0, y: 0, z: 0.5, duration: 0.1,
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
        // This happens as user scrolls from section 1 into section 2
        const transition1to2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-2",
            start: "top bottom", // Start when section 2 enters viewport
            end: "center center", // Complete when section 2 reaches top
            scrub: 1,
            scroller: scrollContainer,
          },
        });

        transition1to2
          // Inner layer moves outward (left) horizontally and fades out
          .to(
            innerRef.current.position,
            {
              x: 0, y: -4, z: 0.5, duration: 1, ease: "power2.out", // Move further left
            }, 0
          )
          .to(
            innerOpacityProxy,
            {
              value: 0, duration: 1, ease: "power2.out", onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
            }, 0
          )
          // PCB Base moves outward (right) horizontally and fades out
          .to(
            pcbBaseRef.current.position,
            {
              x: -0.2, y: 0, z: -4, duration: 1, ease: "power2.out", // Move further right
            }, 0
          )
          .to(
            pcbBaseOpacityProxy,
            {
              value: 0, duration: 1, ease: "power2.out", onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
            }, 0
          )
          // Keys stay in same X/Y position but move closer to camera and rotate to face up (top view)
          .to(
            keysRef.current.position,
            {
              x: 0, y: 0, z: 0.08, duration: 1, ease: "power2.out", // Move closer to camera
            }, 0
          )
         
          .to(
            keysRef.current.scale,
            {
              x: 0.065, y: 0.065, z: 0.065, duration: 1, ease: "power2.out", // Scale up more (75% larger)
            }, 0
          )
          // Camera moves to desired position for section 2
          .to(
            camera.current.position,
            {
              x: -0.1158, y: 1.5606, z: 3.7654, duration: 1, ease: "power2.out", // Position camera at desired view
            }, 0
          )
          .to(
            camera.current.rotation,
            {
              x: -0.3792, y: -0.02293, z: -0.0117, duration: 1, ease: "power2.out", // Set camera rotation
            }, 0
          )
          .to(
            camera.current,
            {
              onUpdate: function() {
                camera.current!.lookAt(0, 0.1, 0.1); // Look at the target position
              },
              duration: 1, ease: "power2.out",
            }, 0
          );

        // Section 2: Keycaps Focus (only keycaps visible, scaled up, top view)
        const section2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-2",
            start: "center center",
            end: "center center",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

        // Maintain keycaps focus state with top view (matches transition end positions)
        section2
          .to(keysRef.current.position, {
            x: 0, y: 0, z: -0.2, duration: 1, // Keep keys close to camera
          })
          .to(
            keysRef.current.rotation,
            {
              x: 2, y: 0, z: 0, duration: 1, // Keep keys facing up (top view)
            }, 0
          )
          .to(
            keysRef.current.scale,
            {
              x: 0.035, y: 0.035, z: 0.035, duration: 1, // Keep keys scaled up
            }, 0
          )
          .to(
            camera.current.position,
            {
              x: -0.0078, y: 1.0755, z: 2.8328, duration: 1, // Keep camera at desired position
            }, 0
          )
          .to(
            camera.current.rotation,
            {
              x: -0.3429, y: -0.0027, z: -0.0010, duration: 1, // Keep camera rotation
            }, 0
          )
          .to(
            camera.current,
            {
              onUpdate: function() {
                camera.current!.lookAt(0, 0.1, 0.1); // Keep looking at target position
              },
              duration: 1,
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

        // Transition: Section 2 to Section 3 (bring back inner and PCB, stack with gaps)
        const transition2to3 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-3",
            start: "top bottom", // Start when section 3 enters viewport
            end: "top top", // Complete when section 3 reaches top
            scrub: 1,
            scroller: scrollContainer,
          },
        });

        transition2to3
          // Inner layer moves back to center and fades in
          .to(
            innerRef.current.position,
            {
              x: 0, y: 0.3, z: 0.5, duration: 1, ease: "power2.out", // Move to center with gap above
            }, 0
          )
          .to(
            innerOpacityProxy,
            {
              value: 1, duration: 1, ease: "power2.out", onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
            }, 0
          )
          // PCB Base moves back to center and fades in
          .to(
            pcbBaseRef.current.position,
            {
              x: 0, y: -0.3, z: 0.55, duration: 1, ease: "power2.out", // Move to center with gap below
            }, 0
          )
          .to(
            pcbBaseOpacityProxy,
            {
              value: 1, duration: 1, ease: "power2.out", onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
            }, 0
          )
          // Keys move up slightly to create gap and scale down to match other models
          .to(
            keysRef.current.position,
            {
              x: 0, y: 0.6, z: 0.5, duration: 1, ease: "power2.out", // Move up to create gap
            }, 0
          )
          .to(
            keysRef.current.rotation,
            {
              x: 1.3, y: 0, z: 0, duration: 1, ease: "power2.out", // Keep keys rotation
            }, 0
          )
          .to(
            keysRef.current.scale,
            {
              x: 0.02, y: 0.02, z: 0.02, duration: 1, ease: "power2.out", // Scale down to match inner and PCB
            }, 0
          )
          // Camera adjusts to show all three layers
          .to(
            camera.current.position,
            {
              x: -0.1158, y: 1.8, z: 3.7654, duration: 1, ease: "power2.out", // Move camera back to see all layers
            }, 0
          )
          .to(
            camera.current.rotation,
            {
              x: -0.3792, y: -0.02293, z: -0.0117, duration: 1, ease: "power2.out", // Keep similar rotation
            }, 0
          )
          .to(
            camera.current,
            {
              onUpdate: function() {
                camera.current!.lookAt(0, 0.2, 0.1); // Look at center of stacked layers
              },
              duration: 1, ease: "power2.out",
            }, 0
          );

        // Section 3: Internal Layout - Stacked with gaps
        const section3 = gsap.timeline({
          scrollTrigger: {
            trigger: ".section-3",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            scroller: scrollContainer,
          },
        });

        // Maintain stacked state with gaps
        section3
          .to(
            keysRef.current.position,
            {
              x: 0, y: 0.6, z: 0.08, duration: 1, // Keys at top with gap
            }, 0
          )
          .to(
            keysRef.current.rotation,
            {
              x: 2, y: 0, z: 0, duration: 1, // Keep keys rotation
            }, 0
          )
          .to(
            keysRef.current.scale,
            {
              x: 0.02, y: 0.02, z: 0.02, duration: 1, // Keep keys scale matching other models
            }, 0
          )
          .to(
            innerRef.current.position,
            {
              x: 0, y: 0.3, z: 0.5, duration: 1, // Inner in middle with gap
            }, 0
          )
          .to(
            innerRef.current.rotation,
            {
              x: 1.3, y: 0, z: 0, duration: 1, // Keep inner rotation
            }, 0
          )
          .to(
            innerRef.current.scale,
            {
              x: 0.02, y: 0.02, z: 0.02, duration: 1, // Keep inner scale
            }, 0
          )
          .to(
            pcbBaseRef.current.position,
            {
              x: 0, y: -0.3, z: 0.55, duration: 1, // PCB at bottom with gap
            }, 0
          )
          .to(
            pcbBaseRef.current.rotation,
            {
              x: 0.001, y: 0, z: 0, duration: 1, // Keep PCB rotation
            }, 0
          )
          .to(
            pcbBaseRef.current.scale,
            {
              x: 0.02, y: 0.02, z: 0.02, duration: 1, // Keep PCB scale
            }, 0
          )
          .to(
            camera.current.position,
            {
              x: -0.1158, y: 1.8, z: 3.7654, duration: 1, // Keep camera position
            }, 0
          )
          .to(
            camera.current.rotation,
            {
              x: -0.3792, y: -0.02293, z: -0.0117, duration: 1, // Keep camera rotation
            }, 0
          )
          .to(
            camera.current,
            {
              onUpdate: function() {
                camera.current!.lookAt(0, 0.2, 0.1); // Keep looking at center
              },
              duration: 1,
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

