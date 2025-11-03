interface RyCardProps {
  children: React.ReactNode
  className?: string
}

export const RyCard = ({ children, className = '' }: RyCardProps) => {
  return (
    <div
      className={`bg-dark-surface border border-dark-border rounded-lg hover:border-accent/50 transition-colors p-4 ${className}`}
    >
      {children}
    </div>
  )
}
