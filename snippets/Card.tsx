interface CardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export default function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <article className={cn('bg-white p-4 rounded-lg shadow-card', className)} {...props}>
      {children}
    </article>
  )
}
