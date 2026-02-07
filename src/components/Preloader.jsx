import { useEffect, useState } from 'react'

export default function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleLoad = () => setVisible(false)
    if (document.readyState === 'complete') {
      setVisible(false)
    } else {
      window.addEventListener('load', handleLoad)
    }
    // Fallback: remove preloader after 2 seconds
    const timeout = setTimeout(() => setVisible(false), 2000)
    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(timeout)
    }
  }, [])

  if (!visible) return null
  return <div id="preloader"></div>
}
