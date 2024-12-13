import OpenAI from 'openai';
import { Assistant } from 'openai/resources/beta/assistants';
import { tools } from '../tools/allTools.ts';

export async function createAssistant(client: OpenAI): Promise<Assistant> {
  return await client.beta.assistants.create({
    model: 'gpt-4o-mini',
    name: 'Solanagent',
    instructions: 'You are a helpful assistant that can help with Solana blockchain operations.',
    tools: Object.values(tools).map((tool) => tool.definition),
  });
}
