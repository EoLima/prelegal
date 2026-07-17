'use client'

import type { PartyInfo } from '@/lib/types'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

type PartyCardProps = {
  title: string
  index: number
  party: PartyInfo
  onChange: (field: string, value: string) => void
}

const fields: { label: string; key: keyof PartyInfo; type?: string }[] = [
  { label: 'Company', key: 'company' },
  { label: 'Print Name', key: 'name' },
  { label: 'Title', key: 'title' },
  { label: 'Notice Address', key: 'noticeAddress' },
  { label: 'Date', key: 'date', type: 'date' },
]

function PartyCard({ title, index, party, onChange }: PartyCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3.5 shadow-sm">
      <h3 className="font-semibold text-slate-800 text-base flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
          {index}
        </span>
        {title}
      </h3>
      {fields.map((f) => (
        <FormField key={f.key} label={f.label}>
          <Input
            type={f.type ?? 'text'}
            placeholder={f.label}
            value={party[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
          />
        </FormField>
      ))}
    </div>
  )
}

export { PartyCard }
