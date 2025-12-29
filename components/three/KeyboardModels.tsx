"use client";

import { useGLTF } from "@react-three/drei";
import { Group } from "three";

interface KeyboardModelsProps {
  fullRef: React.RefObject<Group>;
  keysRef: React.RefObject<Group>;
  innerRef: React.RefObject<Group>;
  pcbBaseRef: React.RefObject<Group>;
}

export function KeyboardModels({
  fullRef,
  keysRef,
  innerRef,
  pcbBaseRef,
}: KeyboardModelsProps) {
  // Load all GLB files independently
  const fullModel = useGLTF("/keyboard_full.glb");
  const keysModel = useGLTF("/keyboard_keys.glb");
  const innerModel = useGLTF("/keyboard_inner.glb");
  const pcbBaseModel = useGLTF("/keyboard_pcb_base.glb");

  return (
    <>
      {/* Full Keyboard Model */}
      <primitive
        object={fullModel.scene.clone()}
        ref={fullRef}
        position={[0, 0, 0]}
      />

      {/* Keys Model */}
      <primitive
        object={keysModel.scene.clone()}
        ref={keysRef}
        position={[0, 0, 0]}
      />

      {/* Inner Model */}
      <primitive
        object={innerModel.scene.clone()}
        ref={innerRef}
        position={[0, 0, 0]}
      />

      {/* PCB Base Model */}
      <primitive
        object={pcbBaseModel.scene.clone()}
        ref={pcbBaseRef}
        position={[0, 0, 0]}
      />
    </>
  );
}

// Preload models for better performance
useGLTF.preload("/keyboard_full.glb");
useGLTF.preload("/keyboard_keys.glb");
useGLTF.preload("/keyboard_inner.glb");
useGLTF.preload("/keyboard_pcb_base.glb");

