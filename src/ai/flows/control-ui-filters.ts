
'use server';

/**
 * @fileOverview Agentic AI for controlling job filters and search.
 * Robustly handles history and tool calls for the JobFlow Career Agent.
 */

import { ai, isAiConfigured, GEMINI_MODEL } from '@/ai/genkit';
import { z } from 'genkit';

const FilterSchema = z.object({
  role: z.string().optional(),
  skills: z.array(z.string()).optional(),
  datePosted: z.enum(['24h', 'week', 'month', 'anytime']).optional(),
  jobType: z.array(z.string()).optional(),
  workMode: z.array(z.string()).optional(),
  minMatchScore: z.number().optional(),
});

const ControlUIFiltersInputSchema = z.object({
  query: z.string(),
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'tool', 'system']),
    content: z.string(),
  })).optional(),
  resumeText: z.string(),
  currentFilters: FilterSchema,
});

export type ControlUIFiltersInput = z.infer<typeof ControlUIFiltersInputSchema>;

const updateFiltersTool = ai.defineTool(
  {
    name: 'updateFilters',
    description: 'Update the UI filters for role, skills, and work mode based on user request.',
    inputSchema: FilterSchema,
    outputSchema: z.string(),
  },
  async (input) => `Success: Filters updated to ${JSON.stringify(input)}`
);

export async function controlUIFilters(input: ControlUIFiltersInput) {
  const { query, history = [], resumeText, currentFilters } = input;

  if (!isAiConfigured()) {
    return {
      answer: "AI Agent is offline. Please verify your Gemini API key in the .env file.",
      history: [...history, { role: 'user', content: query }, { role: 'model', content: "Offline" }] as any,
    };
  }

  const systemPrompt = `You are JobFlow Agent. Help users find jobs by updating UI filters or answering questions.
  When a user asks to search for something, change filters, or mentions a role/skill, ALWAYS use the 'updateFilters' tool.
  
  Context:
  - User Resume: ${resumeText || 'No resume uploaded yet.'}
  - Current Filters: ${JSON.stringify(currentFilters)}
  
  Be helpful and professional.`;

  try {
    // Robust history sanitization for Gemini: Must alternate User/Model and start with User.
    const sanitizedHistory: any[] = [];
    
    (history || []).forEach((msg) => {
      const role = msg.role === 'model' ? 'model' : 'user';
      if (sanitizedHistory.length === 0) {
        if (role === 'user') {
          sanitizedHistory.push({ role, content: [{ text: msg.content }] });
        }
      } else {
        const last = sanitizedHistory[sanitizedHistory.length - 1];
        if (last.role === role) {
          last.content[0].text += `\n${msg.content}`;
        } else {
          sanitizedHistory.push({ role, content: [{ text: msg.content }] });
        }
      }
    });

    const response = await ai.generate({
      model: GEMINI_MODEL,
      system: systemPrompt,
      prompt: query,
      messages: sanitizedHistory,
      tools: [updateFiltersTool]
    });

    // Extract filter updates
    let updatedFilters = undefined;
    for (let i = response.messages.length - 1; i >= 0; i--) {
      const msg = response.messages[i];
      if (msg.role === 'model' && Array.isArray(msg.content)) {
        const toolCall = msg.content.find((p: any) => p.toolRequest && p.toolRequest.name === 'updateFilters');
        if (toolCall && toolCall.toolRequest) {
          updatedFilters = toolCall.toolRequest.input;
          break;
        }
      }
    }

    const finalHistory = response.messages
      .filter((m: any) => m.role === 'user' || m.role === 'model')
      .map((m: any) => ({
        role: m.role,
        content: Array.isArray(m.content)
          ? m.content.map((p: any) => p.text || '').join(' ').trim()
          : ''
      }))
      .filter((m: any) => m.content && m.content.length > 0);

    return {
      updatedFilters,
      answer: response.text || "I've updated your filters as requested.",
      history: finalHistory as any,
    };
  } catch (error: any) {
    console.error("Agent Error:", error);
    const errorMsg = error.message?.includes('429') 
      ? "I'm receiving too many requests. Please wait a moment." 
      : `Agent error: ${error.message || "Unknown error"}`;
    
    return { 
      answer: errorMsg, 
      history: [...history, { role: 'user', content: query }, { role: 'model', content: errorMsg }] as any 
    };
  }
}
