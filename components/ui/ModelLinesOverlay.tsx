"use client";

import { useEffect, useState } from "react";
import { useKeyboardContext } from "@/components/three/KeyboardContext";
import * as THREE from "three";

export function ModelLinesOverlay() {
  const { keysRef, innerRef, pcbBaseRef, camera, gl } = useKeyboardContext();
  const [lines, setLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!camera || !gl?.domElement) return;

    const updateLines = () => {
      // Check if section 3 is visible
      const section3 = document.querySelector(".section-3");
      if (!section3) {
        setIsVisible(false);
        setLines([]);
        return;
      }

      const rect = section3.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if section 3 is fully/completely in view
      // Show lines when section 3 is mostly visible (at least 80% in viewport)
      const sectionHeight = rect.height;
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visiblePercentage = visibleHeight / sectionHeight;
      
      // Also check that section is properly positioned (not just starting to enter)
      const isFullyInView = 
        visiblePercentage >= 0.8 && // At least 80% visible
        rect.top <= 100 && // Top is near or above viewport top
        rect.bottom >= viewportHeight - 100; // Bottom is near or below viewport bottom
      
      setIsVisible(isFullyInView);

      if (!isFullyInView) {
        setLines([]);
        return;
      }

      const newLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
      const canvasRect = gl.domElement.getBoundingClientRect();

      // Get label positions
      const labels = document.querySelectorAll(".part-label");
      
      // Map models to labels: keys (0), inner (1), pcb (2)
      const modelRefs = [keysRef, innerRef, pcbBaseRef];

      modelRefs.forEach((modelRef, index) => {
        if (!modelRef.current || !labels[index]) return;

        // Get 3D world position
        const worldPosition = new THREE.Vector3();
        modelRef.current.getWorldPosition(worldPosition);

        // Project to 2D
        const vector = worldPosition.project(camera);
        const x1 = (vector.x * 0.5 + 0.5) * canvasRect.width + canvasRect.left;
        const y1 = (-vector.y * 0.5 + 0.5) * canvasRect.height + canvasRect.top;

        // Get label position
        const labelRect = labels[index].getBoundingClientRect();
        const x2 = labelRect.left + labelRect.width / 2;
        const y2 = labelRect.top + labelRect.height / 2;

        newLines.push({ x1, y1, x2, y2 });
      });

      setLines(newLines);
    };

    const handleUpdate = () => {
      updateLines();
    };

    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);
    
    let animationFrame: number;
    const animate = () => {
      updateLines();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    updateLines();

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      cancelAnimationFrame(animationFrame);
    };
  }, [camera, gl, keysRef, innerRef, pcbBaseRef, isVisible]);

  if (!isVisible || lines.length === 0) return null;

  return (
    <svg
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: "100vw", height: "100vh" }}
    >
      {lines.map((line, index) => (
        <line
          key={index}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="rgb(148, 163, 184)"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

