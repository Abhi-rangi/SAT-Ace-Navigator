
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course, CourseFormat, SearchCriteria, CourseCategory } from "../types";

const apiKey = process.env.API_KEY;

export interface LocalTutorResponse {
  text: string;
  groundingChunks: any[];
}

export interface TutorFilters {
  rating: string;
  price: string;
  availability: string;
}

export interface PracticeResource {
  title: string;
  description: string;
  link: string;
  type: 'Test' | 'Syllabus' | 'Drill';
}

export const fetchTopSATCourses = async (criteria: SearchCriteria): Promise<Course[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        provider: { type: Type.STRING },
        price: { type: Type.NUMBER },
        priceDisplay: { type: Type.STRING },
        format: { type: Type.STRING, enum: Object.values(CourseFormat) },
        durationWeeks: { type: Type.NUMBER },
        scoreGuarantee: { type: Type.STRING },
        acceptanceImpact: { type: Type.STRING },
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        averageScoreIncrease: { type: Type.NUMBER },
        primaryCategory: { type: Type.STRING, enum: Object.values(CourseCategory) },
        link: { type: Type.STRING },
        testimonials: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              studentName: { type: Type.STRING },
              text: { type: Type.STRING },
              scoreImprovement: { type: Type.NUMBER },
              acceptedCollege: { type: Type.STRING },
              rating: { type: Type.NUMBER }
            },
            required: ["studentName", "text", "scoreImprovement", "acceptedCollege", "rating"]
          }
        },
        acceptanceStats: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            topColleges: { type: Type.ARRAY, items: { type: Type.STRING } },
            averageAcceptanceRate: { type: Type.STRING }
          },
          required: ["description", "topColleges", "averageAcceptanceRate"]
        }
      },
      required: ["id", "name", "provider", "price", "priceDisplay", "format", "scoreGuarantee", "acceptanceImpact", "pros", "cons", "averageScoreIncrease", "primaryCategory", "testimonials", "acceptanceStats", "link"]
    }
  };

  const prompt = `Generate a list of the top 5 SAT preparation courses specifically categorized as '${criteria.category}'. Budget: $${criteria.budgetMax}, Format: ${criteria.preferredFormat}, Target Increase: ${criteria.targetScoreIncrease}+ points. Focus on college admission success for high-tier schools.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchAdmissionInsight = async (): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Write a short, encouraging 2-sentence insight about how specific SAT improvements correlate with elite college acceptance.",
        });
        return response.text || "High scores open doors to elite opportunities.";
    } catch (e) {
        return "High scores open doors to elite opportunities.";
    }
};

export const fetchLocalTutors = async (location: string, subject: string, filters?: TutorFilters): Promise<LocalTutorResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let filterText = "";
    if (filters) {
        if (filters.rating) filterText += ` with rating ${filters.rating}+`;
        if (filters.price) filterText += ` price ${filters.price}`;
        if (filters.availability) filterText += ` available ${filters.availability}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `Find tutors for Grade 8-12 students specializing in '${subject}' in ${location}${filterText}. Provide a detailed summary.`,
      config: { tools: [{ googleMaps: {} }] },
    });

    return {
      text: response.text || "No information found.",
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchStateResources = async (location: string): Promise<PracticeResource[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        link: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['Test', 'Syllabus', 'Drill'] }
      },
      required: ["title", "description", "link", "type"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find free SAT practice materials, latest syllabus updates (including NJ or specific state-wide requirements), and drill resources for students in ${location}. Return 4 highly relevant items.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
};
