import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { GameSession, Difficulty } from "@/lib/types";
import { indicatorDetails } from "@/lib/game-data";
import IndicatorBar from "./IndicatorBar";

type ResourceDashboardProps = {
  indicators: {
    economy: number;
    education: number;
    wellbeing: number;
    popular_support: number;
    hunger: number;
    military_religion: number;
  };
  difficulty: Difficulty;
};

export default function ResourceDashboard({ indicators, difficulty }: ResourceDashboardProps) {
  // Create an object with only the indicator values for easy mapping
  const indicatorValues = {
    economy: indicators.economy,
    education: indicators.education,
    wellbeing: indicators.wellbeing,
    popular_support: indicators.popular_support,
    hunger: indicators.hunger,
    military_religion: indicators.military_religion,
  };

  return (
    // Removido o Card para ser um componente mais flexível
    <div className="w-full">
      <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2 px-2">Painel da Nação</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-3">
        {Object.entries(indicatorValues).map(([key, value]) => {
          if (value === undefined || value === null) return null; // Skip if indicator is not present
          const details = indicatorDetails[key as keyof typeof indicatorDetails];
          if (!details) return null;
          return (
            <IndicatorBar
              key={key}
              label={details.name}
              value={value}
              Icon={details.icon}
              isInverse={key === 'hunger'}
              difficulty={difficulty}
            />
          );
        })}
      </div>
    </div>
  );
}
