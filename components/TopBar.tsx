"use client";

import { TonConnectButton } from "@tonconnect/ui-react";
import {
  Bolt,
  CircleDollarSign,
  MonitorIcon as Running,
  Trophy,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/gameStore";

export default function TopBar() {
  const score = useGameStore((state) => state.score);

  return (
    <div className="w-full">
      <div className="min-h-[140px]  from-emerald-950 to-green-900 p-6 ">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Stats Counter Row */}
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-emerald-900/40 p-4 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-center gap-3 p-2">
              <CircleDollarSign className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-lg text-emerald-400">2.71K</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-2">
              <Bolt className="h-6 w-6 text-emerald-300" />
              <span className="font-bold text-lg text-green-100">{score}</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-2">
              <Running className="h-6 w-6 text-emerald-400" />
              <span className="font-bold text-lg text-green-100">0</span>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-emerald-600/50 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-800/40 hover:text-emerald-300 transition-colors py-6"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Bronze
            </Button>
            <div className="flex justify-center items-center">
              <TonConnectButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
