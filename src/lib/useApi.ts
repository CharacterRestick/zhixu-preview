import { useEffect, useState } from 'react'

export function useApi<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)

    loader()
      .then((value) => {
        if (alive) setData(value)
      })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : '加载失败')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
