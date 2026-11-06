// @group LegacyStyles : Third-party stylesheets only the older routes need, loaded on demand so the landing page never waits for them

const STYLESHEETS = [
  'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,400,500,600,700',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
  'https://unpkg.com/aos@2.3.1/dist/aos.css',
  'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css',
]

let loading: Promise<unknown> | null = null

function addStylesheet(href: string, before: Element | null) {
  return new Promise<void>((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    // A slow or failed CDN should degrade the styling, not hold the page back.
    link.onload = () => resolve()
    link.onerror = () => resolve()
    document.head.insertBefore(link, before)
  })
}

/** Inserts the stylesheets ahead of the app's own CSS, so the app keeps winning ties in the cascade. */
export function loadLegacyStyles() {
  if (!loading) {
    const firstSheet = document.head.querySelector('link[rel="stylesheet"], style')
    loading = Promise.all(STYLESHEETS.map((href) => addStylesheet(href, firstSheet)))
  }
  return loading
}
