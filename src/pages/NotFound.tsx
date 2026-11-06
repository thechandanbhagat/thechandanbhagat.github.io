import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './NotFound.css'

// @group NotFound : Shown for any address the router does not know, in the same style as the landing page

export default function NotFound() {
  const { pathname } = useLocation()

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Page not found | Chandan Bhagat'
    document.body.classList.add('imm-body')
    return () => {
      document.title = previousTitle
      document.body.classList.remove('imm-body')
    }
  }, [])

  return (
    <main className="nf">
      <p className="nf__trace">
        GET <span className="nf__path">{pathname}</span> <span className="nf__status">404</span>
      </p>
      <h1 className="nf__title">No route to this page.</h1>
      <p className="nf__body">Nothing is listening at this address. It may have moved, or the link may be out of date.</p>
      <div className="nf__actions">
        <Link to="/" className="nf__btn nf__btn--primary">
          Back to home
        </Link>
        <Link to="/dossier" className="nf__btn">
          Read the dossier
        </Link>
      </div>
    </main>
  )
}
