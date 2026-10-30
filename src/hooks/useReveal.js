import { useEffect } from 'react'

export function useReveal(deps = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal:not(.is-visible)')
    if (!nodes.length) return undefined

    const revealAll = () => nodes.forEach((node) => node.classList.add('is-visible'))

    if (typeof IntersectionObserver === 'undefined') {
      revealAll()
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    )

    nodes.forEach((node) => observer.observe(node))

    const failsafe = window.setTimeout(() => {
      nodes.forEach((node) => {
        if (node.classList.contains('is-visible')) return
        const rect = node.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) node.classList.add('is-visible')
      })
    }, 2500)

    return () => {
      window.clearTimeout(failsafe)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
