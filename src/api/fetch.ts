import { API_BASE_URL, EventType } from './types';
// @ts-ignore
const fetchFromApi = async <T>(path: string) => {
  const url = API_BASE_URL + path;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(`Error: ${errorMessage.message}`);
    }

    return (await response.json()) as Promise<T>;
  } catch (error) {
    console.error('API call failed:', error);
    if (error instanceof SyntaxError) {
      throw new Error('The response body cannot be parsed as JSON');
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred.');
  }
};

export const fetchEvents = () => {
  return fetchFromApi<EventType[]>('/events');
};
