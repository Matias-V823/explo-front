import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PropertiesPage from './pages/PropertiesPage'
import ContactsPage from './pages/ContactsPage'
import TicketsPage from './pages/TicketsPage'
import MapaPage from './pages/MapPage'
import TransactionsPage from './pages/TransactionsPage'
import PropertyFormPage from './pages/PropertyFormPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import TasksPage from './pages/TasksPage'

const router = createBrowserRouter([
  {
    path: '/iniciar-sesion',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'propiedades', element: <PropertiesPage /> },
          { path: 'propiedades/:id', element: <PropertyDetailPage /> },
          { path: 'propiedades/nueva', element: <PropertyFormPage /> },
          { path: 'propiedades/:id/editar', element: <PropertyFormPage /> },
          { path: 'contactos', element: <ContactsPage /> },
          { path: 'boletas', element: <TicketsPage /> },
          { path: 'mapa', element: <MapaPage /> },
          { path: 'transacciones', element: <TransactionsPage /> },
          { path: 'tasks', element: <TasksPage /> }
        ],
      },
    ],
  },
])

export default router
