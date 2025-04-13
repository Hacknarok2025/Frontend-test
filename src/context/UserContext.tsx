import { createContext, useContext, useState, ReactNode } from 'react';

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
    setUser((prev) => (prev ? { ...prev, score: newScore } : null));
  };

  const updateLevel = (newLevel: number) => {
    setUser((prev) => (prev ? { ...prev, current_level: newLevel } : null));
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateScore, updateLevel }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
