"use client";

import { useState, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const modelPaths = [
      "/keyboard_keys.glb",
      "/keyboard_inner.glb",
      "/keyboard_pcb_base.glb",
    ];

    // Also preload using drei's system for caching
    const preloadDreiModels = async () => {
      const { useGLTF } = await import("@react-three/drei");
      modelPaths.forEach((path) => {
        useGLTF.preload(path);
      });
    };
    preloadDreiModels();

    const loader = new GLTFLoader();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let loadedCount = 0;
    const total = modelPaths.length;
    const fileProgresses = new Array(total).fill(0);

    const loadModels = async () => {
      try {
        // Start with 5% to show something immediately
        setProgress(5);

        const loadPromises = modelPaths.map((path, index) => {
          return new Promise<void>((resolve) => {
            loader.load(
              path,
              () => {
                loadedCount++;
                fileProgresses[index] = 100;
                const totalProgress = fileProgresses.reduce((a, b) => a + b, 0);
                const overallProgress = Math.min(
                  totalProgress / total,
                  100
                );
                setProgress(Math.min(overallProgress, 95));
                resolve();
              },
              (progressEvent) => {
                // Track individual file progress
                if (progressEvent.lengthComputable && progressEvent.total > 0) {
                  const fileProgress = (progressEvent.loaded / progressEvent.total) * 100;
                  fileProgresses[index] = fileProgress;
                  const totalProgress = fileProgresses.reduce((a, b) => a + b, 0);
                  const overallProgress = Math.min(
                    totalProgress / total,
                    95
                  );
                  setProgress(overallProgress);
                }
              },
              (error) => {
                console.error(`Error loading ${path}:`, error);
                loadedCount++;
                fileProgresses[index] = 100;
                resolve();
              }
            );
          });
        });

        await Promise.all(loadPromises);
        
        // Ensure we show 100% when complete
        setProgress(100);
        
        // Small delay to show 100% before completing
        setTimeout(() => {
          onComplete();
        }, 300);
      } catch (err) {
        console.error("Error loading models:", err);
        onComplete();
      }
    };

    loadModels();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-slate-50 via-gray-50 to-zinc-100">
      <div className="flex flex-col items-center gap-6 px-6 w-full max-w-md">
        {/* Progress Bar */}
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>Loading models...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-linear-to-r from-gray-700 to-gray-800 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

