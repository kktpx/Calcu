import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is provided
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in the environment variables.");
}

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(apiKey || "");

/**
 * Utility function to analyze food from text or image using Gemini Flash.
 * @param prompt The text prompt to ask Gemini
 * @param base64Image (Optional) The base64 encoded image string for vision capabilities
 */
export async function analyzeFoodWithGemini(prompt: string, base64Image?: string, mimeType: string = "image/jpeg") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const parts: unknown[] = [prompt];

    if (base64Image) {
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      });
    }

    const result = await model.generateContent(parts as any);
    const response = await result.response;
    return response.text();
  } catch (error: unknown) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
