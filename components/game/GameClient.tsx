'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { GameSession, Player } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import ResourceDashboard from './ResourceDashboard';
import DynamicGameBoard from './DynamicGameBoard';
import DecisionCardComponent from './DecisionCard';
import EndGameDialog from './EndGameDialog';
import Header from './Header';
import { Loader2, BookOpen, Map, Vote, Users } from 'lucide-react';
import LogPanel from './LogPanel';
import { API_BASE_URL } from '@/lib/api';
import { useInterval } from '@/hooks/use-interval';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { initialBosses } from '@/lib/game-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type GameClientProps = {
  gameCode: string;
  userUid: string;
  onLeave: () => void;
  isObserver: boolean; // Esta prop vem do app/page.tsx e indica se o usuário LOGADO é um observador
};

const POLLING_INTERVAL = 2000; // 2 seconds

export default function GameClient({ gameCode, userUid, onLeave, isObserver }: GameClientProps) {
  const { toast } = useToast();
  
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const gameOver = useMemo(() => {
    if (gameSession?.status === 'finished') {
      return { isGameOver: true, message: gameSession.gameOverMessage || "A partida terminou." };
    }
    return { isGameOver: false, message: '' };
  }, [gameSession]);


  const fetchGameSession = useCallback(async () => {
    // Não busca mais se o jogo acabou para evitar piscar a tela
    if(gameSession?.status === 'finished') return;
    try {
      const response = await fetch(`${API_BASE_URL}/game/${gameCode}`);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Não foi possível carregar o estado do jogo.');
      }
      const data: GameSession = await response.json();
      setGameSession(data);

    } catch (e: any) {
      setError(e.message);
      toast({
        variant: 'destructive',
        title: 'Erro de Conexão',
        description: e.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [gameCode, toast, gameSession?.status]);

  useInterval(fetchGameSession, gameSession?.status === 'finished' ? null : POLLING_INTERVAL);

  useEffect(() => {
    fetchGameSession();
  }, [fetchGameSession]);

  const handleStartGame = async () => {
    if (!gameSession || userUid !== gameSession.creator_user_uid || gameSession.status !== 'waiting') return;

    setIsProcessing(true);
    try {
        const response = await fetch(`${API_BASE_URL}/game/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameCode: gameSession.game_code }),
        });
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Falha ao iniciar a partida.');
        }
        await fetchGameSession(); // Fetch immediately to get the new state with the card
        toast({ title: "A partida começou!", description: "Bom jogo!" });
    } catch (error: any) {
        console.error("Error starting game:", error);
        toast({ variant: 'destructive', title: 'Erro', description: error.message });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleRestartGame = async () => {
    if (!gameSession || userUid !== gameSession.creator_user_uid || gameSession.status !== 'finished') return;

    setIsProcessing(true);
    try {
        const response = await fetch(`${API_BASE_URL}/game/restart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameCode: gameSession.game_code, userUid }),
        });
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Falha ao reiniciar a partida.');
        }
        // A lógica de polling vai cuidar de atualizar a tela para 'waiting'
        setIsLoading(true); // Mostra o loader enquanto espera o próximo poll
        setGameSession(null); // Limpa a sessão atual para forçar recarregamento completo
        toast({ title: "Reiniciando a partida...", description: "Aguarde um momento." });
    } catch (error: any) {
        console.error("Error restarting game:", error);
        toast({ variant: 'destructive', title: 'Erro ao Reiniciar', description: error.message });
    } finally {
        setIsProcessing(false);
    }
  };

  const players = useMemo(() => gameSession?.players || [], [gameSession?.players]);
  const activePlayers = useMemo(() => players.filter(p => p.character_role !== 'Observador'), [players]);


  const currentPlayer = useMemo(() => {
    if (!gameSession || !activePlayers.length || gameSession.current_player_index === undefined) return null;
    return activePlayers.find(p => p.turn_order === gameSession.current_player_index);
  }, [activePlayers, gameSession]);
  
  const currentCard = useMemo(() => {
      if (!gameSession || !gameSession.currentCard) return null;
      return gameSession.currentCard;
  }, [gameSession]);

  const handleDecision = useCallback(async (choiceIndex: number) => {
    if (isProcessing || !gameSession || !currentPlayer || userUid !== currentPlayer.user_uid || isObserver) return;
    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE_URL}/game/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameCode: gameSession.game_code,
          userUid: userUid,
          choice: choiceIndex,
          difficulty: gameSession.difficulty,
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => null);
        const errorMessage = errorResult?.error || 'Não foi possível processar a decisão.';
        toast({
            variant: "destructive",
            title: "Erro de Jogada",
            description: errorMessage,
        });
      } else {
        await fetchGameSession(); // Poll for new state on success
      }
    } catch (e: any) {
        console.error("Failed to process decision:", e);
        toast({
            variant: "destructive",
            title: "Erro de Conexão",
            description: e.message || "Não foi possível conectar ao servidor.",
        });
    } finally {
       setIsProcessing(false);
    }
  }, [gameSession, currentPlayer, isProcessing, toast, userUid, fetchGameSession, isObserver]);
  
  const currentBoss = useMemo(() => {
    if (!gameSession) return null;
    return initialBosses.find(b => b.position === gameSession.board_position) || null;
  }, [gameSession?.board_position]);

  const isCreator = userUid === gameSession?.creator_user_uid;

  if (isLoading || !gameSession) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Carregando jogo...</p>
             <p className="mt-4 text-xs text-muted-foreground">Código: {gameCode}</p>
             <Button onClick={onLeave} variant="outline" size="sm" className="mt-4">Sair</Button>
        </div>
    );
  }

  if (error) {
      return (
          <div className="flex min-h-screen flex-col items-center justify-center bg-background text-red-500">
              <p>Erro ao carregar o jogo: {error}</p>
              <Button onClick={onLeave} className="mt-4">Voltar ao Lobby</Button>
          </div>
      );
  }
  
  const isCurrentPlayerTurn = !!currentPlayer && userUid === currentPlayer.user_uid && !isObserver;
  const isWaiting = gameSession.status === 'waiting';
  
  const canStart = isCreator && isWaiting && activePlayers.length >= 2;

  const indicators = {
    economy: gameSession.economy,
    education: gameSession.education,
    wellbeing: gameSession.wellbeing,
    popular_support: gameSession.popular_support,
    hunger: gameSession.hunger,
    military_religion: gameSession.military_religion,
  };


  const WaitingComponent = () => (
    <div className="flex flex-col items-center justify-center h-full bg-card rounded-lg shadow-lg text-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
            {activePlayers.length < 2 ? "Aguardando mais jogadores..." : "Aguardando o anfitrião iniciar a partida..."}
        </p>
        <p className="text-sm text-muted-foreground">({activePlayers.length} de 4 jogadores)</p>

        {canStart && (
            <Button onClick={handleStartGame} disabled={isProcessing} className="mt-6">
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Iniciar Partida
            </Button>
        )}
        
        {isObserver && !isCreator && <p className="text-sm text-accent mt-4">Você está no modo Observador.</p>}
    </div>
  );

  const DecisionComponent = () => (
      currentCard && currentPlayer ? (
        <DecisionCardComponent
          card={currentCard}
          onDecision={handleDecision}
          isProcessing={isProcessing}
          isMyTurn={isCurrentPlayerTurn}
          currentPlayer={currentPlayer}
          difficulty={gameSession.difficulty}
        />
    ) : (
        <div className="flex flex-col items-center justify-center h-full bg-card rounded-lg shadow-lg p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground text-sm">Aguardando próxima rodada...</p>
        </div>
    )
  );

  return (
     <div className={cn(
        "flex flex-col bg-background text-foreground transition-colors duration-500 min-h-screen",
        "min-h-[770px]",
        currentBoss && "boss-battle"
      )}>
      <Header 
        gameCode={gameSession.game_code} 
        players={players} 
        currentPlayerId={currentPlayer?.id}
        isCreator={isCreator}
        gameStatus={gameSession.status}
        onRestart={handleRestartGame}
      />
      
      {/* Container Principal */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Painel da Nação - Visível apenas em desktop fora das abas */}
        <div className="hidden md:block w-full bg-card/20 py-2 border-b px-4">
          <ResourceDashboard indicators={indicators} difficulty={gameSession.difficulty} />
        </div>
        
        {/* Layout Desktop */}
        <main className="hidden md:grid flex-1 grid-cols-3 gap-4 min-h-0 container mx-auto py-4 px-4">
          <div className="col-span-2 flex flex-col items-center justify-center min-h-0 h-full">
            <div className="relative w-full max-w-full h-full max-h-full flex items-center justify-center">
               <div className="relative w-full h-full aspect-[4/3]">
                <DynamicGameBoard 
                    boardPosition={gameSession.board_position} 
                    indicators={indicators}
                    currentBoss={currentBoss} 
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 min-h-0 h-full">
            {isWaiting ? <WaitingComponent /> : (
              <Tabs defaultValue="decisao" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="decisao">Decisão</TabsTrigger>
                  <TabsTrigger value="diario">Diário da Nação</TabsTrigger>
                </TabsList>
                <TabsContent value="decisao" className="flex-1 min-h-0">
                  <DecisionComponent />
                </TabsContent>
                <TabsContent value="diario" className="flex-1 min-h-0">
                   <LogPanel logs={gameSession.logs || []} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>

        {/* Layout Mobile com Abas */}
        <div className="md:hidden flex flex-col flex-1 min-h-0">
          <Tabs defaultValue="mapa" className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-2">
              <TabsContent value="mapa" className="h-full">
                 <div className="relative w-full max-w-full mx-auto aspect-[4/3]">
                    <DynamicGameBoard 
                        boardPosition={gameSession.board_position} 
                        indicators={indicators}
                        currentBoss={currentBoss}
                    />
                </div>
              </TabsContent>
              <TabsContent value="decisao" className="h-full">
                 {isWaiting ? <WaitingComponent /> : <DecisionComponent />}
              </TabsContent>
              <TabsContent value="diario" className="h-full">
                <LogPanel logs={gameSession.logs || []} />
              </TabsContent>
              <TabsContent value="nacao" className="h-full">
                <div className="p-4 bg-card rounded-lg">
                  <ResourceDashboard indicators={indicators} difficulty={gameSession.difficulty} />
                </div>
              </TabsContent>
            </div>
            <TabsList className="grid w-full grid-cols-4 h-14 rounded-none">
              <TabsTrigger value="mapa" className="flex-col gap-1 h-full">
                <Map className="h-5 w-5" />
                <span className="text-xs">Mapa</span>
              </TabsTrigger>
              <TabsTrigger value="decisao" className="flex-col gap-1 h-full">
                <Vote className="h-5 w-5" />
                <span className="text-xs">Decisão</span>
              </TabsTrigger>
              <TabsTrigger value="diario" className="flex-col gap-1 h-full">
                <BookOpen className="h-5 w-5" />
                <span className="text-xs">Diário</span>
              </TabsTrigger>
              <TabsTrigger value="nacao" className="flex-col gap-1 h-full">
                <Users className="h-5 w-5" />
                <span className="text-xs">Nação</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

      </div>

      <EndGameDialog
        isOpen={gameOver.isGameOver}
        gameSession={gameSession}
        onLeave={onLeave}
      />
    </div>
  );
}
