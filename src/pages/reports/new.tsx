import React from 'react'
import type { NextPage } from 'next'
import { Layout } from '@/components/layout/Layout'
import { ReportForm } from '@/components/reports/ReportForm'
import { Patient } from '@/types/patient'

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
  email: string
  phone: string
  schedule: any[]
  isActive: boolean
}

const NewReportPage: NextPage = () => {
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
    {
      id: '4',
      firstName: 'Luis',
      lastName: 'Martín',
      email: 'luis.martin@email.com',
      phone: '+1 (555) 456-7890',
      dateOfBirth: new Date('1965-09-12'),
      gender: 'M',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '5',
      firstName: 'Carmen',
      lastName: 'Ruiz',
      email: 'carmen.ruiz@email.com',
      phone: '+1 (555) 567-8901',
      dateOfBirth: new Date('1990-12-03'),
      gender: 'F',
      createdAt: new Date('2024-01-22'),
      updatedAt: new Date('2024-02-01'),
    },
    {
      id: '6',
      firstName: 'José',
      lastName: 'Fernández',
      email: 'jose.fernandez@email.com',
      phone: '+1 (555) 678-9012',
      dateOfBirth: new Date('1955-04-18'),
      gender: 'M',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-28'),
    },
    {
      id: '7',
      firstName: 'Patricia',
      lastName: 'López',
      email: 'patricia.lopez@email.com',
      phone: '+1 (555) 789-0123',
      dateOfBirth: new Date('1988-06-25'),
      gender: 'F',
      createdAt: new Date('2024-01-30'),
      updatedAt: new Date('2024-02-03'),
    },
    {
      id: '8',
      firstName: 'Roberto',
      lastName: 'García',
      email: 'roberto.garcia@email.com',
      phone: '+1 (555) 890-1234',
      dateOfBirth: new Date('1972-10-14'),
      gender: 'M',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '9',
      firstName: 'Sandra',
      lastName: 'Morales',
      email: 'sandra.morales@email.com',
      phone: '+1 (555) 901-2345',
      dateOfBirth: new Date('1995-02-08'),
      gender: 'F',
      createdAt: new Date('2024-02-02'),
      updatedAt: new Date('2024-02-06'),
    },
    {
      id: '10',
      firstName: 'Miguel',
      lastName: 'Torres',
      email: 'miguel.torres@email.com',
      phone: '+1 (555) 012-3456',
      dateOfBirth: new Date('1980-08-30'),
      gender: 'M',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-12'),
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
      schedule: [],
      isActive: true,
    },
    {
      id: '2',
      firstName: 'Ana',
      lastName: 'López',
      specialty: 'Endocrinología',
      email: 'ana.lopez@medixone.com',
      phone: '+1 (555) 100-0002',
      schedule: [],
      isActive: true,
    },
    {
      id: '3',
      firstName: 'Luis',
      lastName: 'Martínez',
      specialty: 'Cardiología',
      email: 'luis.martinez@medixone.com',
      phone: '+1 (555) 100-0003',
      schedule: [],
      isActive: true,
    },
    {
      id: '4',
      firstName: 'María',
      lastName: 'García',
      specialty: 'Neurología',
      email: 'maria.garcia@medixone.com',
      phone: '+1 (555) 100-0004',
      schedule: [],
      isActive: true,
    },
    {
      id: '5',
      firstName: 'Carlos',
      lastName: 'Fernández',
      specialty: 'Pediatría',
      email: 'carlos.fernandez@medixone.com',
      phone: '+1 (555) 100-0005',
      schedule: [],
      isActive: true,
    },
    {
      id: '6',
      firstName: 'Carmen',
      lastName: 'Ruiz',
      specialty: 'Ginecología',
      email: 'carmen.ruiz@medixone.com',
      phone: '+1 (555) 100-0006',
      schedule: [],
      isActive: true,
    },
    {
      id: '7',
      firstName: 'José',
      lastName: 'Morales',
      specialty: 'Ortopedia',
      email: 'jose.morales@medixone.com',
      phone: '+1 (555) 100-0007',
      schedule: [],
      isActive: true,
    },
    {
      id: '8',
      firstName: 'Patricia',
      lastName: 'Torres',
      specialty: 'Dermatología',
      email: 'patricia.torres@medixone.com',
      phone: '+1 (555) 100-0008',
      schedule: [],
      isActive: true,
    },
    {
      id: '9',
      firstName: 'Roberto',
      lastName: 'Herrera',
      specialty: 'Psiquiatría',
      email: 'roberto.herrera@medixone.com',
      phone: '+1 (555) 100-0009',
      schedule: [],
      isActive: true,
    },
    {
      id: '10',
      firstName: 'Sandra',
      lastName: 'Mendoza',
      specialty: 'Oftalmología',
      email: 'sandra.mendoza@medixone.com',
      phone: '+1 (555) 100-0010',
      schedule: [],
      isActive: true,
    },
  ]

  return (
    <Layout title="Nuevo Reporte Médico">
      <div className="max-w-5xl mx-auto">
        <ReportForm patients={mockPatients} doctors={mockDoctors} />
      </div>
    </Layout>
  )
}

export default NewReportPage
