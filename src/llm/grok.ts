import { IChat } from './base'
import OpenAI from 'openai'
import { openaiBase } from './openai'

export function grok(env: Record<string, string>): IChat {
  const r = openaiBase({
    createClient: () =>
      new OpenAI({
        apiKey: env.GROK_API_KEY,
        baseURL: 'https://api.x.ai/v1',
      }),
  })
  r.name = 'grok'
  r.requiredEnv = ['GROK_API_KEY']
  r.supportModels = [
    'grok-4.20-0309-reasoning',
    'grok-4.20-0309-non-reasoning',
    'grok-4.20-multi-agent-0309',
    'grok-4-1-fast-reasoning',
    'grok-4-1-fast-non-reasoning',
    'grok-4-1',
    'grok-3-latest',
    'grok-3-fast-latest',
    'grok-3-mini-latest',
    'grok-3-mini-fast-latest',
  ]
  return r
}
