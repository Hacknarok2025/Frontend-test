import { API_BASE_URL } from "./types";
// @ts-ignore
const deleteInApi = async <U>(path: string) => {
  const url = API_BASE_URL + path;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(`Error: ${errorMessage.message}`);
    }

    return (await response.json()) as Promise<U>;
  } catch (error) {
    console.error("API call failed:", error);
    if (error instanceof SyntaxError) {
      throw new Error("The response body cannot be parsed as JSON");
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred.");
  }
};

// export const deleteDeck = () => {
//   return deleteInApi<MessageType>("/deck");
// };
