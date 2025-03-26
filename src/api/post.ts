import { API_BASE_URL, numbersType as NumbersType } from "./types";

const postToApi = async <T, U>(path: string, body: T) => {
  const url = API_BASE_URL + path;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

export const postForResult = (body: NumbersType) => {
  return postToApi<NumbersType, number>("/calculate", body);
};

// export const postText = (body: TextType) => {
//   return postToApi<TextType, NotFilledFlashcardsType>("/text", body);
// };
