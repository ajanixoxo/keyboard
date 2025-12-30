"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ModelConnectorProps {
  modelRef: React.RefObject<THREE.Group>;
  labelRef: React.RefObject<HTMLElement>;
  camera: THREE.PerspectiveCamera | null;
  canvas: HTMLCanvasElement | null;
}

export function ModelConnector({
  modelRef,
  labelRef,
  camera,
  canvas,
}: ModelConnectorProps) {
  const lineRef = useRef<SVGLineElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!camera || !canvas || !modelRef.current || !labelRef.current) return;

    const updateLine = () => {
      if (!modelRef.current || !labelRef.current || !camera || !canvas) return;

      // Get 3D world position of the model
      const worldPosition = new THREE.Vector3();
      modelRef.current.getWorldPosition(worldPosition);

      // Project 3D position to 2D screen coordinates
      const vector = worldPosition.project(camera);

      // Convert normalized device coordinates to screen coordinates
      const canvasRect = canvas.getBoundingClientRect();
      const x = (vector.x * 0.5 + 0.5) * canvasRect.width;
      const y = (-vector.y * 0.5 + 0.5) * canvasRect.height;

      // Get label position
      const labelRect = labelRef.current.getBoundingClientRect();
      const labelX = labelRect.left + labelRect.width / 2;
      const labelY = labelRect.top + labelRect.height / 2;

      // Update SVG line
      if (lineRef.current) {
        lineRef.current.setAttribute("x1", x.toString());
        lineRef.current.setAttribute("y1", y.toString());
        lineRef.current.setAttribute("x2", labelX.toString());
        lineRef.current.setAttribute("y2", labelY.toString());
        lineRef.current.style.opacity = isVisible ? "1" : "0";
      }
    };

    // Check if section 3 is visible
    const checkVisibility = () => {
      const section3 = document.querySelector(".section-3");
      if (section3) {
        const rect = section3.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(isInView);
      }
    };

    // Update on scroll and resize
    const handleUpdate = () => {
      checkVisibility();
      updateLine();
    };

    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);
    
    // Use requestAnimationFrame for smooth updates
    let animationFrame: number;
    const animate = () => {
      updateLine();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    // Initial update
    checkVisibility();
    updateLine();

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      cancelAnimationFrame(animationFrame);
    };
  }, [camera, canvas, modelRef, labelRef, isVisible]);

  return (
    <line
      ref={lineRef}
      x1="0"
      y1="0"
      x2="0"
      y2="0"
      stroke="rgb(148, 163, 184)"
      strokeWidth="1.5"
      strokeDasharray="4,4"
      opacity="0"
      className="pointer-events-none"
    />
  );
}

