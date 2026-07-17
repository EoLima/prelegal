'use client'

import type { FormData } from '@/lib/types'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { RadioGroup } from '@/components/ui/RadioGroup'

type AgreementTermsProps = {
  form: FormData
  onUpdate: <K extends keyof FormData>(key: K, value: FormData[K]) => void
}

function AgreementTerms({ form, onUpdate }: AgreementTermsProps) {
  const radioStyle = { accentColor: '#209dd7' }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
      <h3 className="font-semibold text-base" style={{ color: '#032147' }}>Agreement Terms</h3>

      <FormField label="Purpose">
        <Textarea
          rows={2}
          value={form.purpose}
          onChange={(e) => onUpdate('purpose', e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Effective Date">
          <Input
            type="date"
            value={form.effectiveDate}
            onChange={(e) => onUpdate('effectiveDate', e.target.value)}
          />
        </FormField>

        <FormField label="Governing Law (State)">
          <Input
            placeholder="e.g. Delaware"
            value={form.governingLaw}
            onChange={(e) => onUpdate('governingLaw', e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Jurisdiction">
          <Input
            placeholder="e.g. New Castle, DE"
            value={form.jurisdiction}
            onChange={(e) => onUpdate('jurisdiction', e.target.value)}
          />
        </FormField>
      </div>

      <RadioGroup legend="MNDA Term">
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="radio"
            name="mndaTerm"
            checked={form.mndaTermType === 'expires'}
            onChange={() => onUpdate('mndaTermType', 'expires')}
            style={radioStyle}
          />
          <span style={{ color: '#1a1a2e' }}>Expires</span>
          <input
            type="number"
            min={1}
            className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2"
            style={{ borderColor: '#e0e0e0' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#209dd7'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(32, 157, 215, 0.2)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
            value={form.mndaTermYears}
            onChange={(e) => onUpdate('mndaTermYears', Number(e.target.value))}
          />
          <span style={{ color: '#888888' }}>year(s) from Effective Date</span>
        </label>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="radio"
            name="mndaTerm"
            checked={form.mndaTermType === 'continues'}
            onChange={() => onUpdate('mndaTermType', 'continues')}
            style={radioStyle}
          />
          <span style={{ color: '#1a1a2e' }}>Continues until terminated</span>
        </label>
      </RadioGroup>

      <RadioGroup legend="Term of Confidentiality">
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="radio"
            name="confidentiality"
            checked={form.confidentialityType === 'years'}
            onChange={() => onUpdate('confidentialityType', 'years')}
            style={radioStyle}
          />
          <input
            type="number"
            min={1}
            className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2"
            style={{ borderColor: '#e0e0e0' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#209dd7'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(32, 157, 215, 0.2)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
            value={form.confidentialityYears}
            onChange={(e) => onUpdate('confidentialityYears', Number(e.target.value))}
          />
          <span style={{ color: '#888888' }}>year(s) from Effective Date</span>
        </label>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="radio"
            name="confidentiality"
            checked={form.confidentialityType === 'perpetuity'}
            onChange={() => onUpdate('confidentialityType', 'perpetuity')}
            style={radioStyle}
          />
          <span style={{ color: '#1a1a2e' }}>In perpetuity</span>
        </label>
      </RadioGroup>

      <FormField label="Modifications" optional>
        <Textarea
          rows={2}
          value={form.modifications}
          onChange={(e) => onUpdate('modifications', e.target.value)}
        />
      </FormField>
    </div>
  )
}

export { AgreementTerms }
