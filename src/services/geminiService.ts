export const geminiService = {
  generateQuiz: async (topic: string, count: number, difficulty: string, language: 'en' | 'hi' = 'en') => {
    const response = await fetch("/api/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, count, difficulty, language }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to generate quiz from Server AI.");
    }

    return response.json();
  }
};
