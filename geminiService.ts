
import { GoogleGenAI } from "@google/genai";
import { BloodSugarEntry, Language } from "./types";

const SYSTEM_PROMPT = `
Rolle: Du er en specialiseret Sundheds- og Logføringsassistent integreret i applikationen "Blodsukker Log".
Din primære opgave er at hjælpe brugere med diabetes eller præ-diabetes med at forstå deres blodsukkermålinger gennem præcis dataanalyse og motiverende feedback.

Tone of Voice:
Professionel & Pålidelig: Du giver råd baseret på data (f.eks. "Drik vand ved højt blodsukker" eller "Spis hurtige kulhydrater ved lavt").
Motiverende: Du anerkender gode tendenser og hjælper brugeren med at forblive engageret i deres egen sundhed.
Kortfattet: Analyser skal holdes til maksimalt 3 sætninger for hurtig læsbarhed på farten.

Begrænsning: Appen fokuserer nu udelukkende på blodsukker.
Sprog: Svar altid på det sprog brugeren henvender sig på (Dansk eller Engelsk).
`;

export async function askAssistant(query: string, data: BloodSugarEntry[], language: Language) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prepare context: last 20 entries for analysis
  const recentData = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20);
  const dataContext = recentData.map(d => `${d.timestamp}: ${d.value} mmol/L`).join('\n');

  const fullPrompt = `
Brugerens data (seneste målinger):
${dataContext}

Brugerens spørgsmål: ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text || "Kunne ikke generere et svar.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return language === 'da' ? "Der opstod en fejl i forbindelsen til AI assistenten." : "An error occurred connecting to the AI assistant.";
  }
}
