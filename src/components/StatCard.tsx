import { cn } from '@/lib/utils';
import type { StatType } from '@/hooks/useHabitTracker';

interface StatCardProps {
  type: StatType;
  value: number;
  canComplete: boolean;
  onComplete: () => void;
}

const statConfig = {
  strength: {
    label: 'Strength',
    icon: '💪',
    habit: 'Exercise',
    colorClass: 'text-strength',
    glowClass: 'stat-glow-strength',
    buttonBg: 'bg-strength/20 hover:bg-strength/30 border-strength/50',
  },
  intelligence: {
    label: 'Intelligence',
    icon: '📚',
    habit: 'Reading',
    colorClass: 'text-intelligence',
    glowClass: 'stat-glow-intelligence',
    buttonBg: 'bg-intelligence/20 hover:bg-intelligence/30 border-intelligence/50',
  },
  endurance: {
    label: 'Endurance',
    icon: '🧘',
    habit: 'Meditation',
    colorClass: 'text-endurance',
    glowClass: 'stat-glow-endurance',
    buttonBg: 'bg-endurance/20 hover:bg-endurance/30 border-endurance/50',
  },
};

export function StatCard({ type, value, canComplete, onComplete }: StatCardProps) {
  const config = statConfig[type];

  return (
    <div className={cn(
      "rounded-lg bg-card border border-border p-4 transition-all duration-300",
      config.glowClass
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <span className={cn("font-semibold", config.colorClass)}>{config.label}</span>
        </div>
        <span className={cn("font-pixel text-lg", config.colorClass)}>{value}</span>
      </div>

      <button
        onClick={onComplete}
        disabled={!canComplete}
        className={cn(
          "w-full py-2 px-4 rounded-md border font-medium transition-all duration-200",
          canComplete 
            ? cn(config.buttonBg, "cursor-pointer active:scale-95") 
            : "bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50"
        )}
      >
        {canComplete ? `Complete ${config.habit}` : '✓ Done Today'}
      </button>
    </div>
  );
}
