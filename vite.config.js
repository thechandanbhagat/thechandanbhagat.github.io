import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

const SITE = 'https://me.chandanbhagat.com.np'

// @group RoutePages : GitHub Pages only returns 200 for files that exist, so each client route gets a real page with its own metadata
const ROUTE_META = JSON.parse(readFileSync(new URL('./src/data/routeMeta.json', import.meta.url), 'utf8'))
// /groupcode ships its own page from public/, and / is index.html itself
const ROUTE_PAGES = ['/dossier', '/terminal', '/classic', '/portfolio'].map((path) => ({ path: path.slice(1), ...ROUTE_META[path] }))

function pageFor(html, { path, title, description }) {
  const url = `${SITE}/${path}/`
  const setContent = (source, attribute, name, value) =>
    source.replace(new RegExp(`(<meta ${attribute}="${name}" content=")[^"]*`), (_, start) => start + value)

  let page = html
    .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*/, (_, start) => start + url)
  page = setContent(page, 'name', 'description', description)
  page = setContent(page, 'property', 'og:title', title)
  page = setContent(page, 'property', 'og:description', description)
  page = setContent(page, 'property', 'og:url', url)
  page = setContent(page, 'name', 'twitter:title', title)
  page = setContent(page, 'name', 'twitter:description', description)
  return page
}

function routePages() {
  let outDir = 'dist'
  return {
    name: 'route-pages',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')
      ROUTE_PAGES.forEach((route) => {
        const dir = join(outDir, route.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), pageFor(html, route))
      })
    },
  }
}

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, { loader: 'jsx' })
      },
    },
    react(),
    routePages(),
  ],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
