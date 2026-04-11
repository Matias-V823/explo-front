export interface Person {
  id: number
  name: string
  email: string
  phone: string
  company?: string
  avatar?: string
  role: 'propietario' | 'arrendador' | 'agente'
}

export interface PersonOption {
  id: number
  name: string
  paternalLastName: string
  roleId: number
}
