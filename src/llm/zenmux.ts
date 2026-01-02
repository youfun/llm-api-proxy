import OpenAI from 'openai'
import { IChat } from './base'
import { openaiBase } from './openai'

export function zenmux(env: Record<string, string>): IChat {
    const r = openaiBase({
        createClient: () => {
            return new OpenAI({
                baseURL: 'https://zenmux.ai/api/v1',
                apiKey: env.ZENMUX_API_KEY,
            })
        },
    })
    r.name = 'ZenMux'
    r.supportModels = env.ZENMUX_MODELS?.split(',').map((it) => it.trim()) ?? [
        'openai/gpt-4o',
        'openai/gpt-4o-mini',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3-5-sonnet-20240620',
        'anthropic/claude-3-5-sonnet@20240620',
        'google/gemini-2.0-flash-exp',
    ]
    r.requiredEnv = ['ZENMUX_API_KEY']
    return r
}
