"use client";

import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense, useRef, useEffect, RefObject } from "react";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { KeyboardModels } from "./KeyboardModels";
import { useKeyboardScroll } from "./useKeyboardScroll";

function SceneContent() {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(camera as THREE.PerspectiveCamera);
  const fullRef = useRef<THREE.Group>(null);
  const keysRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const pcbBaseRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      cameraRef.current = camera;
      // Set camera to desired position from logged values
      camera.position.set(-0.019, 2.690, 1.624);
      camera.rotation.set(-1.175, -0.007, -0.016);
      // Center the keyboard in view - look at the keyboard center
      // Adjust Y value to center vertically, Z to center horizontally
      camera.lookAt(0, 0.1, 0.1); // Centered keyboard in viewport
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Setup scroll-controlled animations with GSAP
  useKeyboardScroll({
    camera: cameraRef,
    fullRef: fullRef as RefObject<THREE.Group>,
    keysRef: keysRef as RefObject<THREE.Group>,
    innerRef: innerRef as RefObject<THREE.Group>,
    pcbBaseRef: pcbBaseRef as RefObject<THREE.Group>,
  });


  return (
    <>
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={0.5}
        maxDistance={10}
        target={[0, 0.1, 0.1]}
        onChange={() => {
          // Log camera position and rotation whenever OrbitControls changes
          if (camera instanceof THREE.PerspectiveCamera) {
            console.log("=== CAMERA POSITION ===");
            console.log("Camera Position:", {
              x: camera.position.x.toFixed(4),
              y: camera.position.y.toFixed(4),
              z: camera.position.z.toFixed(4)
            });
            console.log("Camera Rotation:", {
              x: camera.rotation.x.toFixed(4),
              y: camera.rotation.y.toFixed(4),
              z: camera.rotation.z.toFixed(4)
            });
            console.log("Target:", {
              x: 0,
              y: 0.1,
              z: 0.1
            });
            console.log("======================");
          }
        }}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <KeyboardModels
        fullRef={fullRef as RefObject<THREE.Group>}
        keysRef={keysRef as RefObject<THREE.Group>}
        innerRef={innerRef as RefObject<THREE.Group>}
        pcbBaseRef={pcbBaseRef as RefObject<THREE.Group>}
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
  // GSAP ScrollTrigger handles all scroll animations

  return (
    <div className="w-full h-screen sticky top-0">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [-0.019, 2.690, 1.624], fov: 50 }}
        
        className="bg-linear-to-br from-slate-100 via-gray-50 to-zinc-100"
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
