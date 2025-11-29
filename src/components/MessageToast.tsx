import { cn } from '@/lib/utils';

interface MessageToastProps {
  message: string | null;
}

export function MessageToast({ message }: MessageToastProps) {
  if (!message) return null;

  const isLevelUp = message.includes('LEVEL UP');
  const isSuccess = message.includes('✅') || message.includes('+1');
  const isWarning = message.includes('⚠️') || message.includes('⏰');

  return (
    <div 
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg font-medium z-50",
        "animate-in fade-in slide-in-from-bottom-4 duration-300",
        isLevelUp && "bg-primary text-primary-foreground font-pixel text-xs text-glow",
        isSuccess && !isLevelUp && "bg-endurance/90 text-foreground",
        isWarning && "bg-secondary text-secondary-foreground border border-border",
        !isLevelUp && !isSuccess && !isWarning && "bg-card text-foreground border border-border"
      )}
    >
      {message}
    </div>
  );
}
