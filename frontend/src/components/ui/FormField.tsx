type FormFieldProps = {
  label: string
  children: React.ReactNode
  optional?: boolean
}

function FormField({ label, children, optional }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#888888' }}>
        {label}
        {optional ? (
          <span className="font-normal lowercase ml-1" style={{ color: '#888888' }}>(optional)</span>
        ) : null}
      </label>
      {children}
    </div>
  )
}

export { FormField }
