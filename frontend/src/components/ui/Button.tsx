import { forwardRef } from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]'
    const variants: Record<string, string> = {
      primary:
        'text-white shadow-sm hover:brightness-110',
      secondary:
        'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
      outline:
        'bg-transparent border-2 hover:brightness-110',
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: { backgroundColor: '#753991' },
      secondary: {},
      outline: { borderColor: '#209dd7', color: '#209dd7' },
    }

    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={`${base} ${variants[variant]} ${className ?? ''}`}
        style={variantStyles[variant]}
        {...props}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating PDF...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
