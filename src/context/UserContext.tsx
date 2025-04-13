import { createContext, useState, ReactNode } from 'react';
import { postNewScore } from '../api/post';
import { PostNewScoreType } from '../api/types';

interface UserContextType {
  user: {
    name: string;
    email: string;
    id: number;
    score: number;
    current_level: number;
  } | null;
  setUser: (user: UserContextType['user']) => void;
  updateScore: (newScore: number) => void;
  updateLevel: (newLevel: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextType['user']>(null);

  const updateScore = (newScore: number) => {
    setUser((prev) => {
      if (!prev) return null;
      // Save to database
      const scoreData: PostNewScoreType = {
        levelId: prev.current_level,
        userId: prev.id,
        score: newScore,
      };
      postNewScore(scoreData);
      return { ...prev, score: newScore };
    });
  };

  const updateLevel = (newLevel: number) => {
    setUser((prev) => {
      if (!prev) return null;
      // Save to database when level changes
      const scoreData: PostNewScoreType = {
        levelId: newLevel,
        userId: prev.id,
        score: prev.score,
      };
      postNewScore(scoreData);
      return { ...prev, current_level: newLevel };
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateScore, updateLevel }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
