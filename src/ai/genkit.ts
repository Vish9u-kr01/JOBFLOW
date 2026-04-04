
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Genkit initialization.
 * Standardizing on Gemini 1.5 Flash to resolve quota/expired key issues with newer models.
 */
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })
  ],
});

/**
 * Helper to check if AI is properly configured.
 */
export const isAiConfigured = () => !!process.env.GOOGLE_GENAI_API_KEY && process.env.GOOGLE_GENAI_API_KEY.length > 10;

/**
 * Global model identifier.
 * Using 'googleai/gemini-2.5-flash' for maximum compatibility and speed.
 */
export const GEMINI_MODEL = 'googleai/gemini-2.5-flash';
