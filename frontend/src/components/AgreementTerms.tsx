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
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
      <h3 className="font-semibold text-slate-800 text-base">Agreement Terms</h3>

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
            className="accent-slate-800"
          />
          <span className="text-slate-700">Expires</span>
          <input
            type="number"
            min={1}
            className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-slate-400/20"
            value={form.mndaTermYears}
            onChange={(e) => onUpdate('mndaTermYears', Number(e.target.value))}
          />
          <span className="text-slate-600">year(s) from Effective Date</span>
        </label>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="radio"
            name="mndaTerm"
            checked={form.mndaTermType === 'continues'}
            onChange={() => onUpdate('mndaTermType', 'continues')}
            className="accent-slate-800"
          />
          <span className="text-slate-700">Continues until terminated</span>
        </label>
      </RadioGroup>

      <RadioGroup legend="Term of Confidentiality">
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="radio"
            name="confidentiality"
            checked={form.confidentialityType === 'years'}
            onChange={() => onUpdate('confidentialityType', 'years')}
            className="accent-slate-800"
          />
          <input
            type="number"
            min={1}
            className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-slate-400/20"
            value={form.confidentialityYears}
            onChange={(e) => onUpdate('confidentialityYears', Number(e.target.value))}
          />
          <span className="text-slate-600">year(s) from Effective Date</span>
        </label>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <input
            type="radio"
            name="confidentiality"
            checked={form.confidentialityType === 'perpetuity'}
            onChange={() => onUpdate('confidentialityType', 'perpetuity')}
            className="accent-slate-800"
          />
          <span className="text-slate-700">In perpetuity</span>
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
