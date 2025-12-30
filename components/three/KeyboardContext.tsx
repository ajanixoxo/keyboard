"use client";

import { createContext, useContext, RefObject } from "react";
import * as THREE from "three";

interface KeyboardContextType {
  keysRef: RefObject<THREE.Group>;
  innerRef: RefObject<THREE.Group>;
  pcbBaseRef: RefObject<THREE.Group>;
  camera: THREE.PerspectiveCamera | null;
  gl: THREE.WebGLRenderer | null;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export function useKeyboardContext() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboardContext must be used within KeyboardProvider");
  }
  return context;
}

export function KeyboardProvider({
  children,
  keysRef,
  innerRef,
  pcbBaseRef,
  camera,
  gl,
}: {
  children: React.ReactNode;
  keysRef: RefObject<THREE.Group>;
  innerRef: RefObject<THREE.Group>;
  pcbBaseRef: RefObject<THREE.Group>;
  camera: THREE.PerspectiveCamera | null;
  gl: THREE.WebGLRenderer | null;
}) {
  return (
    <KeyboardContext.Provider
      value={{ keysRef, innerRef, pcbBaseRef, camera, gl }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}

