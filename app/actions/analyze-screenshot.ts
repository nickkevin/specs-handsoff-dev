'use server'

import { generateText } from 'ai'

const VISION_SYSTEM_PROMPT = `Role: You are a Senior Front-end Architect and Design Systems Lead. Your goal is to translate UI screenshots into "Pixel-Perfect" technical specifications for a developer.

Analysis Requirements:

Visual Hierarchy: Identify the primary, secondary, and tertiary elements.

Layout Logic: Assume a mobile-first, responsive approach. Specify if a container should use display: flex or display: grid.

The 8pt Rule: Round all guessed pixel values to the nearest multiple of 4 or 8 to align with standard design systems.

Color Tokens: Identify hex codes. If a color looks like a standard "Success" or "Error" red/green, label it as a semantic token (e.g., color-text-critical).

Typography: Estimate font-weight (e.g., 400, 600, 700) and line-height.

Output Format (Markdown):

1. Layout & Scaffolding
Container: [e.g., Flexbox, space-between, padding: 24px]

Grid System: [e.g., 12-column bootstrap or custom CSS grid]

2. Design Tokens
Colors: [List Hex codes and usage]

Typography: [Font-size, Weight, Leading]

3. Component Breakdown
For each unique component (Button, Card, Input), list:

Normal State: [CSS properties]

Hover/Active States: [Inferred changes, e.g., opacity-80]

Edge Cases: [What happens if the text is too long?]

4. Accessibility (a11y)
Contrast: Flag any text that looks like it might fail WCAG AA contrast ratios.

ARIA: Suggest aria-labels for icon-only buttons.

Tone: Professional, technical, and concise. No fluff.`

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
