import OpenAI from 'openai';
import { Assistant } from 'openai/resources/beta/assistants';
import { tools } from '../tools/allTools.ts';
import { assistantPrompt } from '../const/prompt.ts';

export async function createAssistant(client: OpenAI): Promise<Assistant> {
  return await client.beta.assistants.create({
    model: 'gpt-4o-mini',
    name: 'Solanagent',
    instructions: assistantPrompt,
    tools: Object.values(tools).map((tool) => tool.definition),
  });
}
