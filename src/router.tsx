import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TwoFactorPage from './pages/TwoFactorPage'
import PropertiesPage from './pages/PropertiesPage'
import ContactsPage from './pages/ContactsPage'
import TicketsPage from './pages/TicketsPage'
import MapaPage from './pages/MapPage'
import TransactionsPage from './pages/TransactionsPage'
import PropertyFormPage from './pages/PropertyFormPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import TasksPage from './pages/TasksPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/iniciar-sesion', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
      { path: '/verificar', element: <TwoFactorPage /> },
    ],
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
          { path: 'tasks', element: <TasksPage /> },
          { path: 'calendario', element: <CalendarPage /> },
          { path: 'configuracion', element: <SettingsPage /> },
        ],
      },
    ],
  },
])

export default router
