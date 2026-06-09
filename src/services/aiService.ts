export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export const aiService = {
  async generateQuiz(category: string, count: number = 5): Promise<QuizQuestion[]> {
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, count }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed server API quiz generation");
      }

      return response.json();
    } catch (e) {
      console.error("AI quiz generation failed:", e);
      // Fallback questions
      return [
        {
          id: 1,
          question: `What is the most characteristic feature of ${category}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0
        }
      ];
    }
  }
};
