"use client";

import { useState, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface LoadingProgress {
  progress: number;
  loaded: number;
  total: number;
}

export function useModelLoader(modelPaths: string[]) {
  const [loadingProgress, setLoadingProgress] = useState<LoadingProgress>({
    progress: 0,
    loaded: 0,
    total: modelPaths.length,
  });
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Also preload using drei's system for caching
    const preloadDreiModels = async () => {
      const { useGLTF } = await import("@react-three/drei");
      modelPaths.forEach((path) => {
        useGLTF.preload(path);
      });
    };
    preloadDreiModels();

    const loader = new GLTFLoader();
    let loadedCount = 0;
    const total = modelPaths.length;
    const fileProgresses = new Array(total).fill(0);

    const loadModels = async () => {
      try {
        // Start with 5% to show something immediately
        setLoadingProgress({
          progress: 5,
          loaded: 0,
          total,
        });

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
                setLoadingProgress({
                  progress: Math.min(overallProgress, 95), // Cap at 95% until all done
                  loaded: loadedCount,
                  total,
                });
                resolve();
              },
              (progress) => {
                // Track individual file progress
                if (progress.lengthComputable && progress.total > 0) {
                  const fileProgress = (progress.loaded / progress.total) * 100;
                  fileProgresses[index] = fileProgress;
                  const totalProgress = fileProgresses.reduce((a, b) => a + b, 0);
                  const overallProgress = Math.min(
                    totalProgress / total,
                    95
                  );
                  setLoadingProgress({
                    progress: overallProgress,
                    loaded: loadedCount,
                    total,
                  });
                }
              },
              (error) => {
                console.error(`Error loading ${path}:`, error);
                loadedCount++;
                fileProgresses[index] = 100;
                // Continue even if one fails
                resolve();
              }
            );
          });
        });

        await Promise.all(loadPromises);
        
        // Ensure we show 100% when complete
        setLoadingProgress({
          progress: 100,
          loaded: total,
          total,
        });
        
        // Small delay to show 100% before completing
        setTimeout(() => {
          setIsComplete(true);
        }, 300);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsComplete(true);
      }
    };

    loadModels();
  }, [modelPaths]);

  return { loadingProgress, isComplete, error };
}

