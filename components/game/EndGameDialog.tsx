import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, RotateCcw } from "lucide-react";
import EndGameChart from "./EndGameChart";
import type { GameSession, LogEntry } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";

type EndGameDialogProps = {
  isOpen: boolean;
  gameSession: GameSession | null;
  onLeave: () => void;
};

/**
 * Generates a standard analysis based on the final game state.
 */
const getStandardAnalysis = (gameSession: GameSession | null): string => {
  if (!gameSession || !gameSession.gameOverMessage) {
    // Default to a collapse analysis if message is missing.
    return "O colapso dos indicadores revela que a negligência com áreas essenciais, como educação e bem-estar, cria uma sociedade frágil e insustentável. Onde a violação de direitos se torna sistêmica, a desinformação impera e a estrutura social desmorona por falta de uma base sólida em direitos humanos.";
  }

  const { education, gameOverMessage } = gameSession;
  const outcome = gameOverMessage.toLowerCase();

  if (outcome.includes('vitória coletiva')) {
    return "O alto nível dos indicadores, especialmente uma Educação forte, mostra como a Educação em Direitos Humanos (EDH) é a base para uma sociedade justa. Com cidadãos críticos e conscientes, a nação prosperou, valorizando o bem-estar coletivo e a participação democrática, resistindo à manipulação e consolidando uma cultura de paz.";
  }
  
  if (outcome.includes('oportunista')) {
    return `A baixa Educação crítica (nível ${education}) facilitou a manipulação e a ascensão de interesses particulares. Este cenário mostra que, sem uma EDH robusta, a sociedade fica vulnerável a discursos que minam os direitos coletivos em favor do poder e do capital concentrados.`;
  }
  
  // Default to collapse analysis for any other losing scenario.
  return "O colapso dos indicadores revela que a negligência com áreas essenciais, como educação e bem-estar, cria uma sociedade frágil e insustentável. Onde a violação de direitos se torna sistêmica, a desinformação impera e a estrutura social desmorona por falta de uma base sólida em direitos humanos.";
};

export default function EndGameDialog({ isOpen, gameSession, onLeave }: EndGameDialogProps) {
  const analysis = getStandardAnalysis(gameSession);
  const message = gameSession?.gameOverMessage || "Fim de Jogo!";
  const logs = gameSession?.logs || [];

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl">Fim de Jogo!</AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-4">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <Card className="bg-secondary/30 mt-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-headline">Análise Social</CardTitle>
            <CardDescription className="text-xs">O impacto na Educação em Direitos Humanos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{analysis}</p>
          </CardContent>
        </Card>

        <EndGameChart logs={logs} />

        <AlertDialogFooter>
          <AlertDialogAction onClick={onLeave}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Voltar ao Lobby
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
