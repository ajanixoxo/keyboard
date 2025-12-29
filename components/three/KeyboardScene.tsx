"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Group } from "three";
import { Suspense, useRef, useEffect, RefObject } from "react";
import { ContactShadows } from "@react-three/drei";
import { KeyboardModels } from "./KeyboardModels";

function SceneContent() {
  const { camera } = useThree();
  const fullRef = useRef<Group>(null);

  // Ensure camera is PerspectiveCamera and set initial position
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.position.set(0, 1, 2);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <KeyboardModels
        fullRef={fullRef as RefObject<Group>}
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
        camera={{ position: [0, 1, 2], fov: 50 }}
        className="bg-linear-to-b from-zinc-900 to-black"
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

