import { useEffect, useRef, useState } from 'react'

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function useInView<T extends Element>({ enter = 0.2 }: { enter?: number } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= enter) setInView(true)
          else if (!e.isIntersecting) setInView(false)
        }
      },
      { threshold: [0, enter] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enter])
  return { ref, inView }
}

/**
 * Compositor-friendly scroll progress CSS variable writer (`--sp` from 0 to 1).
 * Automatically pauses via IntersectionObserver when offscreen and respects reduced motion.
 */
export function useScrollProgressVar<T extends HTMLElement>(varName = '--sp') {
  const ref = useRef<T>(null)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let top = 0
    let height = 1
    let vh = window.innerHeight
    const measure = () => {
      const r = el.getBoundingClientRect()
      top = r.top + window.scrollY
      height = r.height
      vh = window.innerHeight
    }
    let raf = 0
    let running = false
    let last = -1
    const tick = () => {
      if (!running) return
      const p = clamp01((window.scrollY + vh - top) / (vh + height))
      if (Math.abs(p - last) > 0.0005) {
        last = p
        el.style.setProperty(varName, p.toFixed(4))
      }
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e) return
        if (e.isIntersecting && !running) {
          running = true
          measure()
          raf = requestAnimationFrame(tick)
        } else if (!e.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '160px 0px 160px 0px' },
    )
    io.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [reduced, varName])
  return ref
}
