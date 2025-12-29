"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Group, Mesh } from "three";
import { Suspense, useRef, useEffect, RefObject } from "react";
import { ContactShadows } from "@react-three/drei";
import { KeyboardModels } from "./KeyboardModels";
import { useKeyboardScroll } from "./useKeyboardScroll";

function SceneContent() {
  const { camera } = useThree();
  const cameraRef = useRef<PerspectiveCamera>(camera as PerspectiveCamera);
  const fullRef = useRef<Group>(null);
  const keysRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const pcbBaseRef = useRef<Group>(null);

  // Ensure camera is PerspectiveCamera and set initial position
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      cameraRef.current = camera;
      camera.position.set(0, 0, 5);
      cameraRef.current.fov = 50;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Initialize materials with transparency
  useFrame(() => {
    const setupMaterial = (group: Group | null, defaultOpacity: number) => {
      if (!group) return;
      group.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).material) {
          const material = (child as Mesh).material;
          if (!Array.isArray(material) && !material.transparent) {
            material.transparent = true;
            material.opacity = defaultOpacity;
          }
        }
      });
    };

    setupMaterial(fullRef.current, 1);
    setupMaterial(keysRef.current, 0);
    setupMaterial(innerRef.current, 0);
    setupMaterial(pcbBaseRef.current, 0);
  });

  // Setup scroll-controlled animations
  useKeyboardScroll({
    camera: cameraRef,
    fullRef: fullRef as RefObject<Group>,
    keysRef: keysRef as RefObject<Group>,
    innerRef: innerRef as RefObject<Group>,
    pcbBaseRef: pcbBaseRef as RefObject<Group>,
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={0.5} />
      
      <KeyboardModels
        fullRef={fullRef as RefObject<Group>}
        keysRef={keysRef as RefObject<Group>}
        innerRef={innerRef as RefObject<Group>  }
        pcbBaseRef={pcbBaseRef as RefObject<Group>}
      />
      
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4.5}
      />
    </>
  );
}

export function KeyboardScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="bg-linear-to-b from-zinc-900 to-black"
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

