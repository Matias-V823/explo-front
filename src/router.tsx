import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import PropiedadesPage from './pages/PropiedadesPage'
import ContactosPage from './pages/ContactosPage'
import BoletasPage from './pages/BoletasPage'
import MapaPage from './pages/MapaPage'
import TransaccionesPage from './pages/TransaccionesPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'propiedades', element: <PropiedadesPage /> },
      { path: 'contactos', element: <ContactosPage /> },
      { path: 'boletas', element: <BoletasPage /> },
      { path: 'mapa', element: <MapaPage /> },
      { path: 'transacciones', element: <TransaccionesPage /> },
    ],
  },
])

export default router
