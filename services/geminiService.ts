
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard, QuizSettings } from "../types";

const API_KEY = process.env.API_KEY || '';

export const generateFlashcards = async (pdfText: string, settings: QuizSettings): Promise<Flashcard[]> => {
  if (!API_KEY) {
    throw new Error("API Key não configurada.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Com base no seguinte texto extraído de um PDF, crie ${settings.count} cartões de estudo (flashcards).
    Nível de dificuldade esperado: ${settings.difficulty}.
    O idioma deve ser o mesmo do texto fornecido (predominantemente Português).
    Certifique-se de que as perguntas sejam desafiadoras e as respostas concisas e explicativas.

    Texto base:
    ${pdfText.substring(0, 15000)} // Limiting to stay within token context for safety
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "A pergunta do cartão." },
            answer: { type: Type.STRING, description: "A resposta correta." }
          },
          required: ["question", "answer"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as Flashcard[];
  } catch (error) {
    console.error("Erro ao parsear resposta do Gemini:", error);
    return [];
  }
};
