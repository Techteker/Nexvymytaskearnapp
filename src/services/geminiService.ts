import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export const geminiService = {
  generateQuiz: async (topic: string, count: number, difficulty: string, language: 'en' | 'hi' = 'en') => {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Generate a quiz about "${topic}" with ${count} multiple choice questions.
      Difficulty level: ${difficulty}.
      Language: ${language === 'hi' ? 'Hindi' : 'English'}.
      Return the response strictly as a JSON array of objects with this schema:
      [{ "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": number }]
      correctAnswer should be the index (0-3) of the correct option.
      Do not include any markdown or extra text, just the raw JSON array.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '');
      if (!text) throw new Error("Empty response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};
