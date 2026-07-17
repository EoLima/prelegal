type RadioGroupProps = {
  legend: string
  children: React.ReactNode
}

function RadioGroup({ legend, children }: RadioGroupProps) {
  return (
    <fieldset className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 space-y-3">
      <legend className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}

export { RadioGroup }
