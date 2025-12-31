"use client";

import { useRef, useState, RefObject } from "react";
import * as THREE from "three";
import { KeyboardScene } from "./KeyboardScene";
import { KeyboardProvider } from "./KeyboardContext";
import { ModelLinesOverlay } from "@/components/ui/ModelLinesOverlay";

export function KeyboardSceneWrapper() {
  const fullRef = useRef<THREE.Group>(null);
  const keysRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const pcbBaseRef = useRef<THREE.Group>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [gl, setGl] = useState<THREE.WebGLRenderer | null>(null);

  return (
    <KeyboardProvider
      keysRef={keysRef as RefObject<THREE.Group>}
      innerRef={innerRef as RefObject<THREE.Group>}
      pcbBaseRef={pcbBaseRef as RefObject<THREE.Group>}
      camera={camera}
      gl={gl}
    >
      <KeyboardScene
        keysRef={keysRef as RefObject<THREE.Group>}
        innerRef={innerRef as RefObject<THREE.Group>}
        pcbBaseRef={pcbBaseRef as RefObject<THREE.Group>}
        fullRef={fullRef as RefObject<THREE.Group>}
        onCameraChange={setCamera}
        onGlChange={setGl}
      />
      <ModelLinesOverlay />
    </KeyboardProvider>
  );
}

