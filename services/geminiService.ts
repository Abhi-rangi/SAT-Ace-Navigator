import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course, CourseFormat, SearchCriteria, CourseCategory } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export interface LocalTutorResponse {
  text: string;
  groundingChunks: any[];
}

export const fetchTopSATCourses = async (criteria: SearchCriteria): Promise<Course[]> => {
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        provider: { type: Type.STRING },
        price: { type: Type.NUMBER, description: "Approximate price in USD" },
        priceDisplay: { type: Type.STRING },
        format: { 
          type: Type.STRING, 
          enum: Object.values(CourseFormat)
        },
        durationWeeks: { type: Type.NUMBER },
        scoreGuarantee: { type: Type.STRING },
        acceptanceImpact: { type: Type.STRING },
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        averageScoreIncrease: { type: Type.NUMBER },
        primaryCategory: { type: Type.STRING, enum: Object.values(CourseCategory) },
        link: { type: Type.STRING, description: "Official website URL for the course provider" },
        testimonials: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              studentName: { type: Type.STRING },
              text: { type: Type.STRING, description: "Review mentioning score increase and college acceptance" },
              scoreImprovement: { type: Type.NUMBER },
              acceptedCollege: { type: Type.STRING },
              rating: { type: Type.NUMBER, description: "1 to 5" }
            },
            required: ["studentName", "text", "scoreImprovement", "acceptedCollege", "rating"]
          }
        },
        acceptanceStats: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "Summary of alumni success" },
            topColleges: { type: Type.ARRAY, items: { type: Type.STRING } },
            averageAcceptanceRate: { type: Type.STRING, description: "e.g. '15% into Top 20 schools'" }
          },
          required: ["description", "topColleges", "averageAcceptanceRate"]
        }
      },
      required: [
        "id", "name", "provider", "price", "priceDisplay", "format", 
        "scoreGuarantee", "acceptanceImpact", "pros", "cons", 
        "averageScoreIncrease", "primaryCategory", "testimonials", "acceptanceStats", "link"
      ]
    }
  };

  const prompt = `
    Generate a list of the top 5 SAT preparation courses specifically categorized as '${criteria.category}'.
    
    Criteria:
    - Max Budget: $${criteria.budgetMax}
    - Format: ${criteria.preferredFormat}
    - Target Increase: ${criteria.targetScoreIncrease}+ points
    
    Focus on:
    1. REALISTIC score improvements.
    2. AUTHENTIC sounding testimonials that mention specific score jumps and college acceptances.
    3. College admission correlations (e.g., students getting into Ivy League, Stanford, MIT).
    
    If category is '${CourseCategory.MATH}', prioritize courses known for rigorous math drills (e.g., UWorld, specialized tutors).
    If category is '${CourseCategory.VERBAL}', prioritize reading/writing heavy courses (e.g., Erica Meltzer style, specialized).
    If category is '${CourseCategory.OVERALL}', prioritize balanced comprehensive courses (e.g., Princeton Review, Kaplan, Blueprint).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Course[];
  } catch (error) {
    console.error("Error fetching courses from Gemini:", error);
    return [];
  }
};

export const fetchAdmissionInsight = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Write a short, encouraging 2-sentence insight about how specific SAT improvements (math vs verbal) correlate with acceptance to engineering vs liberal arts top-tier colleges.",
        });
        return response.text || "High SAT scores remain a critical differentiator for top-tier university admissions.";
    } catch (e) {
        return "High SAT scores remain a critical differentiator for top-tier university admissions.";
    }
};

export const fetchLocalTutors = async (location: string): Promise<LocalTutorResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find highly-rated SAT tutors and test prep centers in or near ${location}. 
      Prioritize those with good reviews mentioning score improvements. 
      Provide a summary of the top 3-5 options.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    return {
      text: response.text || "No information found.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Error fetching local tutors:", error);
    throw error;
  }
};
