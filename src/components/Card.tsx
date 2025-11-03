interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-dark-surface border border-dark-border rounded-lg hover:border-accent/50 transition-colors ${className}`}
    >
      {children}
    </div>
  )
}
