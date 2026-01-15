'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import BossOverlay from './BossOverlay';
import type { Boss } from '@/lib/types';


// Definição dos caminhos das imagens
const bgCollapseSrc = 'https://i.ibb.co/5Xk4qFY3/TABULEIRO-0001908.png';
const bgNeutralSrc = 'https://i.ibb.co/0ykrc3cK/TABULEIRO-0001903.png';
const bgSovereignSrc = 'https://i.ibb.co/Hpk9ByxC/TABULEIRO-0001918.png';

type IndicatorData = {
  economy: number;
  education: number;
  wellbeing: number;
  popular_support: number;
  hunger: number;
  military_religion: number;
};

type DynamicGameBoardProps = {
  boardPosition: number;
  indicators: IndicatorData;
  currentBoss: Boss | null;
};

type NationState = 'state-collapse' | 'state-neutral' | 'state-sovereign';

// Lógica de cálculo do estado da nação com as novas regras
const calculateNationState = (indicators: IndicatorData): NationState => {
  const coreIndicators = [
    indicators.economy,
    indicators.education,
    indicators.wellbeing,
    indicators.popular_support,
    indicators.military_religion,
  ];

  // Condição para STATE-COLLAPSE (TABULEIRO-0001908.png)
  const collapseCondition1 = coreIndicators.some(val => val <= 1);
  const collapseCondition2 = coreIndicators.filter(val => val <= 3).length >= 2;
  
  if (collapseCondition1 || collapseCondition2) {
    return 'state-collapse';
  }

  // Condição para STATE-SOVEREIGN (TABULEIRO-0001918.png)
  const allAbove5 = coreIndicators.every(val => val >= 5) && indicators.hunger < 5;
  const threeOrMoreAt8 = coreIndicators.filter(val => val >= 8).length >= 3;
  const oneOrMoreAt10 = coreIndicators.some(val => val >= 10);
  
  if (allAbove5 && (threeOrMoreAt8 || oneOrMoreAt10)) {
    return 'state-sovereign';
  }

  // Se nenhuma das condições acima for atendida, é STATE-NEUTRAL
  return 'state-neutral';
};


// Coordenadas exatas das casas (top/left em porcentagem)
const tiles = [
    { id: 1, label: "1", top: 22, left: 23 },
    { id: 2, label: "2", top: 32, left: 13 },
    { id: 3, label: "3", top: 39, left: 29 },
    { id: 4, label: "4", top: 15, left: 37 },
    { id: 5, label: "5", top: 53, left: 48 },
    { id: 6, label: "6", top: 45, left: 39 },
    { id: 7, label: "7", top: 40, left: 47 },
    { id: 8, label: "8", top: 43, left: 54 },
    { id: 9, label: "9", top: 23, left: 49 },
    { id: 10, label: "10", top: 82, left: 53 },
    { id: 11, label: "11", top: 75, left: 61 },
    { id: 12, label: "12", top: 69, left: 66 },
    { id: 13, label: "13", top: 63, left: 48 },
    { id: 14, label: "14", top: 56, left: 60 },
    { id: 15, label: "15", top: 86, left: 57 },
    { id: 16, label: "16", top: 63, left: 48 }, 
    { id: 17, label: "17", top: 69, left: 66 },
    { id: 18, label: "18", top: 39, left: 64 },
    { id: 19, label: "19", top: 44, left: 70 },
    { id: 20, label: "20", top: 49, left: 79 },
    { id: 21, label: "21", top: 25, left: 76 },
    { id: 22, label: "22", top: 32, left: 76 },
    { id: 23, label: "23", top: 20, left: 63 },
    { id: 24, label: "24", top: 59, left: 77 },
    { id: 25, label: "25", top: 68, left: 75 },
];

export default function DynamicGameBoard({ boardPosition, indicators, currentBoss }: DynamicGameBoardProps) {
  const nationState = useMemo(() => calculateNationState(indicators), [indicators]);

  return (
    <Card className="shadow-2xl h-full w-full flex flex-col border-none bg-transparent overflow-hidden">
      <CardContent className="flex-grow flex items-center justify-center relative w-full h-full p-0">
        <div className="relative w-full aspect-[4/3] max-w-full max-h-full">
          <Image 
            src={bgCollapseSrc} 
            alt="Mapa em estado de colapso"
            fill
            className={cn(
                "transition-opacity duration-1000 ease-in-out",
                nationState === 'state-collapse' ? "opacity-100" : "opacity-0"
            )}
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />

          <Image 
            src={bgNeutralSrc}
            alt="Mapa em estado neutro"
            fill
            className={cn(
                "transition-opacity duration-1000 ease-in-out",
                nationState === 'state-neutral' ? "opacity-100" : "opacity-0"
            )}
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />

          <Image 
            src={bgSovereignSrc} 
            alt="Mapa em estado soberano"
            fill
            className={cn(
                "transition-opacity duration-1000 ease-in-out",
                nationState === 'state-sovereign' ? "opacity-100" : "opacity-0"
            )}
            priority
            sizes="(max-width: 768px) 100vw, 66vw"
          />

          <div className={cn(
            "absolute inset-0 w-full h-full pointer-events-none transition-colors duration-1000",
            nationState === 'state-collapse' && "bg-gradient-to-t from-red-900/30 to-transparent",
            nationState === 'state-neutral' && "bg-gradient-to-t from-black/20 to-transparent",
            nationState === 'state-sovereign' && "bg-gradient-to-t from-blue-500/10 to-transparent mix-blend-overlay"
          )}></div>

          {tiles.map((tile) => {
            const isCurrent = tile.id === boardPosition;
            return (
              <div 
                key={tile.id} 
                className={cn(
                    "absolute w-[3.5%] h-[4.5%] flex justify-center items-center rounded-full text-[10px] sm:text-xs md:text-sm font-bold text-white shadow-lg cursor-default transition-all duration-300",
                    "bg-gradient-to-br from-green-600 to-green-900 border border-white/50",
                    isCurrent && "scale-150 border-yellow-400 ring-4 ring-yellow-400/50 z-10 from-yellow-500 to-orange-600 shadow-yellow-500/50",
                    !isCurrent && "hover:scale-125 hover:border-white hover:z-20"
                )}
                style={{ 
                    top: `${tile.top}%`, 
                    left: `${tile.left}%` 
                }}
              >
                {tile.label}
              </div>
            )
          })}

          <BossOverlay boss={currentBoss} />
        </div>
      </CardContent>
    </Card>
  );
}
