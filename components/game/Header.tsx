'use client';

import { Button } from "@/components/ui/button";
import { Scale, Copy, Users, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Player } from "@/lib/types";
import PlayerDashboard from "./PlayerDashboard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type HeaderProps = {
  gameCode: string;
  players: Player[];
  currentPlayerId?: string;
  isCreator: boolean;
  gameStatus: 'waiting' | 'in_progress' | 'finished';
  onRestart: () => void;
};

export default function Header({ gameCode, players, currentPlayerId, isCreator, gameStatus, onRestart }: HeaderProps) {
  const { toast } = useToast();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameCode);
    toast({
      title: "Código Copiado!",
      description: "O código da partida foi copiado para a área de transferência.",
    });
  };

  return (
    <header className="bg-card/50 border-b shadow-sm sticky top-0 z-20 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
              Brasil em Pauta
            </h1>
          </div>

          {/* Center Section */}
          <div className="hidden md:flex items-center gap-2 rounded-md border bg-background/50 px-3 py-1.5">
              <span className="text-sm font-medium text-muted-foreground">CÓDIGO:</span>
              <span className="text-sm font-bold tracking-widest text-primary">{gameCode}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4" />
              </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {isCreator && gameStatus === 'finished' && (
                <Button onClick={onRestart} size="sm" variant="secondary" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar
                </Button>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span>Gabinete ({players.length})</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 mr-4">
                <PlayerDashboard players={players} currentPlayerId={currentPlayerId} />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
