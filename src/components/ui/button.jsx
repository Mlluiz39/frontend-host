export function Button({
  children,
  className = '',
  variant = 'default',
  ...props
}) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors'

  const variants = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  }

  const variantClass = variants[variant] || variants.default

  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
