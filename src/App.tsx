import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Immersive from './pages/Immersive/Immersive'
import { loadLegacyStyles } from './legacyStyles'
import routeMeta from './data/routeMeta.json'

// @group Routes : The landing page ships in the first download, every other route loads when it is visited

/** Older routes share the template stylesheets, so they wait for them and never flash unstyled. */
function legacyRoute(load: () => Promise<{ default: ComponentType }>) {
  return lazy(async () => {
    const [page] = await Promise.all([load(), loadLegacyStyles(), import('./legacyCss')])
    return page
  })
}

const PortfolioDossier = legacyRoute(() => import('./pages/PortfolioDossier'))
const TerminalPortfolio = legacyRoute(() => import('./pages/TerminalPortfolio'))
const HomePage = legacyRoute(() => import('./pages/HomePage'))
const GroupCode = legacyRoute(() => import('./pages/GroupCode'))
const Gallery = lazy(() => import('./pages/Gallery/Gallery'))
const Software = lazy(() => import('./pages/Software/Software'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Each route's HTML sets the title on a full load, this keeps it right when moving between routes in the app. */
function useRouteTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const route = pathname.replace(/\/+$/, '') || '/'
    const meta = routeMeta[route as keyof typeof routeMeta]
    if (meta) document.title = meta.title
  }, [pathname])
}

export default function App() {
  useRouteTitle()

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Immersive />} />
        <Route path="/dossier" element={<PortfolioDossier />} />
        <Route path="/terminal" element={<TerminalPortfolio />} />
        <Route path="/classic" element={<HomePage />} />
        <Route path="/portfolio" element={<Gallery />} />
        <Route path="/software" element={<Software />} />
        <Route path="/groupcode" element={<GroupCode />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
