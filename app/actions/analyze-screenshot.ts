'use server'

import { generateText } from 'ai'

const VISION_SYSTEM_PROMPT = `You are a Senior Front-end Architect. Analyze this UI screenshot and write a technical handoff spec. Be extremely precise about padding (px), font-weights, and CSS layout logic. Identify potential accessibility issues and list all hover/active states for the buttons. Return the result as Markdown.`

export type AnalyzeResult =
  | { markdown: string; error?: never }
  | { markdown: null; error: string }

export async function analyzeScreenshot(imageUrl: string): Promise<AnalyzeResult> {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return {
      markdown: null,
      error:
        'OpenAI API key is not configured. Add OPENAI_API_KEY in your Vercel project settings (or in .env.local for local development).',
    }
  }

  try {
    const result = await generateText({
      model: 'openai/gpt-4o',
      system: VISION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', image: imageUrl },
            {
              type: 'text',
              text: 'Analyze this UI screenshot and return your technical handoff spec as Markdown.',
            },
          ],
        },
      ],
    })

    return { markdown: result.text }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Analysis request failed'
    const isAuth =
      message.includes('API key') ||
      message.includes('401') ||
      message.includes('authentication')
    const isRateLimit = message.includes('rate limit') || message.includes('429')
    const isConfig =
      message.includes('model') || message.includes('invalid') || isAuth

    if (isConfig) {
      return {
        markdown: null,
        error: 'OpenAI API configuration error. Check that OPENAI_API_KEY is valid and has access to GPT-4 Vision.',
      }
    }
    if (isRateLimit) {
      return {
        markdown: null,
        error: 'OpenAI rate limit reached. Please try again in a moment.',
      }
    }
    return {
      markdown: null,
      error: `Analysis failed: ${message}`,
    }
  }
}
