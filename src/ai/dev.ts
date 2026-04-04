import { config } from 'dotenv';
config();

import '@/ai/flows/score-jobs-against-resume.ts';
import '@/ai/flows/control-ui-filters.ts';
import '@/ai/flows/interpret-resume-flow.ts';
