type RadioGroupProps = {
  legend: string
  children: React.ReactNode
}

function RadioGroup({ legend, children }: RadioGroupProps) {
  return (
    <fieldset className="rounded-lg border p-4 space-y-3" style={{ borderColor: '#e0e0e0', backgroundColor: '#fafbfc' }}>
      <legend className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: '#888888' }}>
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}

export { RadioGroup }
