
'use server';

/**
 * @fileOverview A flow for interpreting and extracting text from resume files.
 * Standardized on Gemini 1.5 Flash for high compatibility.
 */

import { ai, isAiConfigured, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'genkit';

const InterpretResumeInputSchema = z.object({
  fileDataUri: z.string().describe("The resume file as a data URI."),
});

export type InterpretResumeInput = z.infer<typeof InterpretResumeInputSchema>;

export async function interpretResume(input: InterpretResumeInput): Promise<string> {
  if (!isAiConfigured()) {
    throw new Error("AI Agent is offline. Please check your GOOGLE_GENAI_API_KEY.");
  }

  try {
    const { text } = await ai.generate({
      model: GEMINI_MODEL,
      prompt: [
        { media: { url: input.fileDataUri } },
        { text: 'Analyze this resume comprehensively. Extract the candidate name, professional summary, technical and soft skills, work history, and education. Provide a highly structured text interpretation optimized for job matching. Return plain text only.' },
      ],
      config: {
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      }
    });

    if (!text) {
      throw new Error("The AI model did not return data. The file might be unreadable.");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    if (error.message?.includes('429')) {
      throw new Error("Daily AI quota exceeded or too many requests. Please try again in a few minutes.");
    }
    
    if (error.message?.includes('400')) {
      throw new Error("Invalid request or expired API key. Please verify your key at Google AI Studio.");
    }
    
    throw new Error(`Failed to interpret resume: ${error.message || "Unknown error"}`);
  }
}
