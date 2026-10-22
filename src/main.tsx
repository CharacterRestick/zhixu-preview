import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

const params = new URLSearchParams(window.location.search)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (params.get('static') === '1' || reduceMotion) {
  document.documentElement.classList.add('zx-static')
}

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename || undefined}>
    <App />
  </BrowserRouter>,
)
