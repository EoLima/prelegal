type FormFieldProps = {
  label: string
  children: React.ReactNode
  optional?: boolean
}

function FormField({ label, children, optional }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
        {optional ? (
          <span className="text-slate-400 font-normal lowercase ml-1">(optional)</span>
        ) : null}
      </label>
      {children}
    </div>
  )
}

export { FormField }
