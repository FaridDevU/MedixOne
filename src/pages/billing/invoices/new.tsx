import React from 'react'
import type { NextPage } from 'next'
import { Layout } from '@/components/layout/Layout'
import { InvoiceForm } from '@/components/billing/InvoiceForm'

// Tipos locales para la página
interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth: Date
  gender: 'M' | 'F' | 'OTHER'
  allergies?: string
  createdAt: Date
  updatedAt: Date
}

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

interface MedicalService {
  id: string
  name: string
  code: string
  category: string
  description: string
  basePrice: number
  duration: number
  isActive: boolean
  isTaxable: boolean
  insuranceCoverage: any[]
  createdAt: Date
  updatedAt: Date
}

const NewInvoicePage: NextPage = () => {
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
      allergies: 'Penicilina, Sulfonamidas',
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
      allergies: 'Aspirina',
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
  ]

  const mockServices: MedicalService[] = [
    // Consultas
    {
      id: '1',
      name: 'Consulta Médica General',
      code: 'CMG001',
      category: 'CONSULTATION',
      description: 'Consulta médica general con examen físico completo y evaluación de síntomas',
      basePrice: 75.0,
      duration: 30,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Consulta Especializada Cardiología',
      code: 'CEC001',
      category: 'CONSULTATION',
      description: 'Consulta especializada en cardiología con evaluación cardiovascular completa',
      basePrice: 150.0,
      duration: 45,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Consulta Especializada Endocrinología',
      code: 'CEE001',
      category: 'CONSULTATION',
      description: 'Consulta especializada en endocrinología y metabolismo',
      basePrice: 140.0,
      duration: 45,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Consulta Neurológica',
      code: 'CNE001',
      category: 'CONSULTATION',
      description: 'Consulta especializada en neurología y sistema nervioso',
      basePrice: 160.0,
      duration: 50,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Procedimientos
    {
      id: '5',
      name: 'Electrocardiograma (ECG)',
      code: 'ECG001',
      category: 'PROCEDURE',
      description: 'Electrocardiograma de 12 derivaciones con interpretación médica',
      basePrice: 45.0,
      duration: 15,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'Ecocardiograma Doppler',
      code: 'ECD001',
      category: 'PROCEDURE',
      description: 'Ecocardiograma con Doppler color para evaluación cardíaca',
      basePrice: 180.0,
      duration: 30,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '7',
      name: 'Espirometría',
      code: 'ESP001',
      category: 'PROCEDURE',
      description: 'Prueba de función pulmonar completa con broncodilatador',
      basePrice: 65.0,
      duration: 20,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Laboratorio
    {
      id: '8',
      name: 'Hemograma Completo',
      code: 'LAB001',
      category: 'LABORATORY',
      description: 'Análisis completo de sangre con conteo celular diferencial',
      basePrice: 35.0,
      duration: 60,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '9',
      name: 'Perfil Lipídico',
      code: 'LAB002',
      category: 'LABORATORY',
      description: 'Análisis de colesterol total, HDL, LDL y triglicéridos',
      basePrice: 40.0,
      duration: 90,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '10',
      name: 'Glucosa en Ayunas',
      code: 'LAB003',
      category: 'LABORATORY',
      description: 'Determinación de glucosa sérica en ayunas',
      basePrice: 20.0,
      duration: 30,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '11',
      name: 'Hemoglobina Glicosilada (HbA1c)',
      code: 'LAB004',
      category: 'LABORATORY',
      description: 'Control de diabetes - promedio de glucosa de los últimos 3 meses',
      basePrice: 55.0,
      duration: 120,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '12',
      name: 'Examen General de Orina',
      code: 'LAB005',
      category: 'LABORATORY',
      description: 'Análisis físico, químico y microscópico de orina',
      basePrice: 25.0,
      duration: 45,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Imagenología
    {
      id: '13',
      name: 'Radiografía de Tórax',
      code: 'RXT001',
      category: 'IMAGING',
      description: 'Radiografía de tórax PA y lateral con interpretación radiológica',
      basePrice: 80.0,
      duration: 20,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '14',
      name: 'Ecografía Abdominal',
      code: 'ECA001',
      category: 'IMAGING',
      description: 'Ecografía abdominal completa con evaluación de órganos',
      basePrice: 120.0,
      duration: 30,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '15',
      name: 'Mamografía Bilateral',
      code: 'MAM001',
      category: 'IMAGING',
      description: 'Mamografía digital bilateral para detección temprana',
      basePrice: 150.0,
      duration: 25,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Terapias
    {
      id: '16',
      name: 'Fisioterapia Sesión',
      code: 'FIS001',
      category: 'THERAPY',
      description: 'Sesión de fisioterapia personalizada para rehabilitación',
      basePrice: 60.0,
      duration: 60,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '17',
      name: 'Terapia Respiratoria',
      code: 'TER001',
      category: 'THERAPY',
      description: 'Sesión de terapia respiratoria con nebulizaciones',
      basePrice: 45.0,
      duration: 45,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Vacunación
    {
      id: '18',
      name: 'Vacuna Influenza',
      code: 'VAC001',
      category: 'VACCINATION',
      description: 'Vacuna contra la influenza estacional',
      basePrice: 30.0,
      duration: 10,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '19',
      name: 'Vacuna COVID-19',
      code: 'VAC002',
      category: 'VACCINATION',
      description: 'Vacuna contra COVID-19 (dosis según esquema)',
      basePrice: 25.0,
      duration: 15,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    // Procedimientos menores
    {
      id: '20',
      name: 'Sutura Simple',
      code: 'SUT001',
      category: 'PROCEDURE',
      description: 'Sutura de herida simple con material no reabsorbible',
      basePrice: 85.0,
      duration: 30,
      isActive: true,
      isTaxable: true,
      insuranceCoverage: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <Layout title="Nueva Factura Médica">
      <div className="max-w-6xl mx-auto">
        <InvoiceForm patients={mockPatients} doctors={mockDoctors} services={mockServices} />
      </div>
    </Layout>
  )
}

export default NewInvoicePage
