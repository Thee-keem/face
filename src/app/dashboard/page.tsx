'use client'

import DashboardOverview from '@/components/dashboard/DashboardOverview'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CustomSession {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    id?: string
  }
  expires: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string }
  const router = useRouter()
  const [businessName, setBusinessName] = useState('Inventory Management Pro')
  const [businessLocation, setBusinessLocation] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
    
    // Load selected business location from localStorage
    const loadBusinessLocation = () => {
      const savedLocationId = localStorage.getItem('selectedBusinessLocation')
      if (savedLocationId) {
        // Mock data for business locations
        const businessLocations = [
          {
            id: '1',
            name: 'Main Warehouse',
            address: '123 Storage Street, Industrial District, ID 12345',
            type: 'Warehouse',
            status: 'active'
          },
          {
            id: '2',
            name: 'Downtown Store',
            address: '456 Main Avenue, Downtown, DT 67890',
            type: 'Retail Store',
            status: 'active'
          },
          {
            id: '3',
            name: 'North Branch',
            address: '789 North Road, Northern District, ND 54321',
            type: 'Retail Store',
            status: 'active'
          }
        ]
        
        const location = businessLocations.find(loc => loc.id === savedLocationId)
        if (location) {
          setBusinessName(location.name)
          setBusinessLocation(location.address)
        }
      }
    }

    // Listen for changes to the selected business location
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedBusinessLocation') {
        const businessLocations = [
          {
            id: '1',
            name: 'Main Warehouse',
            address: '123 Storage Street, Industrial District, ID 12345',
            type: 'Warehouse',
            status: 'active'
          },
          {
            id: '2',
            name: 'Downtown Store',
            address: '456 Main Avenue, Downtown, DT 67890',
            type: 'Retail Store',
            status: 'active'
          },
          {
            id: '3',
            name: 'North Branch',
            address: '789 North Road, Northern District, ND 54321',
            type: 'Retail Store',
            status: 'active'
          }
        ]
        
        if (e.newValue) {
          const location = businessLocations.find(loc => loc.id === e.newValue)
          if (location) {
            setBusinessName(location.name)
            setBusinessLocation(location.address)
          }
        } else {
          setBusinessName('Inventory Management Pro')
          setBusinessLocation('')
        }
      }
    }

    // Listen for custom event dispatched from business settings page
    const handleBusinessLocationChange = (e: CustomEvent) => {
      setBusinessName(e.detail.name)
      setBusinessLocation(e.detail.address)
    }

    if (status === 'authenticated') {
      loadBusinessLocation()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('businessLocationChanged', handleBusinessLocationChange as EventListener)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('businessLocationChanged', handleBusinessLocationChange as EventListener)
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div>
      <DashboardOverview businessName={businessName} businessLocation={businessLocation} />
    </div>
  )
}
