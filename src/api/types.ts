// ustawić w zależności czy testujemy lokalnie czy na produkcji

export const API_BASE_URL = import.meta.env.VITE_API_URL;
// export const API_BASE_URL = import.meta.env.VITE_API_URL_TEST;

export type NumbersType = { number1: number; number2: number };

export type ResultType = { result: number };

export type EventType = {
  title: string;
  description: string | null;
  day: string;
  start_time: string;
  end_time: string;
};

export type PlayerData = {
  name: string;
  email: string;
  password: string;
};

export type DBUserData = {
  name: string;
  email: string;
  id: number;
  score: number;
  current_level: number;
};

export type PostNewScoreType = {
  levelId: number;
  userId: number;
  score: number;
};
