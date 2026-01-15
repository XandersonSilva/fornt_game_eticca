'use client';
import { Skull, ShieldAlert } from 'lucide-react';
import type { Boss } from '@/lib/types';
import { cn } from '@/lib/utils';
import { indicatorDetails } from '@/lib/game-data';

interface BossOverlayProps {
  boss: Boss | null;
}

export default function BossOverlay({ boss }: BossOverlayProps) {
  if (!boss) {
    return null;
  }

  const requirementIndicator = indicatorDetails[boss.requirement.indicator];

  return (
    <div 
      className={cn(
        "absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500",
        boss ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative flex flex-col items-center justify-center text-center p-4">
        {/* Skull Icon in the background */}
        <Skull className="absolute text-red-900/40 w-48 h-48 sm:w-64 sm:h-64 animate-pulse" />

        {/* Content on top */}
        <div className="relative z-10 flex flex-col items-center gap-2">
            <ShieldAlert className="w-12 h-12 text-destructive animate-bounce" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-headline drop-shadow-lg">
                Desafio: {boss.name}
            </h2>
            <p className="text-sm sm:text-base font-semibold text-destructive-foreground bg-destructive/80 px-3 py-1 rounded-md shadow-lg">
                Requisito: {requirementIndicator.name} nível {boss.requirement.level} para avançar.
            </p>
        </div>
      </div>
    </div>
  );
}
