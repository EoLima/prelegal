import { Injectable, HttpException, InternalServerErrorException } from '@nestjs/common'
import { ChatRequestDto } from './dto/chat.dto'

const DOCUMENTS = [
  { name: 'Mutual Non-Disclosure Agreement', desc: 'Standard mutual NDA for protecting confidential information between two parties', fields: 'party1 info, party2 info, purpose, effective date, NDA term, confidentiality term, governing law, jurisdiction, modifications' },
  { name: 'Mutual Non-Disclosure Agreement (Cover Page)', desc: 'Cover page template for executing the Mutual NDA', fields: 'party1 info, party2 info, effective date, governing law' },
  { name: 'Cloud Service Agreement', desc: 'Standard agreement for selling and buying cloud software and SaaS products', fields: 'provider info, customer info, service description, fees, term, sla terms, data handling' },
  { name: 'Design Partner Agreement', desc: 'Standard agreement for design partnerships and co-development', fields: 'partner info, project scope, IP ownership, compensation, timeline' },
  { name: 'Service Level Agreement', desc: 'SLA designed to complement the Cloud Service Agreement', fields: 'provider info, customer info, uptime guarantees, credits, support hours' },
  { name: 'Professional Services Agreement', desc: 'Standard agreement for professional services engagements', fields: 'consultant info, client info, scope of work, fees, timeline, deliverables' },
  { name: 'Data Processing Agreement', desc: 'Standard DPA for compliance with data protection regulations', fields: 'controller info, processor info, data types, security measures, sub-processors' },
  { name: 'Software License Agreement', desc: 'Standard agreement for licensing software to customers', fields: 'licensor info, licensee info, license type, fees, term, restrictions' },
  { name: 'Partnership Agreement', desc: 'Standard agreement for formalizing business partnerships', fields: 'partner info, contributions, profit sharing, governance, dissolution terms' },
  { name: 'Pilot Agreement', desc: 'Short-term trial or evaluation agreement for prospective customers', fields: 'provider info, customer info, pilot scope, duration, success criteria' },
  { name: 'Business Associate Agreement', desc: 'Standard BAA for HIPAA compliance between covered entities and business associates', fields: 'covered entity info, business associate info, permitted uses, safeguards, breach notification' },
  { name: 'AI Addendum', desc: 'Standard addendum for AI-related terms and conditions', fields: 'provider info, customer info, AI usage scope, data training restrictions, liability' },
]

const DOCS_LIST = DOCUMENTS.map((d, i) => `${i + 1}. ${d.name} — ${d.desc}`).join('\n')

const SYSTEM_PROMPT = `You are Prelegal AI, a legal document assistant at Prelegal, a premium legal document generation service.

AVAILABLE DOCUMENTS:
${DOCS_LIST}

RULES:
1. Greet the user warmly and ask what legal document they need. List the available documents if they seem unsure.
2. If the user asks for a document NOT in the list, explain you cannot generate that specific document, then suggest the closest available alternative from the list above. For example, if they ask for a "Service Contract", suggest the Professional Services Agreement or Software License Agreement.
3. Once the user selects a document, guide them through the creation process by asking about the relevant fields one or two at a time.
4. After every response, if there are still unfilled fields, ALWAYS ask a follow-up question. Never end a response without a question unless ALL fields are complete.
5. Keep responses friendly, professional, and concise.
6. Always respond in valid JSON only, with no extra text outside the JSON.

For the Mutual Non-Disclosure Agreement (MNDA), use these fields in formData:
PARTY 1 and PARTY 2:
- company, name, title, noticeAddress, date
AGREEMENT:
- purpose, effectiveDate, mndaTermType ("expires"/"continues"), mndaTermYears, confidentialityType ("years"/"perpetuity"), confidentialityYears, governingLaw, jurisdiction, modifications

For other document types, include whatever fields you have gathered in formData as a flat object. The system will store them for later use.

RESPONSE FORMAT (always return valid JSON):
{
  "response": "Your message to the user. Always end with a question unless all fields are complete.",
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

Fill in fields as you learn them. Leave blank fields you don't know yet. Use YYYY-MM-DD for dates.`

const OPENCODE_BASE_URL = process.env.OPENCODE_GO_BASE_URL ?? 'https://api.opencode.ai/go/v1'
const MODEL = 'opencode-go/deepseek-v4-flash'

function extractJson(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim()

  const blockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (blockMatch) {
    try { return JSON.parse(blockMatch[1].trim()) } catch {}
  }

  const braceMatch = trimmed.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]) } catch {}
  }

  try { return JSON.parse(trimmed) } catch {}

  return null
}

@Injectable()
export class ChatService {
  async chat(dto: ChatRequestDto) {
    const apiKey = process.env.OPENCODE_GO_API_KEY
    if (!apiKey) {
      throw new InternalServerErrorException('OPENCODE_GO_API_KEY not configured')
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
      response_format: { type: 'json_object' },
    }

    const res = await fetch(`${OPENCODE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new HttpException(`API error: ${res.status} ${text}`, res.status)
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
