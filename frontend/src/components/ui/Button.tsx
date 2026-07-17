import { forwardRef } from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm',
      secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm',
    }

    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={`${base} ${variants[variant]} ${className ?? ''}`}
        {...props}
      >
        {loading ? 'Generating PDF...' : children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
