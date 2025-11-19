import { GoogleGenAI } from "@google/genai";
import { Task, Release, CodeReview } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateArchitecturalInsight = async (context: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a senior 1C:Enterprise Architect assistant. 
      Analyze the following context and provide a concise, professional, and technical insight or recommendation.
      Keep it under 100 words. Focus on performance, maintainability, or release risks.
      
      Context: ${context}`,
    });
    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System unavailable for insights.";
  }
};

export const analyzeCodeSnippet = async (review: CodeReview): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Role: Senior 1C Developer.
      Task: Review this BSL (1C Internal Language) code snippet change.
      Object: ${review.objectName}
      Snippet: 
      ${review.changes}
      
      Provide a very brief bulleted list of potential issues (performance, standards) or praise if good. Max 3 points.`,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    return "Analysis unavailable.";
  }
};

export const generateReleaseNotes = async (release: Release, tasks: Task[]): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  const taskTitles = tasks.filter(t => t.releaseId === release.id).map(t => t.title).join(', ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create formal release notes for 1C Configuration Release ${release.version} (${release.codename}).
      Tasks included: ${taskTitles}.
      Format as markdown. Keep it professional and structured.`,
    });
    return response.text || "Could not generate notes.";
  } catch (error) {
    return "Generation failed.";
  }
};
