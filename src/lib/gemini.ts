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
export async function analyzeFoodWithGemini(prompt: string, base64Image?: string) {
  try {
    // For fast and multimodal tasks, Gemini 1.5 Flash is recommended
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts: any[] = [prompt];

    if (base64Image) {
      // Assuming base64 string doesn't include the data:image/jpeg;base64, prefix
      // If it does, make sure to strip it before passing to this function.
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg", // or detect mime type dynamically
        },
      });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
