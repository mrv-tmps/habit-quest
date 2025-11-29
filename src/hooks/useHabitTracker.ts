import { useState, useEffect, useCallback } from 'react';
import { Octokit } from 'octokit';

export type StatType = 'strength' | 'intelligence' | 'endurance';

export interface HabitData {
  level: number;
  totalPoints: number;
  stats: {
    strength: number;
    intelligence: number;
    endurance: number;
  };
  lastCompleted: {
    strength: string | null;
    intelligence: string | null;
    endurance: string | null;
  };
  avatar: string;
}

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

const STORAGE_KEY = 'habit-tracker-data';
const GITHUB_KEY = 'habit-tracker-github';

const defaultData: HabitData = {
  level: 1,
  totalPoints: 0,
  stats: {
    strength: 0,
    intelligence: 0,
    endurance: 0,
  },
  lastCompleted: {
    strength: null,
    intelligence: null,
    endurance: null,
  },
  avatar: '🧑‍🚀',
};

const statToHabit: Record<StatType, string> = {
  strength: 'Exercise',
  intelligence: 'Reading',
  endurance: 'Meditation',
};

export function useHabitTracker() {
  const [data, setData] = useState<HabitData>(defaultData);
  const [githubConfig, setGithubConfig] = useState<GitHubConfig | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored data:', e);
      }
    }

    const storedGithub = localStorage.getItem(GITHUB_KEY);
    if (storedGithub) {
      try {
        setGithubConfig(JSON.parse(storedGithub));
      } catch (e) {
        console.error('Failed to parse GitHub config:', e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const canComplete = useCallback((stat: StatType): boolean => {
    const today = getTodayDate();
    return data.lastCompleted[stat] !== today;
  }, [data.lastCompleted]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const logToGitHub = async (stat: StatType) => {
    if (!githubConfig) return;

    const octokit = new Octokit({ auth: githubConfig.token });
    const date = new Date().toLocaleString();
    const habitName = statToHabit[stat];
    const newEntry = `- Completed ${habitName} on ${date}\n`;

    try {
      // Try to get existing file
      let existingContent = '';
      let sha: string | undefined;

      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner: githubConfig.owner,
          repo: githubConfig.repo,
          path: 'habits.md',
        });

        if ('content' in fileData && typeof fileData.content === 'string') {
          existingContent = atob(fileData.content);
          sha = fileData.sha;
        }
      } catch (e) {
        // File doesn't exist, will create new
        existingContent = '# Habit Tracker Log\n\n';
      }

      const updatedContent = existingContent + newEntry;

      await octokit.rest.repos.createOrUpdateFileContents({
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        path: 'habits.md',
        message: `Log ${habitName} completion`,
        content: btoa(updatedContent),
        sha,
      });

      showMessage(`✅ ${habitName} logged to GitHub!`);
    } catch (error) {
      console.error('GitHub commit failed:', error);
      showMessage(`⚠️ GitHub sync failed, but progress saved locally`);
    }
  };

  const completeStat = useCallback(async (stat: StatType) => {
    if (!canComplete(stat)) {
      showMessage(`⏰ Already completed ${statToHabit[stat]} today!`);
      return;
    }

    const today = getTodayDate();
    const newTotalPoints = data.totalPoints + 1;
    const newLevel = Math.floor(newTotalPoints / 10) + 1;
    const leveledUp = newLevel > data.level;

    if (leveledUp) {
      setIsLevelingUp(true);
      setTimeout(() => setIsLevelingUp(false), 500);
    }

    setData(prev => ({
      ...prev,
      totalPoints: newTotalPoints,
      level: newLevel,
      stats: {
        ...prev.stats,
        [stat]: prev.stats[stat] + 1,
      },
      lastCompleted: {
        ...prev.lastCompleted,
        [stat]: today,
      },
    }));

    showMessage(leveledUp ? `🎉 LEVEL UP! Now level ${newLevel}!` : `+1 ${statToHabit[stat]}!`);

    // Log to GitHub if configured
    if (githubConfig) {
      await logToGitHub(stat);
    }
  }, [data, canComplete, githubConfig]);

  const setAvatar = useCallback((emoji: string) => {
    setData(prev => ({ ...prev, avatar: emoji }));
  }, []);

  const saveGitHubConfig = useCallback((config: GitHubConfig) => {
    setGithubConfig(config);
    localStorage.setItem(GITHUB_KEY, JSON.stringify(config));
    showMessage('✅ GitHub connected!');
  }, []);

  const clearGitHubConfig = useCallback(() => {
    setGithubConfig(null);
    localStorage.removeItem(GITHUB_KEY);
    showMessage('GitHub disconnected');
  }, []);

  const resetProgress = useCallback(() => {
    setData(defaultData);
    showMessage('Progress reset (GitHub logs preserved)');
  }, []);

  const xpProgress = (data.totalPoints % 10) / 10 * 100;
  const xpToNextLevel = 10 - (data.totalPoints % 10);

  return {
    data,
    message,
    isLevelingUp,
    canComplete,
    completeStat,
    setAvatar,
    resetProgress,
    githubConfig,
    saveGitHubConfig,
    clearGitHubConfig,
    xpProgress,
    xpToNextLevel,
  };
}
