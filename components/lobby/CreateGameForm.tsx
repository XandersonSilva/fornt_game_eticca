'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Difficulty } from '@/lib/types';
import { Checkbox } from '../ui/checkbox';


interface CreateGameFormProps {
  userUid: string;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onGameCreated: (gameId: string, playerName: string, role?: 'Observer') => void;
}

export default function CreateGameForm({ userUid, playerName, onPlayerNameChange, onGameCreated }: CreateGameFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [isObserver, setIsObserver] = useState(false);
  const { toast } = useToast();

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Nome inválido',
        description: 'Por favor, insira seu nome para criar ou entrar em um jogo.',
      });
      return;
    }
    
    setIsLoading(true);

    const requestBody = {
        userUid: userUid,
        playerName: playerName,
        difficulty: difficulty,
        isObserver: isObserver,
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/game/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.error || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      toast({
        title: 'Jogo Criado!',
        description: `O código da partida é: ${result.gameCode}`,
      });
      onGameCreated(result.gameCode, playerName, isObserver ? 'Observer' : undefined);

    } catch (error: any) {
      console.error("Error creating game:", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao criar o jogo',
        description: error.message || 'Ocorreu um problema ao tentar criar a partida.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">Criar um Novo Jogo</h2>
       <Input
        type="text"
        placeholder="Seu nome"
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        className="text-center"
      />
      <div className='flex flex-col gap-2'>
        <Label htmlFor="difficulty" className="text-center text-sm">Nível de Dificuldade</Label>
        <Select onValueChange={(value: Difficulty) => setDifficulty(value)} defaultValue={difficulty}>
            <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="Selecione a dificuldade" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 justify-center">
        <Checkbox id="isObserver" checked={isObserver} onCheckedChange={(checked) => setIsObserver(!!checked)} />
        <Label htmlFor="isObserver" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Quero ser apenas um observador
        </Label>
      </div>

      <Button onClick={handleCreateGame} disabled={isLoading || !playerName}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Criar Partida
      </Button>
    </div>
  );
}