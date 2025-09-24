import { useEffect, useRef } from "react"

/**
 * Calls onTimeout after `timeoutMs` of no user activity (mousemove, keydown, click, touch).
 * Returns a cleanup function automatically via hook unmount.
 */
export function useInactivityLogout(onTimeout: () => void, timeoutMs = 30 * 60 * 1000) {
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        onTimeout()
      }, timeoutMs)
    }

    // Start timer on mount
    reset()

    const handlers = ["mousemove", "keydown", "click", "touchstart"].map((evt) => {
      const fn = () => reset()
      window.addEventListener(evt, fn)
      return { evt, fn }
    })

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      handlers.forEach(({ evt, fn }) => window.removeEventListener(evt, fn))
    }
  }, [onTimeout, timeoutMs])
}
