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
      // Initial camera setup
      const initialCameraPos = { x: 0, y: 0, z: 5 };
      const initialCameraRot = { x: 0, y: 0, z: 0 };

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

      // Create opacity proxies for material animation (used across multiple sections)
      const fullOpacityProxy = createOpacityProxy(fullRef.current, 1);
      const keysOpacityProxy = createOpacityProxy(keysRef.current, 0);
      const innerOpacityProxy = createOpacityProxy(innerRef.current, 0);
      const pcbBaseOpacityProxy = createOpacityProxy(pcbBaseRef.current, 0);

      // Create master timeline
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: false,
        },
      });

      // Section 1: Hero (0% - 20% of scroll)
      const section1 = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-1",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      section1
        .fromTo(
          camera.current.position,
          { z: 6, y: 0, x: 0 },
          { z: 5, y: 0, x: 0, duration: 1 }
        )
        .fromTo(
          camera.current.rotation,
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 0, duration: 1 },
          0
        );

      // Section 2: Keys Focus (20% - 40% of scroll)
      const section2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-2",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      section2
        .to(camera.current.position, {
          z: 3,
          y: 0.5,
          x: 0,
          duration: 1,
        })
        .to(
          camera.current.rotation,
          {
            x: -0.1,
            y: 0,
            z: 0,
            duration: 1,
          },
          0
        )
        .to(
          fullOpacityProxy,
          {
            value: 0.3,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(fullRef.current, fullOpacityProxy.value),
          },
          0
        )
        .to(
          keysOpacityProxy,
          {
            value: 1,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(keysRef.current, keysOpacityProxy.value),
          },
          0
        )
        .to(
          keysRef.current.scale,
          {
            x: 1.1,
            y: 1.1,
            z: 1.1,
            duration: 0.5,
          },
          0
        )
        .to(
          innerOpacityProxy,
          {
            value: 0.2,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(innerRef.current, innerOpacityProxy.value),
          },
          0
        )
        .to(
          pcbBaseOpacityProxy,
          {
            value: 0.2,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(pcbBaseRef.current, pcbBaseOpacityProxy.value),
          },
          0
        );

      // Section 3: Internal Layout - Exploded Start (40% - 60% of scroll)
      const section3 = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-3",
          start: "top top",
          end: "bottom top",
          scrub: 1,
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
          fullOpacityProxy,
          {
            value: 0,
            duration: 0.3,
            onUpdate: () => setGroupOpacity(fullRef.current, fullOpacityProxy.value),
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

      // Section 4: Fully Exploded (60% - 80% of scroll)
      const section4 = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-4",
          start: "top top",
          end: "bottom top",
          scrub: 1,
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

      // Section 5: Reassemble (80% - 100% of scroll)
      const section5 = gsap.timeline({
        scrollTrigger: {
          trigger: ".section-5",
          start: "top top",
          end: "bottom top",
          scrub: 1,
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
          fullOpacityProxy,
          {
            value: 1,
            duration: 0.5,
            onUpdate: () => setGroupOpacity(fullRef.current, fullOpacityProxy.value),
          },
          0.5
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

      timelineRef.current = masterTimeline;
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

