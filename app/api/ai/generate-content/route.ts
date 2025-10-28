import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'blog', provider = 'openai' } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const client = provider === 'openrouter' ? openrouter : openai
    const model = provider === 'openrouter' ? 'meta-llama/llama-3.1-8b-instruct:free' : 'gpt-3.5-turbo'

    const systemPrompt = type === 'blog' 
      ? 'You are a health and wellness content writer. Create engaging, informative blog content about health supplements.'
      : 'You are a marketing copywriter. Create compelling product descriptions and marketing copy.'

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    return NextResponse.json({
      content: completion.choices[0]?.message?.content || '',
      provider,
      model
    })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}