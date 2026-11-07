import { useEffect, useRef } from 'react'
import { scrollState } from './scrollStore'

// @group LondonTrigger : The place name in the hero, which quietly raises the city in the scene behind it

/** How far down the page the city stays up, as a share of the screen */
const LEAVE_AFTER = 0.2

/** Hover, or keyboard focus, shows it. On a touch screen there is no hover, so a tap shows it and a tap anywhere else hides it. */
export default function LondonTrigger() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const touched = useRef(false)

  const show = (on: boolean) => {
    scrollState.london = on
    const root = buttonRef.current?.closest<HTMLElement>('.imm')
    if (root) root.dataset.london = String(on)
  }

  useEffect(() => {
    const close = () => {
      scrollState.london = false
      const root = buttonRef.current?.closest<HTMLElement>('.imm')
      if (root) root.dataset.london = 'false'
    }
    const onScroll = () => {
      if (scrollState.london && window.scrollY > window.innerHeight * LEAVE_AFTER) close()
    }
    const onPress = (event: PointerEvent) => {
      if (scrollState.london && !buttonRef.current?.contains(event.target as Node)) close()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerdown', onPress)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerdown', onPress)
      close()
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type="button"
      className="imm-hero__place"
      onPointerEnter={(event) => event.pointerType !== 'touch' && show(true)}
      onPointerLeave={(event) => event.pointerType !== 'touch' && show(false)}
      onPointerDown={(event) => {
        touched.current = event.pointerType === 'touch'
      }}
      onClick={() => touched.current && show(!scrollState.london)}
      onFocus={(event) => event.currentTarget.matches(':focus-visible') && show(true)}
      onBlur={() => show(false)}
    >
      London, UK
    </button>
  )
}
