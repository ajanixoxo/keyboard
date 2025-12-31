  /* eslint-disable @typescript-eslint/no-unused-vars */
  "use client";

  import * as THREE from "three";
import { useRef, useEffect, RefObject } from "react";
import { ContactShadows, useGLTF } from "@react-three/drei";

interface KeyboardModelsProps {
  fullRef: React.RefObject<THREE.Group>;
  keysRef: React.RefObject<THREE.Group>;
  innerRef: React.RefObject<THREE.Group>;
  pcbBaseRef: React.RefObject<THREE.Group>;
  scrollProgress?: number; // Optional, not used anymore (GSAP handles animations)
}

export function KeyboardModels({
  fullRef,
  keysRef,
  innerRef,
  pcbBaseRef,
  scrollProgress,
}: KeyboardModelsProps) {
  const keysModel = useGLTF("/keyboard_keys.glb");
  const innerModel = useGLTF("/keyboard_inner.glb");
  const pcbBaseModel = useGLTF("/keyboard_pcb_base.glb");

  // Material setup - ensure materials are transparent for opacity animation
  useEffect(() => {
    const setupMaterial = (group: THREE.Group | null) => {
      if (!group) return;
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
          const material = (child as THREE.Mesh).material;
          if (Array.isArray(material)) {
            material.forEach((mat) => {
              if (mat && !mat.transparent) {
                mat.transparent = true;
                mat.opacity = 1;
              }
            });
          } else if (material && !material.transparent) {
            material.transparent = true;
            material.opacity = 1;
          }
        }
      });
    };

    // Small delay to ensure models are loaded
    const timer = setTimeout(() => {
      setupMaterial(keysRef.current);
      setupMaterial(innerRef.current);
      setupMaterial(pcbBaseRef.current);
    }, 100);

    return () => clearTimeout(timer);
  }, [keysRef, innerRef, pcbBaseRef]);

  return (
    <>
      <primitive
        object={keysModel.scene}
        ref={keysRef}
        position={[0, 0, 0.5]}
        scale={0.02}
        rotation={[1.3, 0, 0]}
      />
      <primitive
        object={innerModel.scene}
        ref={innerRef}
        position={[0, 0, 0.5]}
        scale={0.02}
        rotation={[1.3, 0, 0]}
      />
      <primitive
        object={pcbBaseModel.scene}
        ref={pcbBaseRef}
        position={[0, -0.2, 0.55]}
        scale={0.02}
        rotation={[0.001, 0, 0]}
      />
    </>
  );
}

  // Preload models for better performance
  useGLTF.preload("/keyboard_keys.glb");
  useGLTF.preload("/keyboard_inner.glb");
  useGLTF.preload("/keyboard_pcb_base.glb");

