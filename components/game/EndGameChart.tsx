'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { LogEntry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type EndGameChartProps = {
  logs: LogEntry[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 border rounded-lg shadow-lg">
        <p className="font-bold">{`${label}`}</p>
        <p style={{ color: payload[0].color }}>
            {`Total: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};


export default function EndGameChart({ logs }: EndGameChartProps) {
  const chartData = useMemo(() => {
    let positiveImpact = 0;
    let negativeImpact = 0;

    logs.forEach(log => {
      if (log.effects) {
        const effects = log.effects.split(', ');
        effects.forEach(effect => {
          const [key, valueStr] = effect.split(': ');
          if (key.trim() === 'education') {
            const value = parseInt(valueStr, 10);
            if (value > 0) {
              positiveImpact += value;
            } else if (value < 0) {
              negativeImpact += Math.abs(value); // Store as a positive number for the chart
            }
          }
        });
      }
    });

    return [
      { name: 'Impacto Positivo', value: positiveImpact, fill: 'hsl(var(--primary))' },
      { name: 'Impacto Negativo', value: negativeImpact, fill: 'hsl(var(--destructive))' },
    ];
  }, [logs]);

  const hasData = chartData.some(d => d.value > 0);

  if (!hasData) {
    return null; // Don't render the chart if there's no data to show
  }

  return (
    <Card className="mt-4 mb-2 bg-secondary/30">
        <CardHeader className='pb-2'>
            <CardTitle className="text-base font-headline">Resumo do Impacto na Educação</CardTitle>
            <CardDescription className='text-xs'>Soma de todas as decisões da partida.</CardDescription>
        </CardHeader>
        <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{fill: 'hsl(var(--muted) / 0.3)'}} content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
}
