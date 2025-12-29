"use client";

import { useGLTF } from "@react-three/drei";
import { Group } from "three";

interface KeyboardModelsProps {
  fullRef: React.RefObject<Group>;
}

export function KeyboardModels({
  fullRef,
}: KeyboardModelsProps) {
  // Load only the full keyboard GLB file
  const fullModel = useGLTF("/keyboard_full.glb");

  return (
    <primitive
      object={fullModel.scene}
      ref={fullRef}
      position={[0, 0, 0]}
    />
  );
}

// Preload model for better performance
useGLTF.preload("/keyboard_full.glb");

