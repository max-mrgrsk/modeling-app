import { useEffect, useState } from 'react'

const Loading = ({ children }: React.PropsWithChildren) => {
  const [hasLongLoadTime, setHasLongLoadTime] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLongLoadTime(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [setHasLongLoadTime])
  return (
    <div
      className="body-bg flex flex-col items-center justify-center h-screen"
      data-testid="loading"
    >
      <svg viewBox="0 0 10 10" className="w-8 h-8">
        <circle
          cx="5"
          cy="5"
          r="4"
          stroke="var(--primary)"
          fill="none"
          strokeDasharray="4, 4"
          className="animate-spin origin-center"
        />
      </svg>
      <p className="text-base mt-4 text-primary">{children || 'Loading'}</p>
      <p
        className={
          'text-sm mt-4 text-primary/60 transition-opacity duration-500' +
          (hasLongLoadTime ? ' opacity-100' : ' opacity-0')
        }
      >
        Loading is taking longer than expected.
      </p>
    </div>
  )
}

export default Loading
