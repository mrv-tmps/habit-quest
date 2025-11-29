import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GitHubSetupProps {
  isConnected: boolean;
  onSave: (config: { token: string; owner: string; repo: string }) => void;
  onDisconnect: () => void;
}

export function GitHubSetup({ isConnected, onSave, onDisconnect }: GitHubSetupProps) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token && owner && repo) {
      onSave({ token, owner, repo });
      setOpen(false);
      setToken('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isConnected ? "secondary" : "outline"} 
          size="sm"
          className="gap-2"
        >
          <span>🐙</span>
          {isConnected ? 'GitHub Connected' : 'Connect GitHub'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">GitHub Integration</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Connect to log your habits to a GitHub repository. Your token is stored locally.
          </DialogDescription>
        </DialogHeader>

        {isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-endurance">✓ GitHub is connected</p>
            <Button 
              variant="destructive" 
              onClick={() => { onDisconnect(); setOpen(false); }}
              className="w-full"
            >
              Disconnect GitHub
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground">Personal Access Token</label>
              <Input
                type="password"
                placeholder="ghp_xxxx..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="bg-input border-border"
                required
              />
              <p className="text-xs text-muted-foreground">
                Create a token with 'repo' scope at GitHub Settings → Developer Settings → Personal Access Tokens
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground">Repository Owner</label>
              <Input
                placeholder="yourusername"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="bg-input border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground">Repository Name</label>
              <Input
                placeholder="habit-tracker"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="bg-input border-border"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Connect
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
