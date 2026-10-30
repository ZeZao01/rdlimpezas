export function asset(path) {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`
}

export function srcsetFor(url) {
  const stem = url.replace(/\.jpg$/, '')
  return `${stem}-480.jpg 480w, ${stem}-800.jpg 800w, ${url} 1024w`
}
