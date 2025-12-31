"use client";

import { useState, useCallback, useEffect } from "react";
import { useModelLoader } from "@/hooks/useModelLoader";

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingMessages = [
  "Keep tapping...",
  "Almost there",
  "Loading magic...",
  "Just a bit more",
  "Almost ready",
  "Hang tight",
  "Preparing excellence",
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState<{
    id: number;
    message: string;
  } | null>(null);
  const [messageId, setMessageId] = useState(0);

  const modelPaths = [
    "/keyboard_keys.glb",
    "/keyboard_inner.glb",
    "/keyboard_pcb_base.glb",
  ];

  // Use the model loader hook to track actual progress
  const { loadingProgress, isComplete } = useModelLoader(modelPaths);

  // Handle completion
  useEffect(() => {
    if (isComplete && loadingProgress.progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, loadingProgress.progress, onComplete]);

  // Handle button tap
  const handleButtonTap = useCallback(() => {
    // Get random message
    const message =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

    // Replace current message with new one (only one message at a time)
    const newMessage = {
      id: messageId,
      message,
    };

    setCurrentMessage(newMessage);
    setMessageId((prev) => prev + 1);

    // Clear message after animation
    setTimeout(() => {
      setCurrentMessage(null);
    }, 2000);
  }, [messageId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
      <div className="flex flex-col items-center gap-8 px-6 w-full max-w-md">
        {/* Progress Bar */}
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>Loading models...</span>
            <span>{Math.round(loadingProgress.progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress.progress}%` }}
            />
          </div>
        </div>

        {/* Interactive Button Container */}
        <div className="relative flex flex-col items-center">
          {/* Floating Message - Only one at a time */}
          {currentMessage && (
            <div
              key={currentMessage.id}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-indigo-600"
              style={{
                bottom: "calc(100% + 20px)",
                animation: "floatUp 2s ease-out forwards",
                pointerEvents: "none",
              }}
            >
              {currentMessage.message}
            </div>
          )}

          {/* 3D Button - Centered */}
          <button
            onClick={handleButtonTap}
            onTouchStart={handleButtonTap}
            className="group relative h-20 w-20 cursor-pointer touch-manipulation rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              boxShadow:
                "0 10px 40px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Tap to stay engaged"
          >
            {/* Inner button with depth */}
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 transition-all duration-200 group-active:brightness-90">
              <div className="text-2xl font-bold text-white">✨</div>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>

          {/* Tap hint text */}
          <p className="mt-4 text-center text-xs text-slate-500">
            Tap the button to stay engaged
          </p>
        </div>
      </div>
    </div>
  );
}

