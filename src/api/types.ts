export const API_BASE_URL = import.meta.env.VITE_API_URL;

export type NumbersType = { number1: number; number2: number };

export type ResultType = { result: number };

export type EventType = {
  title: string;
  description: string | null;
  day: string;
  start_time: string;
  end_time: string;
};
