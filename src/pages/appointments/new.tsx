import React from 'react'
import type { NextPage } from 'next'
import { Layout } from '@/components/layout/Layout'
import { AppointmentForm } from '@/components/appointments/AppointmentForm'
import { Patient } from '@/types/patient'

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
  email: string
  phone: string
  schedule: {
    dayOfWeek: number
    startTime: string
    endTime: string
    isAvailable: boolean
  }[]
  isActive: boolean
}

const NewAppointmentPage: NextPage = () => {
  // Datos mock - en producción vendrían de APIs
  const mockPatients: Patient[] = [
    {
      id: '1',
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@email.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'F',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@email.com',
      phone: '+1 (555) 234-5678',
      dateOfBirth: new Date('1978-07-22'),
      gender: 'M',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'Herrera',
      email: 'ana.herrera@email.com',
      phone: '+1 (555) 345-6789',
      dateOfBirth: new Date('1992-11-08'),
      gender: 'F',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05'),
    },
  ]

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Rodríguez',
      specialty: 'Medicina General',
      email: 'juan.rodriguez@medixone.com',
      phone: '+1 (555) 100-0001',
      schedule: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '08:00', endTime: '15:00', isAvailable: true },
      ],
      isActive: true,
    },
    {
      id: '2',
      firstName: 'Ana',
      lastName: 'López',
      specialty: 'Cardiología',
      email: 'ana.lopez@medixone.com',
      phone: '+1 (555) 100-0002',
      schedule: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '16:00', isAvailable: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '16:00', isAvailable: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '16:00', isAvailable: true },
      ],
      isActive: true,
    },
    {
      id: '3',
      firstName: 'Luis',
      lastName: 'Martínez',
      specialty: 'Cirugía General',
      email: 'luis.martinez@medixone.com',
      phone: '+1 (555) 100-0003',
      schedule: [
        { dayOfWeek: 2, startTime: '07:00', endTime: '15:00', isAvailable: true },
        { dayOfWeek: 4, startTime: '07:00', endTime: '15:00', isAvailable: true },
        { dayOfWeek: 6, startTime: '08:00', endTime: '12:00', isAvailable: true },
      ],
      isActive: true,
    },
  ]

  const mockExistingAppointments = [
    {
      id: '1',
      doctorId: '1',
      date: new Date(),
      startTime: '09:00',
      status: 'CONFIRMED',
    },
    {
      id: '2',
      doctorId: '1',
      date: new Date(),
      startTime: '10:00',
      status: 'SCHEDULED',
    },
  ]

  return (
    <Layout title="Nueva Cita">
      <div className="max-w-4xl mx-auto">
        <AppointmentForm
          patients={mockPatients}
          doctors={mockDoctors}
          existingAppointments={mockExistingAppointments}
        />
      </div>
    </Layout>
  )
}

export default NewAppointmentPage
