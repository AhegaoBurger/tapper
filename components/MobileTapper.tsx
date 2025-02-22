"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/utils/supabase/client";
import WebApp from "@twa-dev/sdk";
import type { WebAppUser } from "@twa-dev/types";
import Image from "next/image";
import { useGameStore } from "@/store/gameStore";

export default function MobileClicker() {
  const { score, setScore, incrementScore } = useGameStore();

  const [user, setUser] = useState<WebAppUser | null>(null);
  // const [score, setScore] = useState(0);
  const [isTapping, setIsTapping] = useState(false);
  const [isMotionSupported, setIsMotionSupported] = useState(false);
  // const [plusOnes, setPlusOnes] = useState<{ id: number; x: number }[]>([]);
  const [jumpingFrogs, setJumpingFrogs] = useState<
    {
      id: number;
      x: number;
      y: number;
      isJump4: boolean;
    }[]
  >([]);

  const supabase = createClient();
  const mockUser: WebAppUser = {
    id: 1234567890,
    username: "Hamster",
    first_name: "Hamster",
    last_name: "Hamster",
  };

  // Fetch initial score from database
  useEffect(() => {
    const fetchInitialScore = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("scores")
        .select("score")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching score:", error);
        return;
      }

      if (data) {
        setScore(data.score);
      }
    };

    fetchInitialScore();
  }, [user?.id, supabase]);

  useEffect(() => {
    // Initialize Telegram WebApp
    const initWebApp = () => {
      WebApp.ready();
      WebApp.expand();
      // WebApp.BackButton.hide();
      const initData = WebApp.initDataUnsafe;

      // In production, you would use this:
      if (initData.user) {
        setUser(initData.user);
      } else {
        // Set mock user for development/testing
        setUser(mockUser);
      }
    };

    initWebApp();
  }, []);

  // Save score to Supabase (debounced)
  const updateScore = useCallback(
    async (newScore: number) => {
      if (!user?.id) {
        console.log("No user_id available, skipping score update");
        return;
      }

      console.log(
        "user_id",
        user?.id,
        "newScore:",
        newScore,
        "username:",
        user?.username,
      );
      await supabase
        .from("scores")
        .upsert(
          { user_id: user.id, score: newScore, username: user?.username },
          { onConflict: "user_id" },
        );
    },
    [user?.id, user?.username, supabase],
  );

  const triggerHapticFeedback = () => {
    // Try to use impact feedback first (more distinct)
    if (WebApp.isVersionAtLeast("6.1")) {
      WebApp.HapticFeedback.impactOccurred("light");
    } else {
      // Fallback to notification feedback for older versions
      WebApp.HapticFeedback.notificationOccurred("success");
    }
  };

  // Move handleTap definition up
  const handleTap = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      incrementScore(score);
      setIsTapping(true);
      setTimeout(() => setIsTapping(false), 100);
      updateScore(score + 1);

      // Trigger haptic feedback
      triggerHapticFeedback();

      // Get random direction for the frog to jump
      const angle = Math.random() * Math.PI * 2; // Random angle in radians
      const distance = 100; // Distance to jump
      const jumpX = Math.cos(angle) * distance;
      const jumpY = Math.sin(angle) * distance;

      // Randomly choose between frog04 and frog05
      const isJump4 = Math.random() > 0.5;

      const newFrog = {
        id: Date.now(),
        x: jumpX,
        y: jumpY,
        isJump4,
      };
      setJumpingFrogs((prev) => [...prev, newFrog]);

      // Remove the jumping frog after animation completes
      setTimeout(() => {
        setJumpingFrogs((prev) =>
          prev.filter((item) => item.id !== newFrog.id),
        );
      }, 1000);
    },
    [score, updateScore],
  ); // Add dependencies

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const acceleration = event.acceleration;
      if (
        acceleration &&
        (Math.abs(acceleration.x ?? 0) > 10 ||
          Math.abs(acceleration.y ?? 0) > 10 ||
          Math.abs(acceleration.z ?? 0) > 10)
      ) {
        triggerHapticFeedback(); // Add haptic feedback for motion events too
        handleTap({} as React.MouseEvent<HTMLButtonElement>);
      }
    },
    [handleTap],
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "DeviceMotionEvent" in window) {
      setIsMotionSupported(true);
      window.addEventListener("devicemotion", handleMotion);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devicemotion", handleMotion);
      }
    };
  }, [handleMotion]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* <div className="text-4xl font-bold text-white mb-8">Score: {score}</div> */}
      <div className="relative">
        <AnimatePresence>
          {jumpingFrogs.map((frog) => (
            <motion.img
              key={frog.id}
              src={frog.isJump4 ? "/Лягуха-03.png" : "/Лягуха-05.png"}
              alt="Jumping frog"
              className="absolute w-16 h-16 pointer-events-none filter drop-shadow-lg"
              style={{
                originX: "100%",
                originY: "100%",
              }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0.5,
                x: frog.x,
                y: frog.y,
                rotate: frog.x > 0 ? 360 : -360,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
        <motion.button
          className="w-32 h-32 rounded-full focus:outline-none flex items-center justify-center relative overflow-visible
                             filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          animate={{
            scale: isTapping ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleTap}
        >
          <Image
            src="/Лягуха-04.png"
            alt="Still frog"
            className="w-full h-full"
            width={1000}
            height={1000}
          />
        </motion.button>
      </div>

      {isMotionSupported && (
        <p className="mt-6 text-emerald-300 text-center text-sm bg-emerald-950/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          You can also increase the score by shaking your device!
        </p>
      )}
    </div>
  );
}
