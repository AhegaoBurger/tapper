"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { createClient } from "@/utils/supabase/client";
import WebApp from "@twa-dev/sdk";
import type { WebAppUser } from "@twa-dev/types";
import { CoolMode } from "@/components/magicui/cool-mode";

export default function MobileClicker() {
  const [user, setUser] = useState<WebAppUser | null>(null);
  const [score, setScore] = useState(0);
  const [isTapping, setIsTapping] = useState(false);
  const [isMotionSupported, setIsMotionSupported] = useState(false);

  const supabase = createClient();
  // const mockUser: WebAppUser = {
  //   id: 1234567890,
  //   username: "Hamster",
  //   first_name: "Hamster",
  //   last_name: "Hamster",
  // };

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

      // Set mock user for development/testing
      // setUser(mockUser);

      // In production, you would use this:
      if (initData.user) {
        setUser(initData.user);
      }
    };

    initWebApp();

    // setUserId(initData.user?.id.toString() || "anonymous");
    // setUsername(initData.user?.username || "Anonymous Hamster");
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

  // Move handleTap definition up
  const handleTap = useCallback(() => {
    setScore((prev) => prev + 1);
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 100);
    updateScore(score + 1);
  }, [score, updateScore]); // Add dependencies

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const acceleration = event.acceleration;
      if (
        acceleration &&
        (Math.abs(acceleration.x ?? 0) > 10 ||
          Math.abs(acceleration.y ?? 0) > 10 ||
          Math.abs(acceleration.z ?? 0) > 10)
      ) {
        handleTap();
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
      <div className="text-4xl font-bold text-white mb-8">Score: {score}</div>
      <CoolMode>
        <motion.button
          className="w-64 h-64 bg-blue-500 rounded-full shadow-lg focus:outline-none flex items-center justify-center"
          animate={{
            scale: isTapping ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleTap}
        >
          <span className="text-white text-4xl font-bold">🐹 TAP!</span>
        </motion.button>
      </CoolMode>

      {isMotionSupported && (
        <p className="mt-4 text-white text-center">
          You can also increase the score by shaking your device!
        </p>
      )}
    </div>
  );
}
