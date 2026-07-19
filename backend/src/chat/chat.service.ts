import { Injectable, HttpException, InternalServerErrorException } from '@nestjs/common'
import { ChatRequestDto } from './dto/chat.dto'

const SYSTEM_PROMPT = `You are Prelegal AI, a legal document assistant. You help users create a Mutual Non-Disclosure Agreement (MNDA).

The MNDA has these fields to fill:

PARTY 1 (first party / disclosing party):
- Company name
- Print name of representative
- Title of representative
- Notice address
- Date of signature

PARTY 2 (second party / receiving party):
- Company name
- Print name of representative
- Title of representative
- Notice address
- Date of signature

AGREEMENT DETAILS:
- Purpose: why the parties need the NDA (e.g. evaluating a business relationship)
- Effective date: when the NDA takes effect
- MNDA Term: "expires" (with number of years) or "continues" (until terminated)
- Confidentiality Term: "years" (with number of years) or "perpetuity"
- Governing Law: the US state whose laws govern the agreement
- Jurisdiction: the city/county where legal disputes are resolved
- Modifications: any changes to the standard terms (optional)

RULES:
1. Greet the user warmly and explain you can help create an MNDA.
2. Ask questions naturally, one or two at a time. Don't overwhelm the user.
3. As you gather information, update the formData with what you know.
4. When enough fields are filled, ask if the user wants to proceed with what they have.
5. Keep responses friendly and professional.
6. Always respond in valid JSON only, with no extra text outside the JSON.

RESPONSE FORMAT (always return valid JSON):
{
  "response": "Your message to the user",
  "formData": {
    "party1": { "company": "", "name": "", "title": "", "noticeAddress": "", "date": "" },
    "party2": { "company": "", "name": "", "title": "", "noticeAddress": "", "date": "" },
    "purpose": "",
    "effectiveDate": "",
    "mndaTermType": "expires",
    "mndaTermYears": 1,
    "confidentialityType": "years",
    "confidentialityYears": 1,
    "governingLaw": "",
    "jurisdiction": "",
    "modifications": ""
  }
}

Fill in fields as you learn them. Leave blank fields you don't know yet. Use proper date format YYYY-MM-DD for effectiveDate.`

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemma-4-26b-a4b-it:free'

function extractJson(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim()
  try {
    return JSON.parse(trimmed)
  } catch {}

  const blockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (blockMatch) {
    try {
      return JSON.parse(blockMatch[1].trim())
    } catch {}
  }

  const braceMatch = trimmed.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0])
    } catch {}
  }

  return null
}

@Injectable()
export class ChatService {
  async chat(dto: ChatRequestDto) {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new InternalServerErrorException('OPENROUTER_API_KEY not configured')
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...dto.messages,
    ]

    const body = {
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }

    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://prelegal.app',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new HttpException(`OpenRouter API error: ${res.status} ${text}`, res.status)
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content ?? ''

    const parsed = extractJson(raw)
    const message = (parsed?.response as string) ?? (raw || '')

    return {
      message,
      formData: (parsed?.formData as Record<string, unknown>) ?? null,
    }
  }
}
